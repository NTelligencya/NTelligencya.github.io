(function () {
  'use strict';

  var chapters = Array.prototype.slice.call(document.querySelectorAll('.hp-chapter'));
  var header = document.querySelector('header.site');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var keyboardStage = document.querySelector('[data-scene="home"] .hp-stage');
  var keyboard = keyboardStage ? keyboardStage.querySelector('.hp-home-keyboard') : null;
  var scheduled = false;
  var keyboardFrame = 0;
  var keyboardTarget = { x: 0, y: 0, rotation: 0, scale: 1 };
  var keyboardCurrent = { x: 0, y: 0, rotation: 0, scale: 1 };

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

  function applyKeyboardMotion() {
    keyboardFrame = 0;
    var easing = 0.12;
    var largestDelta = 0;

    Object.keys(keyboardCurrent).forEach(function (key) {
      var delta = keyboardTarget[key] - keyboardCurrent[key];
      keyboardCurrent[key] += delta * easing;
      largestDelta = Math.max(largestDelta, Math.abs(delta));
    });

    var lift = clamp(-keyboardCurrent.y / 8);
    keyboard.style.setProperty('--keyboard-x', keyboardCurrent.x.toFixed(2) + 'px');
    keyboard.style.setProperty('--keyboard-y', keyboardCurrent.y.toFixed(2) + 'px');
    keyboard.style.setProperty('--keyboard-r', keyboardCurrent.rotation.toFixed(3) + 'deg');
    keyboard.style.setProperty('--keyboard-scale', keyboardCurrent.scale.toFixed(4));
    keyboard.style.setProperty('--keyboard-shadow-y', (8 + lift * 5).toFixed(2) + 'px');
    keyboard.style.setProperty('--keyboard-shadow-blur', (12 + lift * 5).toFixed(2) + 'px');
    keyboard.style.setProperty('--keyboard-shadow-alpha', (0.24 + lift * 0.06).toFixed(3));

    if (largestDelta > 0.002) {
      keyboardFrame = window.requestAnimationFrame(applyKeyboardMotion);
    }
  }

  function requestKeyboardMotion() {
    if (keyboardFrame) return;
    keyboardFrame = window.requestAnimationFrame(applyKeyboardMotion);
  }

  function updateKeyboardTarget(event) {
    var rect = keyboardStage.getBoundingClientRect();
    var pointerX = clamp((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    var pointerY = clamp((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
    var lift = clamp((1 - pointerY) / 2);

    keyboardTarget.x = pointerX * 4;
    keyboardTarget.y = lift * -8;
    keyboardTarget.rotation = pointerX * 0.2;
    keyboardTarget.scale = 1 + lift * 0.003;
    requestKeyboardMotion();
  }

  function resetKeyboardTarget() {
    keyboardTarget.x = 0;
    keyboardTarget.y = 0;
    keyboardTarget.rotation = 0;
    keyboardTarget.scale = 1;
    requestKeyboardMotion();
  }

  measureHeader();
  if (!reducedMotion) {
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }
  if (keyboard && finePointer && !reducedMotion) {
    keyboardStage.addEventListener('pointermove', updateKeyboardTarget, { passive: true });
    keyboardStage.addEventListener('pointerleave', resetKeyboardTarget);
    keyboardStage.addEventListener('pointercancel', resetKeyboardTarget);
  }
  update();
}());
