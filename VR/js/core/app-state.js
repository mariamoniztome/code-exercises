/**
 * AppState
 * Shared runtime state for the app.
 */

(function initAppState(windowObj) {
  if (typeof THREE !== 'undefined') {
    // tree-of-verses relies on this alias in some environments.
    THREE.THREE_Group_or_Object3D = THREE.Group;
  }

  windowObj.AppState = {
    currentScreen: 'timeline',
    selectedPoem: 0
  };
})(window);
