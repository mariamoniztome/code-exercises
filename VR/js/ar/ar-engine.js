/**
 * AR Engine
 * Handles: camera feed, Three.js renderer, QR marker detection,
 * and the bridge between the real world and 3D scene.
 *
 * Strategy: Uses the device camera as background, Three.js for 3D overlay.
 * Marker detection is done by scanning camera frames for QR codes,
 * using BarcodeDetector when available with jsQR as fallback.
 */

const AREngine = (() => {
  let renderer, scene, camera;
  let videoEl, canvasEl;
  let stream = null;
  let animFrameId = null;
  let markerDetected = false;
  let onMarkerFound = null;
  let onMarkerLost = null;
  let clock;

  // QR detection state
  let currentPoem = 0;
  let detectionCanvas = null;
  let detectionCtx = null;
  let qrDetector = null;
  let detectionActive = false;
  let scanInProgress = false;
  let lastScanTs = 0;
  let lastCameraError = '';

  const SCAN_INTERVAL_MS = 220;
  const DEFAULT_QR_TO_POEM = {
    'ARVORE_VERSOS_POEMA_1': 0,
    'ARVORE_VERSOS_POEMA_2': 1,
    'ARVORE_VERSOS_POEMA_3': 2,
    'POEMA_1': 0,
    'POEMA_2': 1,
    'POEMA_3': 2,
    'MARKER_1': 0,
    'MARKER_2': 1,
    'MARKER_3': 2,
    'I': 0,
    'II': 1,
    'III': 2
  };

  let qrToPoem = { ...DEFAULT_QR_TO_POEM };

  function t(path, fallbackValue) {
    if (!window.TextRepository || !window.TextRepository.get) return fallbackValue;
    return window.TextRepository.get(path, fallbackValue);
  }

  function init(videoId, canvasId) {
    videoEl = document.getElementById(videoId);
    canvasEl = document.getElementById(canvasId);

    // Three.js setup
    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    detectionCanvas = document.createElement('canvas');
    detectionCtx = detectionCanvas.getContext('2d', { willReadFrequently: true });
    initQrDetector();
    rebuildQrMapFromTexts();

    // Camera — perspective matches a phone camera FOV
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.set(0, 0.3, 1.2);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xfff8e7, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffd580, 1.2);
    dirLight.position.set(2, 4, 2);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.PointLight(0xc8a96e, 0.4, 10);
    fillLight.position.set(-2, 1, 1);
    scene.add(fillLight);

    window.addEventListener('resize', onResize);
    return { renderer, scene, camera, clock };
  }

  function rebuildQrMapFromTexts() {
    const map = { ...DEFAULT_QR_TO_POEM };
    const poems = window.TextRepository && window.TextRepository.getPoems
      ? window.TextRepository.getPoems()
      : [];

    if (Array.isArray(poems)) {
      poems.forEach((poem, index) => {
        const code = poem && poem.marker ? poem.marker.qrCode : null;
        if (!code) return;
        map[String(code).trim().toUpperCase()] = index;
      });
    }

    qrToPoem = map;
  }

  function initQrDetector() {
    if (!('BarcodeDetector' in window)) {
      qrDetector = null;
      return;
    }
    try {
      qrDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
    } catch (e) {
      console.warn('BarcodeDetector not available for qr_code format:', e);
      qrDetector = null;
    }
  }

  function onResize() {
    if (!renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async function startCamera() {
    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (!window.isSecureContext && !isLocalhost) {
      lastCameraError = t('ui.cameraErrors.requireHttps', 'No iPhone, a camara exige HTTPS. Abra a app em https://.');
      canvasEl.style.background = '#1a1008';
      return false;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      lastCameraError = t('ui.cameraErrors.unsupported', 'Este browser nao suporta acesso a camara nesta pagina.');
      canvasEl.style.background = '#1a1008';
      return false;
    }

    videoEl.setAttribute('autoplay', 'true');
    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.muted = true;

    const constraintsList = [
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: 'environment' }, audio: false },
      { video: true, audio: false }
    ];

    for (const constraints of constraintsList) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoEl.srcObject = stream;
        await new Promise((resolve) => {
          if (videoEl.readyState >= 1) {
            resolve();
            return;
          }
          videoEl.onloadedmetadata = () => resolve();
        });
        await videoEl.play();
        lastCameraError = '';
        return true;
      } catch (e) {
        stopCamera();
        lastCameraError = mapCameraError(e);
      }
    }

    console.warn('Camera error:', lastCameraError);
    canvasEl.style.background = '#1a1008';
    return false;
  }

  function mapCameraError(error) {
    const name = error && error.name ? error.name : '';

    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return t('ui.cameraErrors.permissionDenied', 'Permissao de camara negada. Ative em Definicoes > Safari > Camara.');
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return t('ui.cameraErrors.notFound', 'Nenhuma camara encontrada no dispositivo.');
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return t('ui.cameraErrors.inUse', 'A camara esta a ser usada por outra app. Feche e tente novamente.');
    }
    if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
      return t('ui.cameraErrors.overconstrained', 'Nao foi possivel abrir a camara traseira. A tentar alternativa...');
    }
    if (name === 'SecurityError') {
      return t('ui.cameraErrors.security', 'Bloqueado por seguranca do browser. Use HTTPS no iPhone.');
    }

    return t('ui.cameraErrors.fallback', 'Nao foi possivel iniciar a camara neste dispositivo/browser.');
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    if (videoEl) {
      videoEl.srcObject = null;
    }
  }

  function startRenderLoop(updateCallback) {
    function loop() {
      animFrameId = requestAnimationFrame(loop);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      maybeScanQr(performance.now());

      if (updateCallback) updateCallback(delta, elapsed);
      renderer.render(scene, camera);
    }
    loop();
  }

  function stopRenderLoop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function setupMarkerDetection(poemIndex) {
    currentPoem = poemIndex;
    markerDetected = false;
    detectionActive = true;
    scanInProgress = false;
    lastScanTs = 0;

    const guide = document.getElementById('marker-guide');
    if (guide) guide.style.display = '';
  }

  function setupTapDetection(poemIndex) {
    // Backward compatibility for existing app.js calls.
    setupMarkerDetection(poemIndex);
  }

  function maybeScanQr(nowTs) {
    if (!detectionActive || markerDetected || scanInProgress || !videoEl) return;
    if (nowTs - lastScanTs < SCAN_INTERVAL_MS) return;
    if (videoEl.readyState < 2) return;

    lastScanTs = nowTs;
    scanInProgress = true;

    scanCurrentFrame()
      .catch(() => {
        // Ignore per-frame scan failures to keep loop stable.
      })
      .finally(() => {
        scanInProgress = false;
      });
  }

  async function scanCurrentFrame() {
    const vw = videoEl.videoWidth;
    const vh = videoEl.videoHeight;
    if (!vw || !vh || !detectionCtx) return;

    const maxWidth = 640;
    const scale = Math.min(1, maxWidth / vw);
    const sw = Math.max(1, Math.floor(vw * scale));
    const sh = Math.max(1, Math.floor(vh * scale));

    if (detectionCanvas.width !== sw || detectionCanvas.height !== sh) {
      detectionCanvas.width = sw;
      detectionCanvas.height = sh;
    }

    detectionCtx.drawImage(videoEl, 0, 0, sw, sh);

    let qrPayload = null;

    if (qrDetector) {
      try {
        const codes = await qrDetector.detect(detectionCanvas);
        if (codes && codes.length > 0) {
          qrPayload = codes[0].rawValue;
        }
      } catch (e) {
        // Keep running with jsQR fallback.
      }
    }

    if (!qrPayload && typeof jsQR === 'function') {
      const imageData = detectionCtx.getImageData(0, 0, sw, sh);
      const code = jsQR(imageData.data, sw, sh, { inversionAttempts: 'attemptBoth' });
      if (code) qrPayload = code.data;
    }

    if (!qrPayload) return;

    const detectedPoem = resolvePoemIndex(qrPayload);
    if (detectedPoem === null) return;

    currentPoem = detectedPoem;
    triggerMarkerFound(detectedPoem);
  }

  function resolvePoemIndex(payload) {
    const normalized = String(payload || '').trim().toUpperCase();
    if (!normalized) return null;

    if (Object.prototype.hasOwnProperty.call(qrToPoem, normalized)) {
      return qrToPoem[normalized];
    }

    const match = normalized.match(/(?:POEMA|POEMA_|POEM|MARKER|QR)[\s_-]*([123])/);
    if (match) {
      const idx = Number(match[1]) - 1;
      if (idx >= 0 && idx <= 2) return idx;
    }

    return null;
  }

  function triggerMarkerFound(poemIndex = currentPoem) {
    markerDetected = true;
    detectionActive = false;
    if (onMarkerFound) onMarkerFound(poemIndex);

    // Hide marker guide
    const guide = document.getElementById('marker-guide');
    if (guide) guide.style.display = 'none';
  }

  function teardown() {
    stopRenderLoop();
    stopCamera();
    detectionActive = false;
    scanInProgress = false;

    if (scene) {
      while (scene.children.length > 0) scene.remove(scene.children[0]);
    }
    markerDetected = false;
  }

  return {
    init,
    startCamera,
    stopCamera,
    startRenderLoop,
    stopRenderLoop,
    setupMarkerDetection,
    setupTapDetection,
    teardown,
    getScene: () => scene,
    getCamera: () => camera,
    getRenderer: () => renderer,
    getClock: () => clock,
    getLastCameraError: () => lastCameraError,
    set onMarkerFound(fn) { onMarkerFound = fn; },
    set onMarkerLost(fn) { onMarkerLost = fn; }
  };
})();
