/* ============================================================
   NT World Ink, /flashcards/
   One script for three page types. The page tells the script what
   it is with data attributes on <body>:

     data-fc="catalogue"
     data-fc="player" data-slug="ism-abbreviations"
     data-fc="list"   data-slug="ism-abbreviations"

   A documented exception to the no-JS house rule, the same way
   /references/ is: the player renders one card at a time and the
   list view filters live, neither of which static markup can do.
   ============================================================ */

(function () {
  'use strict';

  var SETS_URL = '/flashcards/sets/sets.json';
  var SET_URL = function (slug) { return '/flashcards/sets/' + slug + '.json'; };
  var STORE_KEY = 'ntwi.flashcards';

  var body = document.body;
  var mode = body.getAttribute('data-fc');
  var slug = body.getAttribute('data-slug');

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function fail(node, what) {
    if (!node) return;
    node.innerHTML = '';
    node.appendChild(el('p', 'fc-empty', 'Sorry, ' + what + ' could not be loaded. Please reload the page.'));
  }

  /* --- Stored progress -------------------------------------- */
  /* One namespaced key holds every set's progress. Nothing else on
     the site writes to it, and this never writes to keys it does
     not own. */

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function writeStore(obj) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); }
    catch (e) { /* private browsing, a full quota; progress is not worth an error */ }
  }


  /* ============================================================
     CATALOGUE
     ============================================================ */

  function buildCatalogue() {
    var chipWrap = document.getElementById('fc-subjects');
    var grid = document.getElementById('fc-grid');
    if (!grid) return;

    fetch(SETS_URL).then(function (r) { return r.json(); }).then(function (data) {
      // A set only appears once its JSON exists; convert.js sets "ready".
      var sets = (data.sets || []).filter(function (s) { return s.ready; });
      var subjects = ['All sets'];
      sets.forEach(function (s) {
        if (subjects.indexOf(s.subject) === -1) subjects.push(s.subject);
      });

      var current = 'All sets';

      function draw() {
        grid.innerHTML = '';
        sets.filter(function (s) {
          return current === 'All sets' || s.subject === current;
        }).forEach(function (s) {
          var card = el('div', 'fc-set');

          var title = el('h2', 'fc-set-name', s.title);
          card.appendChild(title);

          var meta = el('div', 'fc-set-meta fc-label');
          meta.appendChild(el('span', 'fc-count', s.count + (s.count === 1 ? ' card' : ' cards')));
          meta.appendChild(el('span', 'fc-divider'));
          meta.appendChild(el('span', 'fc-level', s.level));
          card.appendChild(meta);

          var actions = el('div', 'fc-set-actions');

          var study = el('a', 'btn btn-primary btn-sm', 'Study');
          study.href = '/flashcards/' + s.slug + '/';
          study.appendChild(arrowSVG());
          actions.appendChild(study);

          var list = el('a', 'btn btn-ghost btn-sm', 'Read as a list');
          list.href = '/flashcards/' + s.slug + '/list/';
          actions.appendChild(list);

          card.appendChild(actions);
          grid.appendChild(card);
        });
      }

      if (chipWrap) {
        subjects.forEach(function (name) {
          var chip = el('button', 'fc-chip' + (name === current ? ' is-on' : ''), name);
          chip.type = 'button';
          chip.addEventListener('click', function () {
            current = name;
            Array.prototype.forEach.call(chipWrap.children, function (c) {
              c.classList.toggle('is-on', c === chip);
            });
            draw();
          });
          chipWrap.appendChild(chip);
        });
      }

      draw();
    }).catch(function () { fail(grid, 'the set list'); });
  }

  function arrowSVG() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'arrow');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', 'M5 12h14M13 6l6 6-6 6');
    svg.appendChild(p);
    return svg;
  }


  /* ============================================================
     STUDY PLAYER
     ============================================================ */

  function buildPlayer() {
    var stage = document.getElementById('fc-card');
    if (!stage) return;

    var elFaceLabel = document.getElementById('fc-face-label');
    var elFaceText = document.getElementById('fc-face-text');
    var elHint = document.getElementById('fc-hint');
    var elAnswers = document.getElementById('fc-answers');
    var elRemaining = document.getElementById('fc-remaining');
    var elGot = document.getElementById('fc-got');
    var elRepeat = document.getElementById('fc-repeat');
    var elBar = document.getElementById('fc-bar-fill');
    var elKeys = document.getElementById('fc-keys');

    var cards = [];
    var total = 0;
    var order = [];
    var pos = 0;
    var flipped = false;
    var reversed = false;
    var got = [];      // cleared; drops out of the deck
    var again = [];    // live "to repeat" queue; a card leaves it when got
    var lapses = [];   // cumulative, never cleared; drives the summary

    function has(arr, id) { return arr.indexOf(id) !== -1; }
    function add(arr, id) { if (!has(arr, id)) arr.push(id); }
    function drop(arr, id) { var i = arr.indexOf(id); if (i !== -1) arr.splice(i, 1); }

    function deck() {
      return order.filter(function (id) { return !has(got, id); });
    }

    function save() {
      var store = readStore();
      store[slug] = { got: got, lapses: lapses, n: total };
      writeStore(store);
    }

    function restore() {
      var saved = readStore()[slug];
      // If the set has been re-converted and the card count changed, the
      // stored indices no longer mean anything; start clean.
      if (!saved || saved.n !== total) return;
      got = (saved.got || []).filter(function (i) { return i >= 0 && i < total; });
      lapses = (saved.lapses || []).filter(function (i) { return i >= 0 && i < total; });
    }

    function faceSize(text) {
      if (text.length < 60) return 'is-short';
      if (text.length < 120) return 'is-medium';
      return 'is-long';
    }

    function draw() {
      var d = deck();
      if (pos >= d.length) pos = 0;

      elRemaining.textContent = d.length + ' of ' + total + ' remaining';
      elGot.textContent = got.length + ' got it';
      elRepeat.textContent = again.length + ' to repeat';
      elBar.style.width = (total ? (got.length / total) * 100 : 0) + '%';

      elAnswers.innerHTML = '';

      if (!d.length) {
        elFaceLabel.textContent = 'All ' + total + ' cards cleared';
        elFaceText.textContent = 'Round complete';
        elFaceText.className = 'fc-face-text is-short';
        elHint.hidden = true;
        var line = el('p', 'fc-done-line', lapses.length
          ? 'You needed a second look at ' + lapses.length + ' of them. Those are the ones to run again tomorrow.'
          : 'Straight through, no repeats.');
        // The summary sits under the face, inside the card.
        var old = stage.querySelector('.fc-done-line');
        if (old) old.remove();
        stage.appendChild(line);
        var goAgain = el('button', 'btn btn-primary btn-answer', 'Go again');
        goAgain.type = 'button';
        goAgain.addEventListener('click', function (e) { e.stopPropagation(); restart(); });
        elAnswers.appendChild(goAgain);
        if (elKeys) elKeys.hidden = true;
        return;
      }

      var oldLine = stage.querySelector('.fc-done-line');
      if (oldLine) oldLine.remove();
      if (elKeys) elKeys.hidden = false;

      var card = cards[d[pos]];
      var front = reversed ? card.b : card.f;
      var back = reversed ? card.f : card.b;
      var text = flipped ? back : front;

      elFaceLabel.textContent = flipped
        ? (reversed ? 'Term' : 'Answer')
        : (reversed ? 'Definition' : 'Question');
      elFaceText.textContent = text;
      elFaceText.className = 'fc-face-text ' + faceSize(text);

      // Both answers move to the next card, so once the card is flipped the
      // hint says so; without it people look for a separate Next button.
      elHint.hidden = false;
      elHint.textContent = flipped
        ? 'Pick one to go to the next card'
        : 'Click, or press space, to reveal';

      if (flipped) {
        var againBtn = el('button', 'btn btn-ghost btn-answer', 'Again later');
        againBtn.type = 'button';
        againBtn.appendChild(arrowSVG());
        againBtn.addEventListener('click', function (e) { e.stopPropagation(); markAgain(); });
        var gotBtn = el('button', 'btn btn-primary btn-answer', 'Got it');
        gotBtn.type = 'button';
        gotBtn.appendChild(arrowSVG());
        gotBtn.addEventListener('click', function (e) { e.stopPropagation(); markGot(); });
        elAnswers.appendChild(againBtn);
        elAnswers.appendChild(gotBtn);
      }
    }

    function flip() {
      if (!deck().length) return;
      flipped = !flipped;
      draw();
    }

    function markGot() {
      var d = deck();
      if (!d.length) return;
      var id = d[pos];
      add(got, id);
      drop(again, id);   // it is no longer waiting to be repeated
      flipped = false;
      save();
      draw();
    }

    function markAgain() {
      var d = deck();
      if (!d.length) return;
      var id = d[pos];
      add(again, id);
      add(lapses, id);   // cumulative, so a finished round can still report it
      d.splice(pos, 1);
      d.splice(Math.min(pos + 3, d.length), 0, id);  // roughly three live cards ahead
      order = d.concat(got);
      flipped = false;
      save();
      draw();
    }

    function restart() {
      order = cards.map(function (_, i) { return i; });
      pos = 0; flipped = false;
      got = []; again = []; lapses = [];
      save();
      draw();
    }

    function shuffle() {
      var a = cards.map(function (_, i) { return i; });
      for (var i = a.length - 1; i > 0; i--) {           // Fisher-Yates
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      order = a;
      pos = 0; flipped = false;
      got = []; again = []; lapses = [];
      save();
      draw();
    }

    fetch(SET_URL(slug)).then(function (r) { return r.json(); }).then(function (data) {
      cards = data.cards || [];
      total = cards.length;
      order = cards.map(function (_, i) { return i; });
      restore();
      draw();

      stage.addEventListener('click', flip);
      stage.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); flip(); }
      });

      // One pill, two states: it names the side that leads.
      var dir = document.getElementById('fc-dir');
      if (dir) {
        dir.addEventListener('click', function () {
          reversed = !reversed;
          dir.textContent = reversed ? 'Definition first' : 'Term first';
          dir.classList.toggle('is-on', reversed);
          flipped = false;
          draw();
        });
      }

      var sh = document.getElementById('fc-shuffle');
      if (sh) sh.addEventListener('click', shuffle);
      var re = document.getElementById('fc-restart');
      if (re) re.addEventListener('click', restart);

      document.addEventListener('keydown', function (e) {
        var t = e.target;
        var tag = t && t.tagName ? t.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || (t && t.isContentEditable)) return;
        if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); flip(); }
        else if (e.key === '1' && flipped) { markAgain(); }
        else if (e.key === '2' && flipped) { markGot(); }
        else if (e.key === 'r' || e.key === 'R') { restart(); }
      });
    }).catch(function () {
      elFaceLabel.textContent = '';
      elFaceText.textContent = 'This set could not be loaded. Please reload the page.';
      elFaceText.className = 'fc-face-text is-medium';
      elHint.hidden = true;
    });
  }


  /* ============================================================
     GLOSSARY LIST
     ============================================================ */

  function buildList() {
    var wrap = document.getElementById('fc-entries');
    if (!wrap) return;

    var input = document.getElementById('fc-search');
    var azWrap = document.getElementById('fc-az');
    var countLine = document.getElementById('fc-listcount');
    var attrib = document.getElementById('fc-attrib');

    var entries = [];
    var query = '';
    var letter = 'All';

    function matches(e) {
      if (letter !== 'All' && e.initial !== letter) return false;
      if (!query) return true;
      return (e.term + ' ' + e.def).toLowerCase().indexOf(query) !== -1;
    }

    function draw() {
      var shown = entries.filter(matches);
      countLine.textContent = shown.length + ' of ' + entries.length + ' entries shown';
      wrap.innerHTML = '';

      if (!shown.length) {
        wrap.appendChild(el('p', 'fc-empty', 'No entries match that search.'));
        return;
      }

      shown.forEach(function (e) {
        var row = el('div', 'fc-entry');
        var left = el('div');
        left.appendChild(el('div', 'fc-entry-term', e.term));
        if (e.kind) left.appendChild(el('div', 'fc-entry-kind', e.kind));
        row.appendChild(left);
        row.appendChild(el('div', 'fc-entry-def', e.def));
        wrap.appendChild(row);
      });
    }

    fetch(SET_URL(slug)).then(function (r) { return r.json(); }).then(function (data) {
      var kind = data.entryKind || null;
      entries = (data.cards || []).map(function (c) {
        var initial = c.f.trim().charAt(0).toUpperCase();
        return {
          term: c.f,
          def: c.b,
          kind: kind,
          initial: /[A-Z]/.test(initial) ? initial : ''
        };
      }).sort(function (a, b) {
        return a.term.toLowerCase().localeCompare(b.term.toLowerCase(), 'en-AU');
      });

      if (attrib) {
        var bits = [];
        if (data.source) bits.push('Source: ' + data.source);
        if (data.licence) bits.push(data.licence);
        if (bits.length) attrib.textContent = bits.join(' · ');
        else attrib.hidden = true;
      }

      if (azWrap) {
        var present = {};
        entries.forEach(function (e) { if (e.initial) present[e.initial] = true; });
        var letters = ['All'].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
        letters.forEach(function (L) {
          var live = L === 'All' || present[L];
          var b = el('button', 'fc-az-item' + (L === 'All' ? ' is-wide' : '') +
            (L === letter ? ' is-on' : '') + (live ? '' : ' is-empty'), L);
          b.type = 'button';
          if (live) {
            b.addEventListener('click', function () {
              letter = L;
              Array.prototype.forEach.call(azWrap.children, function (c) {
                c.classList.toggle('is-on', c === b);
              });
              draw();
            });
          } else {
            b.disabled = true;
          }
          azWrap.appendChild(b);
        });
      }

      if (input) {
        input.addEventListener('input', function () {
          query = input.value.trim().toLowerCase();
          draw();
        });
      }

      draw();
    }).catch(function () { fail(wrap, 'this glossary'); });
  }


  if (mode === 'catalogue') buildCatalogue();
  else if (mode === 'player') buildPlayer();
  else if (mode === 'list') buildList();
})();
