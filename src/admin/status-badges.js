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
 *
 * 4. Auto-save – periodically saves editor field values to localStorage
 *    every 4 minutes. Shows a restore banner if unsaved content is found
 *    when reopening a post. Drafts expire after 7 days.
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

  /* ── clean up workflow cards (label dates, hide collection label) ── */

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
        // Label the modification date
        if (MONTH_RE.test(text) && text.indexOf('Last Modified') === -1) {
          node.textContent = 'Last Modified on: ' + text;
        }
        // Hide the "BLOG POSTS" collection label
        if (text.toUpperCase() === 'BLOG POSTS' && node.parentElement) {
          node.parentElement.style.display = 'none';
        }
      }
    });
  }

  /* ── replace avatar SVG with mountain logo ─────────────── */

  function replaceAvatar() {
    // The avatar is a 32x32 SVG with a path fill="#1E2532" (Decap's default user icon).
    // Runs on every mutation because React re-renders the SVG on navigation.
    var svgs = document.querySelectorAll('svg[width="32"][height="32"]');
    svgs.forEach(function (svg) {
      var path = svg.querySelector('path[fill="#1E2532"]');
      if (!path) return;
      var img = document.createElement('img');
      img.src = '/assets/logo-mountain.png';
      img.alt = 'User';
      img.style.cssText = 'width:32px;height:32px;border-radius:50%;object-fit:contain;';
      svg.replaceWith(img);
    });
  }

  /* ── hide "Back to site" link ──────────────────────────── */

  function hideSiteLink() {
    // Decap renders the site_url as a link in header and editor views. Hide everywhere.
    var links = document.querySelectorAll('a');
    links.forEach(function (a) {
      if (a.href && a.href.indexOf('enhancemin.com') !== -1) {
        a.style.display = 'none';
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

  /* ── localStorage auto-save for editor ──────────────────── */

  var AUTOSAVE_PREFIX = 'em-autosave-';
  var AUTOSAVE_INTERVAL = 240000; // 4 minutes
  var autosaveTimer = null;
  var lastSavedHash = '';

  function getEditorKey() {
    // Build a storage key from the current hash route
    // e.g. #/collections/blog/entries/my-post → em-autosave-blog-my-post
    var hash = location.hash;
    var entryMatch = hash.match(/#\/collections\/([^/]+)\/entries\/([^/]+)/);
    var newMatch = hash.match(/#\/collections\/([^/]+)\/new$/);
    if (entryMatch) return AUTOSAVE_PREFIX + entryMatch[1] + '-' + entryMatch[2];
    if (newMatch) return AUTOSAVE_PREFIX + newMatch[1] + '-new';
    return null;
  }

  function isEditorPage() {
    var hash = location.hash;
    return hash.indexOf('/entries/') !== -1 || hash.match(/#\/collections\/[^/]+\/new$/);
  }

  function captureEditorState() {
    var fields = {};
    // Capture all text inputs and textareas
    var inputs = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
    inputs.forEach(function (el, i) {
      var label = el.getAttribute('id') || el.getAttribute('name') || el.getAttribute('placeholder') || ('field-' + i);
      if (el.getAttribute('contenteditable') === 'true') {
        fields[label] = el.innerHTML;
      } else {
        fields[label] = el.value;
      }
    });
    // Capture select/dropdown values
    var selects = document.querySelectorAll('select');
    selects.forEach(function (el, i) {
      var label = el.getAttribute('id') || el.getAttribute('name') || ('select-' + i);
      fields[label] = el.value;
    });
    return fields;
  }

  function hashFields(fields) {
    return JSON.stringify(fields);
  }

  function autoSave() {
    var key = getEditorKey();
    if (!key) return;

    var fields = captureEditorState();
    var currentHash = hashFields(fields);

    // Only save if content has changed and there's actual content
    if (currentHash === lastSavedHash || Object.keys(fields).length === 0) return;

    // Don't save if all fields are empty
    var hasContent = false;
    for (var k in fields) {
      if (fields[k] && fields[k].trim()) { hasContent = true; break; }
    }
    if (!hasContent) return;

    lastSavedHash = currentHash;
    localStorage.setItem(key, JSON.stringify({
      fields: fields,
      timestamp: Date.now(),
      url: location.hash
    }));
    showAutoSaveIndicator();
  }

  function showAutoSaveIndicator() {
    var now = new Date();
    var time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    var text = 'Auto-saved at ' + time;

    // Try to place next to Decap's own "Changes saved" status in the toolbar
    var el = document.getElementById('em-autosave-indicator');
    if (el) {
      el.textContent = text;
      return;
    }

    // Find the "Changes saved" span by walking text nodes in the top toolbar
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (node.textContent.trim().toLowerCase() === 'changes saved'
          || node.textContent.trim().toLowerCase() === 'unsaved changes') {
        var parent = node.parentElement;
        if (parent) {
          el = document.createElement('span');
          el.id = 'em-autosave-indicator';
          el.style.cssText = 'margin-left:12px;font-size:12px;color:#575250;font-weight:400;';
          el.textContent = text;
          parent.parentElement.appendChild(el);
          return;
        }
      }
    }

    // Fallback: fixed position near the top-left toolbar area
    el = document.createElement('div');
    el.id = 'em-autosave-indicator';
    el.style.cssText = 'position:fixed;top:12px;left:220px;z-index:10000;'
      + 'font-family:Inter,sans-serif;font-size:12px;color:#575250;';
    el.textContent = text;
    document.body.appendChild(el);
  }

  function showRestoreBanner(key, data) {
    var existing = document.getElementById('em-autosave-banner');
    if (existing) return; // already showing

    var age = Date.now() - data.timestamp;
    var minutes = Math.floor(age / 60000);
    var timeAgo = minutes < 1 ? 'less than a minute ago'
      : minutes < 60 ? minutes + ' minute' + (minutes === 1 ? '' : 's') + ' ago'
      : Math.floor(minutes / 60) + ' hour' + (Math.floor(minutes / 60) === 1 ? '' : 's') + ' ago';

    var banner = document.createElement('div');
    banner.id = 'em-autosave-banner';
    banner.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:10000;'
      + 'background:#fff;border:2px solid #FF7A3D;border-radius:8px;padding:16px 20px;'
      + 'box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:360px;font-family:Inter,sans-serif;';
    banner.innerHTML = '<div style="font-weight:600;margin-bottom:6px;color:#1E1810;">Unsaved draft found</div>'
      + '<div style="font-size:13px;color:#575250;margin-bottom:12px;">Auto-saved ' + timeAgo + '</div>'
      + '<div style="display:flex;gap:8px;">'
      + '<button id="em-autosave-restore" style="background:#FF7A3D;color:#fff;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-weight:600;font-size:13px;">Restore</button>'
      + '<button id="em-autosave-dismiss" style="background:#e8e6e3;color:#575250;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-weight:600;font-size:13px;">Dismiss</button>'
      + '</div>';

    document.body.appendChild(banner);

    document.getElementById('em-autosave-restore').addEventListener('click', function () {
      restoreFields(data.fields);
      banner.remove();
    });

    document.getElementById('em-autosave-dismiss').addEventListener('click', function () {
      localStorage.removeItem(key);
      banner.remove();
    });
  }

  function restoreFields(fields) {
    var inputs = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
    inputs.forEach(function (el, i) {
      var label = el.getAttribute('id') || el.getAttribute('name') || el.getAttribute('placeholder') || ('field-' + i);
      if (fields[label] !== undefined) {
        if (el.getAttribute('contenteditable') === 'true') {
          el.innerHTML = fields[label];
        } else {
          // Trigger React's change detection
          var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          ) || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
          if (nativeInputValueSetter && nativeInputValueSetter.set) {
            nativeInputValueSetter.set.call(el, fields[label]);
          } else {
            el.value = fields[label];
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  }

  function checkForSavedDraft() {
    var key = getEditorKey();
    if (!key) return;

    var raw = localStorage.getItem(key);
    if (!raw) return;

    try {
      var data = JSON.parse(raw);
      // Expire after 24 hours
      if (Date.now() - data.timestamp > 604800000) {
        localStorage.removeItem(key);
        return;
      }
      // Wait for editor to load before showing banner
      setTimeout(function () { showRestoreBanner(key, data); }, 1500);
    } catch (e) {
      localStorage.removeItem(key);
    }
  }

  function startAutoSave() {
    if (autosaveTimer) clearInterval(autosaveTimer);
    if (isEditorPage()) {
      autosaveTimer = setInterval(autoSave, AUTOSAVE_INTERVAL);
      checkForSavedDraft();
    }
  }

  // Clean up expired auto-saves (older than 24h)
  function cleanupAutoSaves() {
    for (var i = localStorage.length - 1; i >= 0; i--) {
      var k = localStorage.key(i);
      if (k && k.indexOf(AUTOSAVE_PREFIX) === 0) {
        try {
          var d = JSON.parse(localStorage.getItem(k));
          if (Date.now() - d.timestamp > 604800000) localStorage.removeItem(k);
        } catch (e) { localStorage.removeItem(k); }
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
      replaceAvatar();
      hideSiteLink();
    }, 500);
  }

  var lastHash = location.hash;
  function init() {
    new MutationObserver(debouncedUpdate)
      .observe(document.body, { childList: true, subtree: true });
    setTimeout(function () {
      updateCardStyles();
      updateBadges();
      labelWorkflowDates();
      hideQuickAdd();
      replaceAvatar();
      hideSiteLink();
      cleanupAutoSaves();
      startAutoSave();
    }, 800);

    // Restart auto-save when navigating between views
    window.addEventListener('hashchange', function () {
      if (location.hash !== lastHash) {
        lastHash = location.hash;
        lastSavedHash = '';
        startAutoSave();
      }
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 200);
  } else {
    window.addEventListener('load', function () { setTimeout(init, 200); });
  }
})();
