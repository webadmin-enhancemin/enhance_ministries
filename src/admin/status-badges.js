/**
 * Decap CMS Enhancements
 *
 * 1. Published badges – injects a green "Published" badge on collection
 *    entries that lack a workflow status (Draft / In Review / Ready).
 *
 * 2. Hide Quick add – removes the redundant "Quick add" dropdown from
 *    the top navigation bar.
 */
(function () {
  'use strict';

  var BADGE_CLASS = 'em-status-published';
  var WORKFLOW_LABELS = ['draft', 'in review', 'ready'];
  var observer;
  var timer;

  /* ── helpers ──────────────────────────────────────────── */

  /** Return true if the entry element already contains a workflow badge. */
  function hasWorkflowBadge(entry) {
    var walker = document.createTreeWalker(entry, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      var text = walker.currentNode.textContent.trim().toLowerCase();
      if (WORKFLOW_LABELS.indexOf(text) !== -1) return true;
    }
    return false;
  }

  /* ── badges ──────────────────────────────────────────── */

  function addBadges() {
    // Pause observer so our own DOM writes don't re-trigger it
    if (observer) observer.disconnect();

    var entries = document.querySelectorAll(
      'a[href*="/collections/"][href*="/entries/"]'
    );
    entries.forEach(function (entry) {
      if (entry.querySelector('.' + BADGE_CLASS)) return;
      if (hasWorkflowBadge(entry)) return;
      var badge = document.createElement('span');
      badge.className = BADGE_CLASS;
      badge.textContent = 'Published';
      entry.appendChild(badge);
    });

    // Re-attach observer after a brief delay to skip any synchronous
    // React reconciliation triggered by our DOM changes
    setTimeout(function () {
      if (observer) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }, 100);
  }

  /* ── hide Quick add button ───────────────────────────── */

  var quickAddHidden = false;
  function hideQuickAdd() {
    if (quickAddHidden) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim().toLowerCase() === 'quick add') {
        var el = walker.currentNode.parentElement;
        // Walk up to find a clickable container (max 6 levels)
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
        // Fallback: hide the direct parent of the text
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
      addBadges();
      hideQuickAdd();
    }, 500);
  }

  function init() {
    observer = new MutationObserver(debouncedUpdate);
    observer.observe(document.body, { childList: true, subtree: true });
    // first pass after CMS finishes rendering
    setTimeout(addBadges, 2000);
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 800);
  } else {
    window.addEventListener('load', function () { setTimeout(init, 800); });
  }
})();
