(function () {
  'use strict';

  var chapters = Array.prototype.slice.call(document.querySelectorAll('.hp-chapter'));
  var header = document.querySelector('header.site');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scheduled = false;

  if (!chapters.length) return;

  function clamp(value, min, max) {
    return Math.min(max === undefined ? 1 : max, Math.max(min === undefined ? 0 : min, value));
  }

  function measureHeader() {
    var height = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--hp-header-height', height + 'px');
    return height;
  }

  function update() {
    scheduled = false;
    var viewportHeight = window.innerHeight;
    var headerHeight = measureHeader();

    chapters.forEach(function (chapter) {
      var rect = chapter.getBoundingClientRect();
      if (rect.bottom < -viewportHeight || rect.top > viewportHeight * 2) return;

      var travel = Math.max(1, rect.height - viewportHeight + headerHeight);
      var progress = clamp((headerHeight - rect.top) / travel);
      var centred = (progress - 0.5) * 2;
      var motion = Number(chapter.getAttribute('data-motion') || 1);
      var scene = chapter.getAttribute('data-scene');

      chapter.querySelectorAll('[data-depth]').forEach(function (layer) {
        var depth = Number(layer.getAttribute('data-depth') || 0);
        layer.style.setProperty('--hp-x', (centred * depth * -28 * motion).toFixed(2) + 'px');
        layer.style.setProperty('--hp-y', (centred * depth * 115 * motion).toFixed(2) + 'px');

        if (layer.classList.contains('hp-glow')) {
          var lift = clamp((progress - 0.12) / 0.62);
          var brightnessGain = scene === 'tools' ? 0.18 : 0.14;
          var haloSize = scene === 'tools' ? 22 : 18;
          var haloAlpha = scene === 'tools' ? 0.26 : 0.22;
          layer.style.setProperty('--hp-bright', (1 + lift * brightnessGain).toFixed(3));
          layer.style.setProperty('--hp-halo', (lift * haloSize).toFixed(1) + 'px');
          layer.style.setProperty('--hp-halo-alpha', (lift * haloAlpha).toFixed(3));
        }
      });
    });

    var pageTravel = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
    document.documentElement.style.setProperty('--hp-site-progress', clamp(window.scrollY / pageTravel).toFixed(4));
  }

  function requestUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  measureHeader();
  if (!reducedMotion) {
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }
  update();
}());
