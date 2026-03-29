/**
 * ARSessionController
 * Handles AR session startup, marker binding and overlay flow.
 */

(function initARSessionController(windowObj) {
  function getEl(id) {
    return document.getElementById(id);
  }

  function t(path, fallbackValue) {
    if (!windowObj.TextRepository || !windowObj.TextRepository.get) return fallbackValue;
    return windowObj.TextRepository.get(path, fallbackValue);
  }

  async function start() {
    const loadingEl = getEl('ar-loading');
    const statusEl = getEl('ar-status-text');
    const indicatorEl = getEl('ar-poem-indicator');
    const canvasEl = getEl('ar-canvas');

    loadingEl.classList.remove('hidden');

    if (windowObj.ModelInteractionController) {
      windowObj.ModelInteractionController.attach(canvasEl);
      windowObj.ModelInteractionController.clearTarget();
    }

    const engine = AREngine.init('ar-video', 'ar-canvas');
    TreeOfVerses.init(engine.scene, engine.clock);

    const camOk = await AREngine.startCamera();
    if (!camOk) {
      statusEl.textContent = AREngine.getLastCameraError() || t('ui.cameraErrors.fallback', 'Camara indisponivel neste dispositivo');
      indicatorEl.textContent = t('ui.ar.indicatorNoCamera', 'Sem camara ativa');
      loadingEl.classList.add('hidden');
      return;
    }

    setTimeout(() => loadingEl.classList.add('hidden'), 800);

    const poem = TreeOfVerses.getPoemData(windowObj.AppState.selectedPoem);
    indicatorEl.textContent = t('ui.ar.indicatorPrefix', 'Poema: ') + poem.title;
    statusEl.textContent = t('ui.ar.statusPointToQr', 'Aponta a camara para o QR do marcador');

    AREngine.onMarkerFound = (poemIndex) => {
      const detectedPoem = TreeOfVerses.getPoemData(poemIndex);
      statusEl.textContent = t('ui.ar.statusQrDetected', 'QR detetado - o mundo desperta...');
      indicatorEl.textContent = t('ui.ar.indicatorPrefix', 'Poema: ') + detectedPoem.title;

      TreeOfVerses.startPoem(poemIndex);

      if (windowObj.ModelInteractionController) {
        windowObj.ModelInteractionController.setTarget(TreeOfVerses.getInteractionTarget());
      }

      TreeOfVerses.onPoemReady = (poemData) => {
        showPoemOverlay(poemData);
        statusEl.textContent = t('ui.ar.statusWorldBloom', 'O mundo poetico esta vivo');
      };
    };

    AREngine.setupMarkerDetection(windowObj.AppState.selectedPoem);

    AREngine.startRenderLoop((delta, elapsed) => {
      TreeOfVerses.update(delta, elapsed);
      if (windowObj.ModelInteractionController) {
        windowObj.ModelInteractionController.setTarget(TreeOfVerses.getInteractionTarget());
        windowObj.ModelInteractionController.update(delta);
      }
    });
  }

  function showPoemOverlay(poemData) {
    const display = getEl('ar-poem-display');
    const title = getEl('ar-poem-title');
    const text = getEl('ar-poem-text');

    title.textContent = poemData.title.toUpperCase();
    text.innerHTML = poemData.verses.join('<br>');

    display.classList.add('visible');

    setTimeout(() => {
      display.style.opacity = '0';
      setTimeout(() => {
        display.classList.remove('visible');
        display.style.opacity = '';
      }, 600);
    }, 6000);
  }

  function cleanupToIntro() {
    AREngine.teardown();
    TreeOfVerses.dispose();

    if (windowObj.ModelInteractionController) {
      windowObj.ModelInteractionController.clearTarget();
      windowObj.ModelInteractionController.detach();
    }

    getEl('ar-poem-display').classList.remove('visible');
    getEl('marker-guide').style.display = '';
    getEl('ar-loading').classList.remove('hidden');
  }

  windowObj.ARSessionController = {
    start,
    cleanupToIntro
  };
})(window);
