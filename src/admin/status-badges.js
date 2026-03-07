/**
 * Published Status Badges for Decap CMS
 *
 * Decap CMS editorial_workflow shows Draft / In Review / Ready badges on
 * unpublished entries, but published entries (on main branch) have no
 * indicator.  This script watches the collection list and injects a green
 * "Published" badge on every entry that lacks a workflow status badge.
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

  /** Scan visible collection entries and add badges where needed. */
  function addBadges() {
    // Decap renders collection entries as <a> pointing to /collections/…/entries/…
    var entries = document.querySelectorAll(
      'a[href*="/collections/"][href*="/entries/"]'
    );

    entries.forEach(function (entry) {
      if (entry.querySelector('.' + BADGE_CLASS)) return; // already badged
      if (hasWorkflowBadge(entry)) return;                // has workflow status

      var badge = document.createElement('span');
      badge.className = BADGE_CLASS;
      badge.textContent = 'Published';
      entry.appendChild(badge);
    });
  }

  /* ── observer ─────────────────────────────────────────── */

  var timer;
  function debouncedBadges() {
    clearTimeout(timer);
    timer = setTimeout(addBadges, 250);
  }

  function init() {
    new MutationObserver(debouncedBadges)
      .observe(document.body, { childList: true, subtree: true });
    // first pass after CMS renders
    setTimeout(addBadges, 1500);
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 500);
  } else {
    window.addEventListener('load', function () { setTimeout(init, 500); });
  }
})();
