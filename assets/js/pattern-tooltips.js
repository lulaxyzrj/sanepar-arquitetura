(function () {
  'use strict';

  var CACHE_KEY = 'tp-pattern-tooltips-v1';
  var indexPromise = null;
  var tooltipEl = null;
  var pinned = false;
  var activeTrigger = null;

  function domainFromId(id) {
    if (id.indexOf('gof-') === 0) return 'GoF';
    if (id.indexOf('de-') === 0) return 'Data Engineering';
    if (id.indexOf('genai-') === 0) return 'GenAI';
    return 'Padrão';
  }

  function domainClass(id) {
    if (id.indexOf('gof-') === 0) return 'pattern-tooltip-domain-gof';
    if (id.indexOf('de-') === 0) return 'pattern-tooltip-domain-de';
    if (id.indexOf('genai-') === 0) return 'pattern-tooltip-domain-genai';
    return '';
  }

  function indexFromDocument(doc) {
    var map = {};
    doc.querySelectorAll('.pattern-card[id]').forEach(function (card) {
      var id = card.id;
      if (!id) return;
      var titleEl = card.querySelector('h3');
      var badgeEl = card.querySelector('.badge-pattern');
      var summaryEl = card.querySelector('p');
      var title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : id;
      var category = badgeEl ? badgeEl.textContent.trim() : '';
      var summary = '';
      if (summaryEl) {
        summary = summaryEl.textContent.replace(/^\s*TRANSPETRO:\s*/i, '').trim();
      }
      map[id] = { title: title, category: category, summary: summary };
    });
    return map;
  }

  function loadIndex() {
    if (indexPromise) return indexPromise;

    indexPromise = new Promise(function (resolve) {
      var local = indexFromDocument(document);
      if (Object.keys(local).length > 0) {
        resolve(local);
        return;
      }

      try {
        var cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          resolve(JSON.parse(cached));
          return;
        }
      } catch (e) { /* ignore */ }

      fetch('padroes-design.html', { credentials: 'same-origin' })
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var map = indexFromDocument(doc);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(map));
          } catch (e) { /* ignore */ }
          resolve(map);
        })
        .catch(function () {
          resolve({});
        });
    });

    return indexPromise;
  }

  function patternIdFromHref(href) {
    if (!href) return null;
    var hash = href.split('#')[1];
    return hash || null;
  }

  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'pattern-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.hidden = true;
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function renderTooltip(data, id, href) {
    var el = ensureTooltip();
    var domain = domainFromId(id);
    el.className = 'pattern-tooltip ' + domainClass(id);
    if (pinned) el.classList.add('pattern-tooltip-pinned');

    var linkHtml = href
      ? '<a class="pattern-tooltip-link" href="' + href + '">Abrir ficha →</a>'
      : '';

    el.innerHTML =
      '<div class="pattern-tooltip-header">' +
        '<span class="pattern-tooltip-domain">' + domain + '</span>' +
        (data.category ? '<span class="pattern-tooltip-category">' + data.category + '</span>' : '') +
      '</div>' +
      '<p class="pattern-tooltip-title">' + data.title + '</p>' +
      (data.summary ? '<p class="pattern-tooltip-summary">' + data.summary + '</p>' : '') +
      linkHtml +
      '<p class="pattern-tooltip-hint">' + (pinned ? 'Esc ou clique fora para fechar' : 'Passe o mouse · clique para fixar na apresentação') + '</p>';
    el.hidden = false;
  }

  function positionTooltip(trigger) {
    if (!tooltipEl || tooltipEl.hidden) return;
    var rect = trigger.getBoundingClientRect();
    var tipRect = tooltipEl.getBoundingClientRect();
    var pad = 10;
    var top = rect.bottom + pad;
    var left = rect.left + rect.width / 2 - tipRect.width / 2;

    if (left + tipRect.width > window.innerWidth - pad) {
      left = window.innerWidth - tipRect.width - pad;
    }
    if (left < pad) left = pad;

    if (top + tipRect.height > window.innerHeight - pad) {
      top = rect.top - tipRect.height - pad;
    }

    tooltipEl.style.top = Math.max(pad, top) + 'px';
    tooltipEl.style.left = left + 'px';
  }

  function hideTooltip(force) {
    if (pinned && !force) return;
    pinned = false;
    activeTrigger = null;
    if (tooltipEl) {
      tooltipEl.hidden = true;
      tooltipEl.classList.remove('pattern-tooltip-pinned');
    }
    document.querySelectorAll('.pattern-tooltip-active').forEach(function (n) {
      n.classList.remove('pattern-tooltip-active');
    });
  }

  function showTooltip(trigger, id, map, href) {
    var data = map[id];
    if (!data) return;
    activeTrigger = trigger;
    trigger.classList.add('pattern-tooltip-active');
    renderTooltip(data, id, href);
    requestAnimationFrame(function () {
      positionTooltip(trigger);
    });
  }

  function attachTrigger(trigger, id, map, href) {
    if (!id || !map[id] || trigger.dataset.patternTooltip === '1') return;
    trigger.dataset.patternTooltip = '1';
    trigger.setAttribute('aria-describedby', 'pattern-tooltip-live');
    var cardHref = href || ('padroes-design.html#' + id);

    trigger.addEventListener('mouseenter', function () {
      if (!pinned) showTooltip(trigger, id, map, cardHref);
    });

    trigger.addEventListener('mouseleave', function () {
      if (!pinned) hideTooltip(true);
    });

    trigger.addEventListener('focus', function () {
      if (!pinned) showTooltip(trigger, id, map, cardHref);
    });

    trigger.addEventListener('blur', function () {
      if (!pinned) hideTooltip(true);
    });

    trigger.addEventListener('click', function (e) {
      if (e.target.closest('.pattern-tooltip-link')) return;
      if (pinned && activeTrigger === trigger) {
        e.preventDefault();
        hideTooltip(true);
        return;
      }
      if (trigger.tagName === 'A') {
        e.preventDefault();
      }
      pinned = true;
      showTooltip(trigger, id, map, cardHref);
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideTooltip(true);
    });
  }

  function initTriggers(map) {
    document.querySelectorAll('a.pattern-inline[href*="padroes-design.html#"]').forEach(function (a) {
      var id = patternIdFromHref(a.getAttribute('href'));
      attachTrigger(a, id, map, a.getAttribute('href'));
    });

    document.querySelectorAll('.pattern-card[id]').forEach(function (card) {
      var badge = card.querySelector('.badge-pattern');
      var header = card.querySelector('.pattern-card-header h3');
      var id = card.id;
      var cardHref = 'padroes-design.html#' + id;
      if (badge) attachTrigger(badge, id, map, cardHref);
      if (header) attachTrigger(header, id, map, cardHref);
    });
  }

  function init() {
    loadIndex().then(function (map) {
      if (!Object.keys(map).length) return;
      initTriggers(map);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') hideTooltip(true);
      });

      document.addEventListener('click', function (e) {
        if (!pinned || !tooltipEl) return;
        if (tooltipEl.contains(e.target)) return;
        if (activeTrigger && activeTrigger.contains(e.target)) return;
        hideTooltip(true);
      });

      window.addEventListener('scroll', function () {
        if (activeTrigger && tooltipEl && !tooltipEl.hidden) {
          positionTooltip(activeTrigger);
        }
      }, true);

      window.addEventListener('resize', function () {
        if (activeTrigger && tooltipEl && !tooltipEl.hidden) {
          positionTooltip(activeTrigger);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
