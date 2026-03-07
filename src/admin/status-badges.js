/**
 * Decap CMS Enhancements
 *
 * 1. Published badges – uses a dynamic <style> tag in <head> to show a green
 *    "Published" badge (via ::after) on entries without a workflow status.
 *    Because the badge is a CSS pseudo-element (not a DOM child), React
 *    re-renders cannot remove it, eliminating badge flicker.
 *
 * 2. Hide Quick add – removes the redundant "Quick add" dropdown from
 *    the top navigation bar.
 */
(function () {
  'use strict';

  var WORKFLOW_LABELS = ['draft', 'in review', 'ready'];
  var STYLE_ID = 'em-published-badges';
  var timer;

  /* ── helpers ──────────────────────────────────────────── */

  function hasWorkflowBadge(entry) {
    var walker = document.createTreeWalker(entry, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      var text = walker.currentNode.textContent.trim().toLowerCase();
      if (WORKFLOW_LABELS.indexOf(text) !== -1) return true;
    }
    return false;
  }

  /* ── badges (CSS-only, no DOM injection) ─────────────── */

  function updateBadges() {
    var entries = document.querySelectorAll(
      'a[href*="/collections/"][href*="/entries/"]'
    );
    if (!entries.length) return;

    var selectors = [];
    entries.forEach(function (entry) {
      if (!hasWorkflowBadge(entry)) {
        var href = entry.getAttribute('href');
        if (href) {
          selectors.push('a[href="' + href.replace(/"/g, '\\"') + '"]::after');
        }
      }
    });

    var styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }

    if (selectors.length) {
      styleEl.textContent =
        selectors.join(',\n') + ' {\n' +
        '  content: "Published";\n' +
        '  position: absolute;\n' +
        '  right: 12px;\n' +
        '  top: 50%;\n' +
        '  transform: translateY(-50%);\n' +
        '  padding: 2px 8px;\n' +
        '  border-radius: 4px;\n' +
        '  font-size: 12px;\n' +
        '  font-weight: 600;\n' +
        '  line-height: 1.6;\n' +
        '  letter-spacing: 0.4px;\n' +
        '  text-transform: uppercase;\n' +
        '  white-space: nowrap;\n' +
        '  background-color: #28a745;\n' +
        '  color: #fff;\n' +
        '}';
    } else {
      styleEl.textContent = '';
    }
  }

  /* ── hide Quick add button ───────────────────────────── */

  var quickAddHidden = false;
  function hideQuickAdd() {
    if (quickAddHidden) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim().toLowerCase() === 'quick add') {
        var el = walker.currentNode.parentElement;
        for (var j = 0; j < 6 && el; j++) {
          var tag = el.tagName.toLowerCase();
          if (tag === 'button' || tag === 'details' || el.getAttribute('role') === 'button'
              || (tag === 'div' && el.onclick) || tag === 'a') {
            el.style.display = 'none';
            quickAddHidden = true;
            return;
          }
          el = el.parentElement;
        }
        if (walker.currentNode.parentElement) {
          walker.currentNode.parentElement.style.display = 'none';
          quickAddHidden = true;
          return;
        }
      }
    }
  }

  /* ── observer ─────────────────────────────────────────── */

  function debouncedUpdate() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      updateBadges();
      hideQuickAdd();
    }, 500);
  }

  function init() {
    // Style tag lives in <head>, observer watches <body> — no feedback loop
    new MutationObserver(debouncedUpdate)
      .observe(document.body, { childList: true, subtree: true });
    setTimeout(function () {
      updateBadges();
      hideQuickAdd();
    }, 2000);
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 800);
  } else {
    window.addEventListener('load', function () { setTimeout(init, 800); });
  }
})();
