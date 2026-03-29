/**
 * UIController
 * Handles screen transitions, timeline animations and poem selection UI.
 */

(function initUIController(windowObj) {
  function getEl(id) {
    return document.getElementById(id);
  }

  function showScreen(name) {
    const tl = getEl('screen-timeline');
    const arIntro = getEl('screen-ar-intro');
    const ar = getEl('screen-ar');

    tl.classList.remove('exit');
    arIntro.classList.remove('active');
    ar.classList.remove('active');

    if (name === 'timeline') {
      tl.style.display = 'block';
      windowObj.AppState.currentScreen = 'timeline';
      AREngine.teardown();
      return;
    }

    if (name === 'ar-intro') {
      tl.classList.add('exit');
      setTimeout(() => {
        tl.style.display = 'none';
      }, 800);

      arIntro.classList.add('active');
      windowObj.AppState.currentScreen = 'ar-intro';
      return;
    }

    if (name === 'ar') {
      arIntro.classList.remove('active');
      ar.classList.add('active');
      windowObj.AppState.currentScreen = 'ar';
      windowObj.ARSessionController.start();
    }
  }

  function initTimelineAnimations() {
    const events = document.querySelectorAll('.tl-event');
    const excerpts = document.querySelectorAll('.tl-poem-excerpt');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
      });
    }, { threshold: 0.15 });

    events.forEach((el) => observer.observe(el));
    excerpts.forEach((el) => observer.observe(el));

    const scrollAnimEls = document.querySelectorAll('.tl-poems-title, .tl-cta-label, .tl-cta');
    const observer2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeUp 0.8s 0.1s forwards';
        }
      });
    }, { threshold: 0.2 });

    scrollAnimEls.forEach((el) => observer2.observe(el));
  }

  function initPoemSelector() {
    const cards = document.querySelectorAll('.ar-marker-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        windowObj.AppState.selectedPoem = Number(card.dataset.poem);
      });
    });
  }

  function bindUIEvents() {
    getEl('btn-enter-ar').addEventListener('click', () => showScreen('ar-intro'));
    getEl('btn-start-ar').addEventListener('click', () => showScreen('ar'));

    getEl('ar-back').addEventListener('click', () => {
      windowObj.ARSessionController.cleanupToIntro();
      showScreen('ar-intro');
    });
  }

  windowObj.UIController = {
    showScreen,
    initTimelineAnimations,
    initPoemSelector,
    bindUIEvents
  };

  // Keep backward compatibility with inline onclick in index.html.
  windowObj.showScreen = showScreen;
})(window);
