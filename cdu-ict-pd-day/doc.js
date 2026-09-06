/* ICT, CS and Digital PD Day. Two small enhancements; the page reads fully without them.
   1. "Show the whole file" on each skill block, so a long SKILL.md can be read without an inner scroll.
   2. The contents list marks the section currently in view. */
(function () {
  'use strict';

  // 1. skill blocks
  document.querySelectorAll('[data-skillfile]').forEach(function (box) {
    var btn = box.querySelector('[data-expand]');
    var pre = box.querySelector('.skillfile__pre');
    if (!btn || !pre) return;
    if (pre.scrollHeight <= pre.clientHeight + 8) return;   // short file: nothing to expand
    btn.hidden = false;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = box.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Collapse the file' : 'Show the whole file';
      if (!open) box.scrollIntoView({ block: 'start' });
    });
  });

  // 2. current section in the contents
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc__list a[href^="#"]'));
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  if (!targets.length || !('IntersectionObserver' in window)) return;
  var current = null;
  function mark(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + id); });
  }
  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    for (var i = 0; i < targets.length; i++) { if (visible[targets[i].id]) { mark(targets[i].id); return; } }
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  targets.forEach(function (t) { io.observe(t); });
  // fallback for the first paint: the section whose top is nearest above the reading line
  function nearest() {
    var line = window.innerHeight * 0.45, best = targets[0];
    targets.forEach(function (t) { if (t.getBoundingClientRect().top <= line) best = t; });
    mark(best.id);
  }
  nearest();
  window.addEventListener('scroll', function () { if (!Object.keys(visible).some(function (k) { return visible[k]; })) nearest(); }, { passive: true });
})();
