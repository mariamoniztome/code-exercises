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

  function apply() {
    setText('tl-eyebrow', get('timelinePage.header.eyebrow', ''));
    setHtml('tl-title', get('timelinePage.header.titleHtml', ''));
    setText('tl-subtitle', get('timelinePage.header.subtitle', ''));
    setText('tl-dates', get('timelinePage.header.dates', ''));
    setHtml('tl-bio', get('timelinePage.bioHtml', ''));
    setText('tl-cta-label', get('timelinePage.ctaLabel', ''));
    setText('btn-enter-ar', get('timelinePage.ctaButton', ''));

    renderTimelineEvents();

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
