/**
 * ModelInteractionController
 * Touch/mouse interactions for poem 3D models.
 * - Drag: rotate
 * - Pinch / wheel: zoom (scale)
 * - Double tap/click: toggle auto-spin
 */

(function initModelInteractionController(windowObj) {
  let canvas = null;
  let target = null;
  let previousTouchAction = '';
  let usingPointerEvents = false;

  const pointers = new Map();
  const touches = new Map();
  const state = {
    rotating: false,
    lastX: 0,
    lastY: 0,
    pinchStartDistance: 0,
    pinchStartScale: 1,
    autoSpin: false,
    lastTapAt: 0
  };

  const LIMITS = {
    minScale: 0.05,
    maxScale: 3.2,
    rotateSpeed: 0.01,
    zoomSpeedWheel: 0.0014,
    zoomSpeedPinch: 0.006
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getScaleFromTarget() {
    if (!target) return 1;
    return target.scale.x || 1;
  }

  function setUniformScale(value) {
    if (!target) return;
    const clamped = clamp(value, LIMITS.minScale, LIMITS.maxScale);
    target.scale.set(clamped, clamped, clamped);
  }

  function markDoubleTap() {
    const now = performance.now();
    if (now - state.lastTapAt < 320) {
      state.autoSpin = !state.autoSpin;
      state.lastTapAt = 0;
      return;
    }
    state.lastTapAt = now;
  }

  function onPointerDown(event) {
    if (!target) return;

    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      state.rotating = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      markDoubleTap();
    }

    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      state.pinchStartDistance = distance(pts[0], pts[1]);
      state.pinchStartScale = getScaleFromTarget();
      state.rotating = false;
    }
  }

  function onPointerMove(event) {
    if (!target || !pointers.has(event.pointerId)) return;

    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1 && state.rotating) {
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;

      target.rotation.y += dx * LIMITS.rotateSpeed;
      target.rotation.x = clamp(target.rotation.x + dy * LIMITS.rotateSpeed * 0.5, -0.9, 0.9);

      state.lastX = event.clientX;
      state.lastY = event.clientY;
      return;
    }

    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      const currentDistance = distance(pts[0], pts[1]);
      const delta = currentDistance - state.pinchStartDistance;
      const nextScale = state.pinchStartScale + delta * LIMITS.zoomSpeedPinch;
      setUniformScale(nextScale);
    }
  }

  function onPointerUp(event) {
    pointers.delete(event.pointerId);

    if (pointers.size === 0) {
      state.rotating = false;
      return;
    }

    if (pointers.size === 1) {
      const remaining = Array.from(pointers.values())[0];
      state.rotating = true;
      state.lastX = remaining.x;
      state.lastY = remaining.y;
    }
  }

  function onWheel(event) {
    if (!target) return;
    event.preventDefault();

    const current = getScaleFromTarget();
    const next = current - event.deltaY * LIMITS.zoomSpeedWheel;
    setUniformScale(next);
  }

  function onMouseDown(event) {
    if (!target) return;
    state.rotating = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    markDoubleTap();
  }

  function onMouseMove(event) {
    if (!target || !state.rotating) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;

    target.rotation.y += dx * LIMITS.rotateSpeed;
    target.rotation.x = clamp(target.rotation.x + dy * LIMITS.rotateSpeed * 0.5, -0.9, 0.9);

    state.lastX = event.clientX;
    state.lastY = event.clientY;
  }

  function onMouseUp() {
    state.rotating = false;
  }

  function onTouchStart(event) {
    if (!target) return;
    event.preventDefault();

    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const t = event.changedTouches[i];
      touches.set(t.identifier, { x: t.clientX, y: t.clientY });
    }

    if (touches.size === 1) {
      const first = Array.from(touches.values())[0];
      state.rotating = true;
      state.lastX = first.x;
      state.lastY = first.y;
      markDoubleTap();
    }

    if (touches.size >= 2) {
      const pts = Array.from(touches.values());
      state.pinchStartDistance = distance(pts[0], pts[1]);
      state.pinchStartScale = getScaleFromTarget();
      state.rotating = false;
    }
  }

  function onTouchMove(event) {
    if (!target) return;
    event.preventDefault();

    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const t = event.changedTouches[i];
      if (touches.has(t.identifier)) {
        touches.set(t.identifier, { x: t.clientX, y: t.clientY });
      }
    }

    if (touches.size === 1 && state.rotating) {
      const pt = Array.from(touches.values())[0];
      const dx = pt.x - state.lastX;
      const dy = pt.y - state.lastY;

      target.rotation.y += dx * LIMITS.rotateSpeed;
      target.rotation.x = clamp(target.rotation.x + dy * LIMITS.rotateSpeed * 0.5, -0.9, 0.9);

      state.lastX = pt.x;
      state.lastY = pt.y;
      return;
    }

    if (touches.size >= 2) {
      const pts = Array.from(touches.values());
      const currentDistance = distance(pts[0], pts[1]);
      const delta = currentDistance - state.pinchStartDistance;
      const nextScale = state.pinchStartScale + delta * LIMITS.zoomSpeedPinch;
      setUniformScale(nextScale);
    }
  }

  function onTouchEnd(event) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const t = event.changedTouches[i];
      touches.delete(t.identifier);
    }

    if (touches.size === 0) {
      state.rotating = false;
      return;
    }

    if (touches.size === 1) {
      const first = Array.from(touches.values())[0];
      state.rotating = true;
      state.lastX = first.x;
      state.lastY = first.y;
    }
  }

  function addPointerListeners() {
    if (!canvas) return;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
  }

  function removePointerListeners() {
    if (!canvas) return;
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('pointerleave', onPointerUp);
  }

  function addTouchMouseListeners() {
    if (!canvas) return;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
  }

  function removeTouchMouseListeners() {
    if (!canvas) return;
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchmove', onTouchMove);
    canvas.removeEventListener('touchend', onTouchEnd);
    canvas.removeEventListener('touchcancel', onTouchEnd);
  }

  function attach(canvasEl) {
    if (!canvasEl) return;
    detach();

    canvas = canvasEl;
    previousTouchAction = canvas.style.touchAction;
    canvas.style.touchAction = 'none';

    usingPointerEvents = typeof window.PointerEvent !== 'undefined';
    if (usingPointerEvents) {
      addPointerListeners();
    } else {
      addTouchMouseListeners();
    }

    canvas.addEventListener('wheel', onWheel, { passive: false });
  }

  function detach() {
    if (!canvas) return;

    if (usingPointerEvents) {
      removePointerListeners();
    } else {
      removeTouchMouseListeners();
    }

    canvas.removeEventListener('wheel', onWheel);

    canvas.style.touchAction = previousTouchAction;
    canvas = null;

    pointers.clear();
    touches.clear();
    state.rotating = false;
  }

  function setTarget(targetObj) {
    target = targetObj || null;
  }

  function clearTarget() {
    target = null;
  }

  function update(delta) {
    if (!target || !state.autoSpin) return;
    target.rotation.y += delta * 0.8;
  }

  windowObj.ModelInteractionController = {
    attach,
    detach,
    setTarget,
    clearTarget,
    update
  };
})(window);
