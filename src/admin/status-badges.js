/**
 * Decap CMS Enhancements
 *
 * 1. Published badges – injects a green "Published" badge on collection
 *    entries that lack a workflow status (Draft / In Review / Ready).
 *
 * 2. Date sort – Decap CMS sorts published and workflow entries as
 *    separate groups. This script re-sorts ALL entries together by the
 *    date shown in the summary text (newest first).
 */
(function () {
  'use strict';

  var BADGE_CLASS = 'em-status-published';
  var WORKFLOW_LABELS = ['draft', 'in review', 'ready'];

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

  /** Extract a YYYY-MM-DD date string from the entry summary text. */
  function getEntryDate(entry) {
    var text = entry.textContent || '';
    var match = text.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '0000-00-00';
  }

  /* ── badges ──────────────────────────────────────────── */

  function addBadges() {
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
  }

  /* ── sort by date (newest first) ─────────────────────── */

  function sortEntries() {
    // Only act on the blog collection page
    if (!location.hash.match(/#\/collections\/blog\/?$/)) return;

    var entries = document.querySelectorAll(
      'a[href*="/collections/"][href*="/entries/"]'
    );
    if (entries.length < 2) return;

    // All entries share the same parent wrapper
    var parent = entries[0].parentElement;
    if (!parent) return;

    // Build an array, sort by date descending
    var items = Array.prototype.slice.call(entries).map(function (el) {
      return { el: el, date: getEntryDate(el) };
    });
    items.sort(function (a, b) {
      return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
    });

    // Check if already in correct order
    var needsSort = false;
    for (var i = 0; i < items.length; i++) {
      if (items[i].el !== entries[i]) { needsSort = true; break; }
    }
    if (!needsSort) return;

    // Re-order DOM nodes (moves, doesn't clone)
    items.forEach(function (item) {
      parent.appendChild(item.el);
    });
  }

  /* ── hide Quick add button ─────────────────────────────
   * Decap CMS uses CSS-in-JS with hashed classes so we find
   * the button by its text content and hide it.
   */
  var quickAddHidden = false;
  function hideQuickAdd() {
    if (quickAddHidden) return;
    // Walk all text nodes looking for "Quick add", then hide the
    // closest interactive ancestor (button, details, div, a).
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

  var timer;
  function debouncedUpdate() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      addBadges();
      sortEntries();
      hideQuickAdd();
    }, 300);
  }

  function init() {
    new MutationObserver(debouncedUpdate)
      .observe(document.body, { childList: true, subtree: true });
    // first pass after CMS renders
    setTimeout(function () { addBadges(); sortEntries(); }, 1500);
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 500);
  } else {
    window.addEventListener('load', function () { setTimeout(init, 500); });
  }
})();
