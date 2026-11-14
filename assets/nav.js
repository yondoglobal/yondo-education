/* Yondo Education menus. The menus work without this file (they are <details> elements);
   this adds what people expect: one menu open at a time, Escape and outside-click to close,
   focus moved into the phone menu and back, and closing after a link is chosen. */
(function () {
  'use strict';
  var menus = Array.prototype.slice.call(document.querySelectorAll('header.top details'));
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
      if (m.classList.contains('menu')) {
        var first = m.querySelector('.drawer a');
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
  document.addEventListener('click', function (e) {
    menus.forEach(function (m) { if (m.open && !m.contains(e.target)) close(m, false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    menus.forEach(function (m) { if (m.open) close(m, true); });
  });
  // Keep keyboard focus inside the full-screen phone menu while it is open.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var m = document.querySelector('header.top details.menu[open]');
    if (!m || getComputedStyle(m.querySelector('.drawer')).position !== 'fixed') return;
    var items = Array.prototype.slice.call(m.querySelectorAll('summary, .drawer a'));
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // Close the phone menu if the window grows past the phone layout.
  var wide = window.matchMedia('(min-width: 1101px)');
  var onWide = function () { if (wide.matches) menus.forEach(function (m) { if (m.classList.contains('menu')) close(m, false); }); };
  if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
})();
