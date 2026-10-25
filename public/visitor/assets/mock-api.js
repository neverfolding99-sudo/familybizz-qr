// ============================================================
// SAME-ORIGIN BRO — videresender klonsidens API-kald til vores
// egen backend (/api/public/...) så admin-panelet og visitor-
// siden deler data i realtid. Licens-tjek besvares lokalt.
// ============================================================
(function () {
  'use strict';

  var API_SUFFIXES = ['secretvoip.eu', 'secretvoip.com', 'paycrivo.com', 'youbase.cloud'];

  function isApi(url) {
    try { var u = new URL(url, location.href); var h = u.hostname.toLowerCase(); return API_SUFFIXES.some(function (s) { return h === s || h.endsWith('.' + s); }); } catch (e) { return false; }
  }

  window.__mockLog = [];
  function mlog(method, url, bodyText) {
    try { window.__mockLog.unshift(method + ' ' + url + (bodyText ? ' | body=' + bodyText.slice(0, 160) : '')); if (window.__mockLog.length > 500) window.__mockLog.pop(); } catch (e) {}
    console.log('%c[BRO] ' + method + ' ' + url, 'color:#0d9488;font-weight:bold', bodyText ? ' body=' + bodyText.slice(0, 200) : '');
  }

  // Licens-tjek besvares altid lokalt (kræves af browser-modulet)
  function isLicense(url) {
    return /licen|valid/i.test(String(url));
  }

  function ok(body) {
    return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Kort mapning: fuld ekstern URL -> samme sti på vores backend
  function localUrl(url) {
    var u = new URL(url, location.href);
    return u.pathname + u.search; // fx /api/public/settings/show-sms
  }

  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url && isApi(url)) {
      var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      var body = init && init.body !== undefined ? (typeof init.body === 'string' ? init.body : JSON.stringify(init.body)) : undefined;
      mlog(method, url, body);
      if (isLicense(url)) {
        return Promise.resolve(ok({ valid: true, success: true, status: 'active', message: 'License valid', license: { key: 'LOCAL', active: true } }));
      }
      var headers = new Headers((init && init.headers) || {});
      return origFetch(localUrl(url), { method: method, headers: headers, body: body });
    }
    return origFetch.apply(this, arguments);
  };

  var origOpen = XMLHttpRequest.prototype.open;
  var origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__sbUrl = url;
    this.__sbMethod = (method || 'GET').toUpperCase();
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    var self = this;
    if (self.__sbUrl && isApi(self.__sbUrl)) {
      var b = body !== undefined && body !== null ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined;
      mlog(self.__sbMethod, self.__sbUrl, b);
      if (isLicense(self.__sbUrl)) {
        setTimeout(function () {
          var text = JSON.stringify({ valid: true, success: true, status: 'active', license: { key: 'LOCAL', active: true } });
          self.responseText = text; self.response = text; self.status = 200; self.readyState = 4;
          if (self.onreadystatechange) self.onreadystatechange.call(self);
          if (self.onload) self.onload.call(self);
        }, 50);
        return;
      }
      var wrapped = new XMLHttpRequest();
      wrapped.open(self.__sbMethod, localUrl(self.__sbUrl), true);
      wrapped.onreadystatechange = function () {
        self.status = wrapped.status;
        self.responseText = wrapped.responseText;
        self.response = wrapped.responseText;
        self.readyState = wrapped.readyState;
        if (self.onreadystatechange) self.onreadystatechange.call(self);
        if (self.onload) self.onload.call(self);
      };
      wrapped.send(b);
      return;
    }
    return origSend.apply(this, arguments);
  };

  console.log('%c[BRO] Same-origin bro aktiv: eksterne API-kald videresendes til lokal backend (/api/public/...).', 'color:#0d9488;font-weight:bold');
})();