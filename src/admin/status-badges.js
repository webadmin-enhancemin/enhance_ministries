/**
 * Decap CMS Enhancements
 *
 * 1. Card restyling – parses summary text "date · title [category]" and uses
 *    CSS pseudo-elements (a::before, h2::before, h2::after) to display styled
 *    card content. All styling lives in a <style> tag in <head>, making it
 *    immune to React re-renders.
 *
 * 2. Published badges – uses a dynamic <style> tag in <head> to show a green
 *    "Published" badge (via a::after) on entries without a workflow status.
 *
 * 3. Hide Quick add – removes the redundant "Quick add" dropdown from
 *    the top navigation bar.
 */
(function () {
  'use strict';

  var WORKFLOW_LABELS = ['draft', 'in review', 'ready'];
  var BADGE_STYLE_ID = 'em-published-badges';
  var CARD_STYLE_ID  = 'em-card-styles';
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

  function cssEsc(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function isWorkflowPage() {
    return location.hash.indexOf('#/workflow') === 0;
  }

  /* ── card styles (CSS-only, React-proof) ───────────── */

  function updateCardStyles() {
    var onWorkflow = isWorkflowPage();
    var entries = document.querySelectorAll(
      'a[href*="/collections/"][href*="/entries/"]'
    );
    if (!entries.length) return;

    var css = '';

    entries.forEach(function (entry) {
      // Collection page: entries are inside <li>. Workflow page: entries may be inside <div>.
      if (!entry.parentElement) return;
      var parentTag = entry.parentElement.tagName;
      if (!onWorkflow && parentTag !== 'LI') return;

      var heading = entry.querySelector('h2');
      if (!heading) return;

      // Extract raw summary text from text nodes (before any child elements)
      var summaryText = '';
      for (var i = 0; i < heading.childNodes.length; i++) {
        if (heading.childNodes[i].nodeType === Node.TEXT_NODE) {
          summaryText += heading.childNodes[i].textContent;
        }
      }
      summaryText = summaryText.trim();

      var match = SUMMARY_RE.exec(summaryText);
      if (!match) return;

      var href = entry.getAttribute('href');
      if (!href) return;

      var sel = 'a[href="' + cssEsc(href) + '"]';
      var category = match[3];
      var title    = match[2];
      var fmtDate  = formatDate(match[1]);

      // Hide original h2 text but keep the element for pseudo-elements.
      // Force display:block so pseudo-elements stack vertically.
      css += sel + ' h2{font-size:0!important;color:transparent!important;padding:0!important;margin:0!important;display:block!important}\n';
      // Neutralize wrapper div and its pseudo-elements in grid view
      css += sel + '>div:first-child{background:none!important;box-shadow:none!important;border:none!important;overflow:visible!important;padding:0!important;margin:0!important;max-height:none!important;height:auto!important}\n';
      css += sel + '>div:first-child::before,' + sel + '>div:first-child::after{display:none!important;content:none!important}\n';
      // Workflow badges (Draft/In Review/Ready) live inside h2 as child elements.
      // They inherit font-size:0 but Decap sets explicit font-size so they stay visible.
      // Position them in the top-right corner of the card (like Published badge).
      css += sel + ' h2>*{position:absolute!important;top:16px!important;right:16px!important;z-index:1!important}\n';
      // Category badge  →  a::before (align-self:flex-start prevents full-width stretching)
      css += sel + '::before{content:"' + cssEsc(category).toUpperCase() + '"!important;'
        + 'display:inline-block!important;align-self:flex-start!important;'
        + 'background:#FF7A3D!important;color:#fff!important;'
        + 'font-size:.7rem!important;font-weight:600!important;text-transform:uppercase!important;'
        + 'letter-spacing:.05em!important;padding:3px 10px!important;border-radius:20px!important;'
        + 'margin-bottom:4px!important;line-height:1.4!important}\n';

      // Title  →  h2::before
      css += sel + ' h2::before{content:"' + cssEsc(title) + '"!important;'
        + 'display:block!important;font-size:1rem!important;font-weight:600!important;'
        + 'color:#1E1810!important;line-height:1.4!important;white-space:normal!important}\n';

      // Date  →  h2::after (prefix with "Scheduled For:" on workflow page for clarity)
      var dateLabel = onWorkflow ? 'Scheduled For: ' + fmtDate : fmtDate;
      css += sel + ' h2::after{content:"' + cssEsc(dateLabel) + '"!important;'
        + 'display:block!important;font-size:.8rem!important;color:#575250!important;'
        + 'font-weight:400!important;margin-top:4px!important}\n';
    });

    var el = document.getElementById(CARD_STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = CARD_STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = css;
  }

  /* ── Published badges (CSS-only) ───────────────────── */

  function updateBadges() {
    // On the workflow page every entry is unpublished — skip Published badges entirely
    if (isWorkflowPage()) {
      var styleEl = document.getElementById(BADGE_STYLE_ID);
      if (styleEl) styleEl.textContent = '';
      return;
    }

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

    var styleEl = document.getElementById(BADGE_STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = BADGE_STYLE_ID;
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

  /* ── label workflow modification dates ────────────────── */

  var MONTH_RE = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}$/i;

  function labelWorkflowDates() {
    if (!isWorkflowPage()) return;

    var entries = document.querySelectorAll(
      'a[href*="/collections/"][href*="/entries/"]'
    );

    entries.forEach(function (entry) {
      var walker = document.createTreeWalker(entry, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        var node = walker.currentNode;
        // Skip text nodes inside h2 (our content is in pseudo-elements)
        if (node.parentElement && node.parentElement.closest('h2')) continue;

        var text = node.textContent.trim();
        if (MONTH_RE.test(text) && text.indexOf('Last Modified') === -1) {
          node.textContent = 'Last Modified on: ' + text;
        }
      }
    });
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
      updateCardStyles();
      updateBadges();
      labelWorkflowDates();
      hideQuickAdd();
    }, 500);
  }

  function init() {
    new MutationObserver(debouncedUpdate)
      .observe(document.body, { childList: true, subtree: true });
    setTimeout(function () {
      updateCardStyles();
      updateBadges();
      labelWorkflowDates();
      hideQuickAdd();
    }, 800);
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 200);
  } else {
    window.addEventListener('load', function () { setTimeout(init, 200); });
  }
})();
