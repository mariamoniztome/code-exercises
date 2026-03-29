/**
 * App Bootstrap
 * Wires segmented controllers on DOM ready.
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await TextRepository.load('data/texts.json');
  } catch (error) {
    console.warn('Texts JSON failed to load, using in-code fallback content.', error);
  }

  if (window.ContentHydrator && typeof window.ContentHydrator.apply === 'function') {
    window.ContentHydrator.apply();
  }

  UIController.bindUIEvents();
  UIController.initTimelineAnimations();
  UIController.initPoemSelector();
});
