/**
 * UIController
 * Handles screen transitions and timeline animations.
 */

(function initUIController(windowObj) {
  function getEl(id) {
    return document.getElementById(id);
  }

  function showScreen(name) {
    const tl = getEl('screen-timeline');
    const ar = getEl('screen-ar');

    tl.classList.remove('exit');
    ar.classList.remove('active');

    if (name === 'timeline') {
      tl.style.display = 'block';
      windowObj.AppState.currentScreen = 'timeline';
      AREngine.teardown();
      return;
    }

    if (name === 'ar') {
      tl.classList.add('exit');
      setTimeout(() => {
        tl.style.display = 'none';
      }, 800);

      ar.classList.add('active');
      windowObj.AppState.currentScreen = 'ar';
      windowObj.ARSessionController.start();
    }
  }

  function initTimelineAnimations() {
    const events = document.querySelectorAll('.tl-event');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
      });
    }, { threshold: 0.15 });

    events.forEach((el) => observer.observe(el));

    const scrollAnimEls = document.querySelectorAll('.tl-cta-label, .tl-cta');
    const observer2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeUp 0.8s 0.1s forwards';
        }
      });
    }, { threshold: 0.2 });

    scrollAnimEls.forEach((el) => observer2.observe(el));
  }

  function bindUIEvents() {
    const enterArButton = getEl('btn-enter-ar');
    if (enterArButton) {
      enterArButton.addEventListener('click', () => showScreen('ar'));
    }

    getEl('ar-back').addEventListener('click', () => {
      windowObj.ARSessionController.cleanupToIntro();
      showScreen('timeline');
    });
  }

  windowObj.UIController = {
    showScreen,
    initTimelineAnimations,
    bindUIEvents
  };

  // Keep backward compatibility with inline onclick in index.html.
  windowObj.showScreen = showScreen;
})(window);
