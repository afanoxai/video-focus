/* Video Focus - keeps short-form and recommendation surfaces out of the page.
   No UI, no storage, no settings: there is nothing for the user to switch off. */

(function () {
  'use strict';

  var SHORTS_PATH = /^\/shorts(\/|$)/;
  var SHORTS_LINK = 'a[href^="/shorts"]';

  // 1. Shorts are a single-page-app route, so a hard URL block never sees them.
  //    Turn the route back into a normal navigation target and send it home.
  function divertShortsPath() {
    try {
      if (SHORTS_PATH.test(location.pathname)) {
        location.replace('/');
        return true;
      }
    } catch (e) { /* ignore */ }
    return false;
  }

  // 2. Remove Shorts entries and shelves as the page builds itself.
  function sweep(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll
      ? scope.querySelectorAll(SHORTS_LINK + ',' +
          'ytd-reel-shelf-renderer,ytd-shorts,ytm-shorts-lockup-view-model,' +
          'ytd-guide-entry-renderer:has(a[href="/shorts"]),' +
          'ytd-mini-guide-entry-renderer:has(a[href="/shorts"])')
      : [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var el = n.closest ? (n.closest('ytd-reel-shelf-renderer,ytd-shorts,ytd-guide-entry-renderer,ytd-mini-guide-entry-renderer,ytm-shorts-lockup-view-model') || n) : n;
      if (el && el.style) { el.style.setProperty('display', 'none', 'important'); }
    }
  }

  // 3. Keep watching: YouTube rebuilds its DOM on every route change.
  function startObserver() {
    if (!document.documentElement) { return; }
    try {
      var mo = new MutationObserver(function () { sweep(document); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) { /* ignore */ }
  }

  function onNavigate() {
    if (divertShortsPath()) { return; }
    sweep(document);
  }

  divertShortsPath();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onNavigate, { once: true });
  } else {
    onNavigate();
  }
  document.addEventListener('yt-navigate-finish', onNavigate);
  document.addEventListener('yt-page-data-updated', onNavigate);
  startObserver();
})();
