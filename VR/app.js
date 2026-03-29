/**
 * App Bootstrap
 * Wires segmented controllers on DOM ready.
 */

document.addEventListener('DOMContentLoaded', () => {
  UIController.bindUIEvents();
  UIController.initTimelineAnimations();
});
