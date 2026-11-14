/* Yondo Education menus. They work without this file (they are <details> elements);
   this adds what people expect: one menu open at a time, Escape and outside-click to close,
   focus moved into the phone "More" sheet and back, and closing after a link is chosen. */
(function () {
  'use strict';
  var menus = Array.prototype.slice.call(document.querySelectorAll('header.top details, nav.tabbar details'));
  if (!menus.length) return;
  function close(m, returnFocus) {
    if (!m.open) return;
    m.open = false;
    if (returnFocus) { var s = m.querySelector('summary'); if (s) s.focus(); }
  }
  menus.forEach(function (m) {
    var summary = m.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', String(m.open));
    m.addEventListener('toggle', function () {
      if (summary) summary.setAttribute('aria-expanded', String(m.open));
      if (!m.open) return;
      menus.forEach(function (o) { if (o !== m) close(o, false); });
      if (m.classList.contains('more')) {
        var first = m.querySelector('.sheet a');
        if (first) setTimeout(function () { first.focus(); }, 30);
      }
    });
    Array.prototype.forEach.call(m.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { close(m, false); });
    });
    m.addEventListener('focusout', function (e) {
      if (m.classList.contains('dd') && e.relatedTarget && !m.contains(e.relatedTarget)) close(m, false);
    });
  });
  // Outside click (including the dimmed backdrop behind the More sheet) closes.
  document.addEventListener('click', function (e) {
    menus.forEach(function (m) {
      if (!m.open) return;
      var sheet = m.querySelector('.sheet'), summary = m.querySelector('summary');
      var inside = sheet ? (sheet.contains(e.target) || summary.contains(e.target)) : m.contains(e.target);
      if (!inside) { e.preventDefault(); close(m, false); }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    menus.forEach(function (m) { if (m.open) close(m, true); });
  });
  // Keep keyboard focus inside the More sheet while it is open.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var m = document.querySelector('nav.tabbar details.more[open]');
    if (!m) return;
    var items = Array.prototype.slice.call(m.querySelectorAll('summary, .sheet a'));
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // Close the More sheet if the window grows past the phone and tablet layout.
  var wide = window.matchMedia('(min-width: 1101px)');
  var onWide = function () { if (wide.matches) menus.forEach(function (m) { if (m.classList.contains('more')) close(m, false); }); };
  if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
})();
