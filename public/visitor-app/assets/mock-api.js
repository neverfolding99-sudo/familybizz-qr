// ============================================================
// LOCAL MOCK BACKEND — analysemiljø (demo-data, offline)
// Fanger alle kald fra panelet til eksterne API'er og svarer
// med knivene demo-data. Rører ALDRIG den rigtige backend.
// Alle kald logges i konsollen, så man kan se API-overfladen.
// ============================================================
(function () {
  'use strict';

  var API_HOSTS = ['api.secretvoip.eu', 'secretvoip.com', 'www.secretvoip.com', 'paycrivo.com'];
  var MOCK_PREFIX = 'mock';

  // ---------- demo data ----------
  var now = Date.now();
  var day = 86400000;

  window.__mockLog = [];
  function mlog(method, url, bodyText) {
    try {
      window.__mockLog.push(method + ' ' + url + (bodyText ? ' | body=' + bodyText.slice(0, 200) : ''));
      if (window.__mockLog.length > 500) window.__mockLog.shift();
    } catch (e) {}
    console.log('%c[MOCK] ' + method + ' ' + url, 'color:#7c3aed;font-weight:bold', bodyText ? ' body=' + bodyText.slice(0, 300) : '');
  }

  function demoVisitors() {
    var rows = [];
    var names = ['Demo_1001', 'Demo_1002', 'Demo_1003', 'Demo_1004', 'Demo_1005', 'Demo_1006'];
    var oses = ['Windows 11', 'Windows 10', 'Android 14', 'iOS 17.5', 'macOS 14'];
    var browsers = ['Chrome 126', 'Chrome 125', 'Safari 17', 'Edge 126', 'Firefox 128'];
    var countries = ['DK', 'DE', 'SE', 'NO'];
    var idx = ['pending', 'success', 'failed'];
    for (var i = 0; i < 6; i++) {
      rows.push({
        id: 'demo-' + (1000 + i),
        userid: 'usr_' + (1000 + i),
        uniqueUser: 'vis_' + (1000 + i),
        username: names[i],
        os: oses[i % oses.length],
        browser: browsers[i % browsers.length],
        ipAddress: '192.0.2.' + (10 + i),
        country: countries[i % countries.length],
        status: idx[i % idx.length],
        entered: now - i * 60000,
        lastSeen: now - i * 30000,
        type: i % 3 === 0 ? 'sms' : i % 3 === 1 ? 'otp' : 'password',
        amount: ['500 DKK', '', '2.400 DKK'][i % 3],
      });
    }
    return rows;
  }

  function demoLogins() {
    var rows = [];
    var users = ['Anna.Andersen', 'demo_user_42', 'Lars.Hansen', 'demo_guest_7'];
    var statuses = ['pending', 'success', 'failed'];
    for (var i = 0; i < 3; i++) {
      rows.push({
        id: 'log-' + (500 + i),
        userid: 'login_' + (500 + i),
        username: users[i],
        status: statuses[i],
        time: now - i * 45000,
        ip: '192.0.2.' + (30 + i),
        browser: 'Chrome 126',
        os: 'Windows 11',
      });
    }
    return rows;
  }

  function demoSettings() {
    return {
      show_sms: true, show_otp: true, show_password: true, show_swipe: false,
      sms_amount: '500 DKK',
      connection_text: 'Forbinder sikkert...',
      login_button: 'Log på',
      verifying_text: 'Verificerer...',
      processing_text: 'Behandler',
      wait_text: 'Vent venligst',
      broadcast_message: '',
      broadcast_type: 'info',
      otp_code: '123456',
      title_text: 'MitID',
    };
  }

  function demoLicenses() {
    return [
      { id: 'lic_demo_1', key: 'DEMO-LIC-0001', status: 'active', expiresAt: now + 30 * day, activatedAt: now - 10 * day },
      { id: 'lic_demo_2', key: 'DEMO-LIC-0002', status: 'pending', expiresAt: now + 90 * day },
    ];
  }

  function demoStats() {
    return {
      visitors: 148, activeNow: 3, totalSms: 62, totalOtp: 41, totalPass: 25,
      successRate: 47, today: 12,
    };
  }

  function ok(body) {
    return { status: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  }

  function respondFor(url, method, bodyText) {
    var u;
    try { u = new URL(url); } catch (e) { return null; }
    var p = u.pathname;
    mlog(method, url, bodyText);

    // License validation (panel kræver en gyldig licens)
    if (/licen|valid/.test(p) || /license/i.test(u.hostname)) {
      return ok({
        valid: true, success: true,
        status: 'active', message: 'License valid',
        license: { key: 'DEMO-LIC-ACTIVE-0001', active: true, expiresAt: now + 365 * day },
      });
    }

    // Login / auth
    if (/login|auth|signin/.test(p) && method === 'POST') {
      return ok({
        success: true, valid: true,
        token: 'demo-token-{:random}',
        session: 'demo-session-{:random}',
        username: 'demo-admin',
        user: { id: 'demo-admin', name: 'Demo Admin', role: 'admin' },
      });
    }
    // Visitor / user logs
    if (/visitor|log|bes/.test(p) && method === 'GET') {
      if (/user-login/.test(p)) return ok({ logs: demoLogins(), count: 3 });
      return ok({ logs: demoVisitors(), count: 6 });
    }
    // Settings
    if (/settings/.test(p)) {
      return ok(demoSettings());
    }
    // otp/password/sms entered
    if (/otp-entered|password-entered|sms-codes/.test(p) && method === 'GET') {
      return ok([]);
    }
    // Licenses
    if (/licen/.test(p)) {
      return ok(demoLicenses());
    }
    // Stats
    if (/stat/.test(p)) {
      return ok(demoStats());
    }
    // Broadcast
    if (/broadcast|send/.test(p) && method === 'POST') {
      return ok({ success: true, broadcasted: 1 });
    }
    // Generic POST -> accepted
    if (method === 'POST') {
      return ok({ success: true });
    }
    // Generic GET -> empty array
    return ok([]);
  }

  // ---------- intercept fetch ----------
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
          return Promise.resolve(new Response(resp.body, {
            status: resp.status,
            headers: resp.headers,
          }));
        }
      }
    } catch (e) { /* pas */ }
    return origFetch.apply(this, arguments);
  };

  // ---------- intercept XMLHttpRequest ----------
  var origOpen = XMLHttpRequest.prototype.open;
  var origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__mockUrl = url;
    this.__mockMethod = (method || 'GET').toUpperCase();
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
          var text = resp ? resp.body : '';
          self.responseText = text;
          self.response = text;
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
    } catch (e) { /* pas */ }
    return origSend.apply(this, arguments);
  };

  console.log('%c[MOCK] Lokal mock-backend er aktiv — alle paneler-kald til eksterne API\'er svares med DEMO-data.', 'color:#7c3aed;font-weight:bold');
})();