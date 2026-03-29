/**
 * ContentHydrator
 * Applies centralized JSON texts to index.html runtime content.
 */

(function initContentHydrator(windowObj) {
  function get(path, fallbackValue) {
    if (!windowObj.TextRepository || !windowObj.TextRepository.get) return fallbackValue;
    return windowObj.TextRepository.get(path, fallbackValue);
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (!el || value === undefined || value === null) return;
    el.textContent = value;
  }

  function setHtml(id, value) {
    var el = document.getElementById(id);
    if (!el || value === undefined || value === null) return;
    el.innerHTML = value;
  }

  function renderTimelineEvents() {
    var container = document.getElementById('tl-events-container');
    if (!container) return;

    var events = get('timelinePage.events', []);
    container.innerHTML = '';

    events.forEach(function(eventItem) {
      var eventEl = document.createElement('div');
      eventEl.className = 'tl-event';
      eventEl.innerHTML = [
        '<div class="tl-event-content">',
        '  <div class="tl-event-year"></div>',
        '  <div class="tl-event-title"></div>',
        '  <div class="tl-event-desc"></div>',
        '</div>',
        '<div class="tl-dot"></div>'
      ].join('');

      eventEl.querySelector('.tl-event-year').textContent = eventItem.year || '';
      eventEl.querySelector('.tl-event-title').textContent = eventItem.title || '';
      eventEl.querySelector('.tl-event-desc').textContent = eventItem.desc || '';

      container.appendChild(eventEl);
    });
  }

  function renderPoemExcerpts() {
    var container = document.getElementById('tl-excerpts-container');
    if (!container) return;

    var poems = get('poems', []);
    container.innerHTML = '';

    poems.forEach(function(poem) {
      var quote = document.createElement('blockquote');
      quote.className = 'tl-poem-excerpt';
      quote.innerHTML = (poem.verses || []).join('<br>');
      container.appendChild(quote);
    });
  }

  function renderPoemCards() {
    var cardsWrap = document.getElementById('ar-marker-cards');
    if (!cardsWrap) return;

    var poems = get('poems', []);
    cardsWrap.innerHTML = '';

    poems.forEach(function(poem, index) {
      var marker = poem.marker || {};
      var card = document.createElement('div');
      card.className = 'ar-marker-card' + (index === 0 ? ' selected' : '');
      card.setAttribute('data-poem', String(index));
      card.innerHTML = [
        '<div class="ar-marker-num">', (marker.roman || String(index + 1)), '</div>',
        '<div class="ar-marker-name">', (poem.title || ''), '</div>'
      ].join('');
      cardsWrap.appendChild(card);
    });
  }

  function apply() {
    setText('tl-eyebrow', get('timelinePage.header.eyebrow', ''));
    setHtml('tl-title', get('timelinePage.header.titleHtml', ''));
    setText('tl-subtitle', get('timelinePage.header.subtitle', ''));
    setText('tl-dates', get('timelinePage.header.dates', ''));
    setHtml('tl-bio', get('timelinePage.bioHtml', ''));
    setText('tl-poems-title', get('timelinePage.poemsTitle', ''));
    setText('tl-cta-label', get('timelinePage.ctaLabel', ''));
    setText('btn-enter-ar', get('timelinePage.ctaButton', ''));

    renderTimelineEvents();
    renderPoemExcerpts();

    setText('ar-intro-title', get('screens.arIntro.title', ''));
    setText('ar-intro-sub', get('screens.arIntro.subtitle', ''));
    setText('btn-start-ar', get('screens.arIntro.startButton', ''));
    setText('ar-intro-hint', get('screens.arIntro.hint', ''));
    setText('ar-intro-back', get('screens.arIntro.backButton', ''));

    renderPoemCards();

    setText('ar-loading-text', get('screens.ar.loadingText', ''));
    setText('ar-hud-title-text', get('screens.ar.hudTitle', ''));
    setText('ar-poem-indicator', get('screens.ar.hudIndicatorWaiting', ''));
    setText('ar-back', get('screens.ar.backButton', ''));
    setText('ar-status-text', get('screens.ar.statusInitial', ''));
  }

  windowObj.ContentHydrator = {
    apply
  };
})(window);
