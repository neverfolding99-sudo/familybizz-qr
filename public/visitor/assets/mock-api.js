// ============================================================
// SANDBOX-BRO (analyse) — erstatter de hardcodede mock-svar
// Fanger alle kald til eksterne API'er og videresender dem til
// den lokale sandbox-backend (same-origin /__sandbox).
// Data gemmes i serverens sandbox_data.json (persistens).
// ============================================================
(function () {
  'use strict';

  var API_SUFFIXES = ['secretvoip.eu', 'secretvoip.com', 'paycrivo.com', 'youbase.cloud', 'youware.com'];

  function isApi(url) {
    try { var u = new URL(url, location.href); var h = u.hostname.toLowerCase(); return API_SUFFIXES.some(function (s) { return h === s || h.endsWith('.' + s); }); } catch (e) { return false; }
  }

  window.__mockLog = [];
  function mlog(method, url, bodyText) {
    try { window.__mockLog.unshift(method + ' ' + url + (bodyText ? ' | body=' + bodyText.slice(0, 160) : '')); if (window.__mockLog.length > 500) window.__mockLog.pop(); } catch (e) {}
    console.log('%c[SANDBOX] ' + method + ' ' + url, 'color:#0d9488;font-weight:bold', bodyText ? ' body=' + bodyText.slice(0, 200) : '');
  }

  // ---------- fetch ----------
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url && isApi(url)) {
      var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      var body = init && init.body !== undefined ? (typeof init.body === 'string' ? init.body : JSON.stringify(init.body)) : undefined;
      mlog(method, url, body);
      var headers = new Headers((init && init.headers) || {});
      headers.set('X-Sandbox-Original-Url', url);
      headers.set('X-Sandbox-Original-Method', method);
      headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
      return origFetch('/__sandbox', { method: 'POST', headers: headers, body: body });
    }
    return origFetch.apply(this, arguments);
  };

  // ---------- XMLHttpRequest ----------
  var origOpen = XMLHttpRequest.prototype.open;
  var origSend = XMLHttpRequest.prototype.send;
  var origSet = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__sbUrl = url;
    this.__sbMethod = (method || 'GET').toUpperCase();
    this.__sbHeaders = {};
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.setRequestHeader = function (k, v) { this.__sbHeaders = this.__sbHeaders || {}; this.__sbHeaders[k] = v; return origSet.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function (body) {
    var self = this;
    if (self.__sbUrl && isApi(self.__sbUrl)) {
      var b = body !== undefined && body !== null ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined;
      mlog(self.__sbMethod, self.__sbUrl, b);
      var h = new Headers();
      h.set('X-Sandbox-Original-Url', self.__sbUrl);
      h.set('X-Sandbox-Original-Method', self.__sbMethod);
      origSet.call(self, 'X-Sandbox-Original-Url', self.__sbUrl);
      origSet.call(self, 'X-Sandbox-Original-Method', self.__sbMethod);
      var wrapped = new XMLHttpRequest();
      wrapped.open('POST', '/__sandbox', true);
      for (var k in self.__sbHeaders) { try { wrapped.setRequestHeader(k, self.__sbHeaders[k]); } catch (e) {} }
      wrapped.onreadystatechange = function () {
        self.status = wrapped.status;
        self.responseText = wrapped.responseText;
        self.response = wrapped.responseText;
        self.readyState = 4;
        if (self.onreadystatechange) self.onreadystatechange.call(self);
        if (self.onload) self.onload.call(self);
      };
      wrapped.send(b);
      return self;
    }
    return origSend.apply(this, arguments);
  };

  console.log('%c[SANDBOX] Bro aktiv: eksterne API-kald -> lokal sandbox-backend. Data er VIRKELIGE i sandboxen.', 'color:#0d9488;font-weight:bold');
})();