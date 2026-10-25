// ============================================================
// LOCAL MOCK BACKEND — analysemiljø (demo-data, offline)
// Til ofre-siden (https://hej.rf.gd/?i=1 -> MitID phishing-side)
// Fanger alle kald til eksterne API'er og svarer med demo-data.
// Rører ALDRIG den rigtige backend. Alle kald logges.
// ============================================================
(function () {
  'use strict';

  var API_HOSTS = ['api.secretvoip.eu', 'secretvoip.com', 'www.secretvoip.com', 'paycrivo.com', 'staging--5ymyn3kg2eq20wt6xn8a.youbase.cloud'];
  var now = Date.now();

  window.__mockLog = [];
  function mlog(method, url, body) {
    try {
      window.__mockLog.push(method + ' ' + url + (body ? ' | body=' + body.slice(0, 200) : ''));
      if (window.__mockLog.length > 500) window.__mockLog.shift();
    } catch (e) {}
    console.log('%c[MOCK] ' + method + ' ' + url, 'color:#7c3aed;font-weight:bold', body ? ' body=' + body.slice(0, 200) : '');
  }

  function ok(body, status) {
    return { status: status || 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  }

  function settings() {
    return {
      show_sms: true, show_otp: true, show_password: true, show_swipe: false,
      sms_amount: '500 DKK',
      otp_code: '123456',
      connection_text: 'Forbinder sikkert',
      broadcast_message: '',
      broadcast_type: 'info',
      redirect_url: '',
    };
  }

  function respondFor(url, method, bodyText) {
    var u;
    try { u = new URL(url); } catch (e) { return null; }
    var p = u.pathname;
    mlog(method, url, bodyText);

    // License validation (kræves af browser-modulet)
    if (/licen|valid/.test(p) || /license/i.test(u.hostname)) {
      return ok({ valid: true, success: true, status: 'active', message: 'License valid', license: { key: 'DEMO', active: true } });
    }
    // Settings
    if (/settings/.test(p)) return ok(settings());
    // QR code til MitID app
    if (/current-qr/.test(p)) return ok({ qrData: 'https://mitid.dk/demo-login-' + Math.random().toString(36).slice(2, 8), data: 'demo-qr', valid: true, expiresAt: now + 60000 });
    // Offer-data poster -> accepteres (demo)
    if (/otp-entered|password-entered|sms-codes|user-logins|report-bot/.test(p) && method === 'POST') {
      return ok({ success: true, received: true });
    }
    // Polls (GET) -> tomme lister
    if (/otp-entered|password-entered|sms-codes|user-logins/.test(p)) return ok([]);
    // Generic POST
    if (method === 'POST') return ok({ success: true });
    // Generic GET -> tomt objekt/array
    return ok([]);
  }

  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var body = init && init.body ? String(init.body) : '';
    try {
      var u = new URL(url, location.href);
      var api = API_HOSTS.some(function (h) { return u.hostname === h || u.hostname.endsWith('.' + h); });
      if (api) {
        var resp = respondFor(u.toString(), method, body);
        if (resp) {
          return Promise.resolve(new Response(resp.body, { status: resp.status, headers: resp.headers }));
        }
      }
    } catch (e) {}
    return origFetch.apply(this, arguments);
  };

  var origOpen = XMLHttpRequest.prototype.open;
  var origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__mockUrl = url; this.__mockMethod = (method || 'GET').toUpperCase();
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    var self = this;
    try {
      var u = new URL(self.__mockUrl, location.href);
      var api = API_HOSTS.some(function (h) { return u.hostname === h || u.hostname.endsWith('.' + h); });
      if (api) {
        setTimeout(function () {
          var resp = respondFor(u.toString(), self.__mockMethod, body ? String(body) : '');
          self.responseText = resp ? resp.body : '[]';
          self.response = self.responseText;
          self.status = resp ? resp.status : 200;
          self.readyState = 4;
          self.statusText = 'OK';
          self.getResponseHeader = function () { return 'application/json'; };
          self.getAllResponseHeaders = function () { return 'Content-Type: application/json'; };
          if (self.onreadystatechange) self.onreadystatechange.call(self);
          if (self.onload) self.onload.call(self);
        }, 50);
        return;
      }
    } catch (e) {}
    return origSend.apply(this, arguments);
  };

  console.log('%c[MOCK] Lokal demo-backend aktiv for ofre-siden (MitID). Alle eksterne API-kald svares med DEMO-data.', 'color:#7c3aed;font-weight:bold');
})();