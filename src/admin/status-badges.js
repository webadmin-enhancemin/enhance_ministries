/**
 * Decap CMS Enhancements
 *
 * 1. Tile card restyling – parses the summary text "date · title [category]"
 *    and restructures each entry card with styled components (badge, title,
 *    date). Uses a data attribute marker to skip already-processed cards.
 *
 * 2. Published badges – uses a dynamic <style> tag in <head> to show a green
 *    "Published" badge (via ::after) on entries without a workflow status.
 *
 * 3. Hide Quick add – removes the redundant "Quick add" dropdown from
 *    the top navigation bar.
 */
(function () {
  'use strict';

  var WORKFLOW_LABELS = ['draft', 'in review', 'ready'];
  var STYLE_ID = 'em-published-badges';
  var SUMMARY_RE = /^(\d{4}-\d{2}-\d{2})\s*·\s*(.+?)\s*\[([^\]]+)\]$/;
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

  function formatDate(isoDate) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
      }).format(new Date(isoDate + 'T00:00:00Z'));
    } catch (e) {
      return isoDate;
    }
  }

  /* ── tile card restyling ─────────────────────────────── */

  function styleEntryCards() {
    var entries = document.querySelectorAll(
      'a[href*="/collections/"][href*="/entries/"]:not([data-em-styled])'
    );
    if (!entries.length) return;

    entries.forEach(function (entry) {
      var heading = entry.querySelector('h2');
      if (!heading) return;

      // Extract raw summary text from text nodes (before any TitleIcons div)
      var summaryText = '';
      for (var i = 0; i < heading.childNodes.length; i++) {
        if (heading.childNodes[i].nodeType === Node.TEXT_NODE) {
          summaryText += heading.childNodes[i].textContent;
        }
      }
      summaryText = summaryText.trim();

      var match = SUMMARY_RE.exec(summaryText);
      if (!match) return;

      var isoDate = match[1];
      var title = match[2];
      var category = match[3];

      // Preserve any existing workflow badge div
      var workflowBadgeEl = null;
      var titleIconsDiv = heading.querySelector('div');
      if (titleIconsDiv) {
        workflowBadgeEl = titleIconsDiv.cloneNode(true);
      }

      // Mark as processed
      entry.setAttribute('data-em-styled', '');

      // Fix parent <li> height for browsers without :has() support
      var parentLi = entry.parentElement;
      if (parentLi && parentLi.tagName === 'LI') {
        parentLi.style.height = 'auto';
        parentLi.style.minHeight = '120px';
        parentLi.style.overflow = 'visible';
      }

      // Build new card content
      var wrapper = document.createElement('div');
      wrapper.className = 'em-card-content';

      // Row 1: Category badge + optional workflow badge
      var topRow = document.createElement('div');
      topRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';

      var badge = document.createElement('span');
      badge.className = 'em-card-badge';
      badge.textContent = category;
      topRow.appendChild(badge);

      if (workflowBadgeEl) {
        topRow.appendChild(workflowBadgeEl);
      }

      wrapper.appendChild(topRow);

      // Row 2: Title
      var titleEl = document.createElement('div');
      titleEl.className = 'em-card-title';
      titleEl.textContent = title;
      wrapper.appendChild(titleEl);

      // Row 3: Formatted date
      var dateEl = document.createElement('div');
      dateEl.className = 'em-card-date';
      dateEl.textContent = formatDate(isoDate);
      wrapper.appendChild(dateEl);

      entry.appendChild(wrapper);
    });
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
        '  right: 16px;\n' +
        '  top: 16px;\n' +
        '  padding: 2px 8px;\n' +
        '  border-radius: 4px;\n' +
        '  font-size: 11px;\n' +
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
      styleEntryCards();
      updateBadges();
      hideQuickAdd();
    }, 500);
  }

  function init() {
    new MutationObserver(debouncedUpdate)
      .observe(document.body, { childList: true, subtree: true });
    setTimeout(function () {
      styleEntryCards();
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
