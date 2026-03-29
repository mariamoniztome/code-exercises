/**
 * Poem scene 2: GLB-first lighthouse scene.
 * Only the external model is used for the lighthouse object.
 */

(function registerPoemFarolScene(windowObj) {
  function makeTextSprite(text, colorHex, size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = Math.max(24, Math.round(size * 360));
    const padding = 16;

    ctx.font = 'italic ' + fontSize + 'px "IM Fell English", serif';
    const metrics = ctx.measureText(text);
    canvas.width = Math.ceil(metrics.width + padding * 2);
    canvas.height = Math.ceil(fontSize * 1.8);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'italic ' + fontSize + 'px "IM Fell English", serif';
    ctx.fillStyle = colorHex;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, padding, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(material);
    const aspect = canvas.width / canvas.height;
    sprite.scale.set(size * aspect, size, 1);
    return sprite;
  }

  function create(options) {
    const poemData = options && options.poemData ? options.poemData : null;
    const modelConfig = poemData && poemData.sceneModel ? poemData.sceneModel : null;

    const group = new THREE.Group();
    group.position.set(0, -0.2, 0);

    const modelAnchor = new THREE.Group();
    group.add(modelAnchor);

    const debugLabel = makeTextSprite('A carregar lighthouse.glb...', '#fbe2a2', 0.08);
    debugLabel.position.set(0, 0.45, 0);
    group.add(debugLabel);

    const verses = poemData && Array.isArray(poemData.verses)
      ? poemData.verses
      : [];

    const verseSprites = verses.map((line, i) => {
      const sprite = makeTextSprite(line, '#fbe2a2', 0.1);
      sprite.position.set(-0.32, 0.12 + i * 0.08, -0.16 + i * 0.05);
      sprite.material.opacity = 0;
      group.add(sprite);
      return sprite;
    });

    const state = {
      intro: 0,
      modelAnchor,
      externalModel: null,
      debugLabel,
      verseSprites
    };

    function applyModelTransform(model, config) {
      const position = (config && Array.isArray(config.position)) ? config.position : [0, 0.08, 0];
      const rotation = (config && Array.isArray(config.rotation)) ? config.rotation : [0, 0, 0];
      const scale = (config && Array.isArray(config.scale)) ? config.scale : [1, 1, 1];

      const bbox = new THREE.Box3().setFromObject(model);
      if (!bbox.isEmpty()) {
        const center = bbox.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const fit = 0.7 / maxDim;
        model.scale.multiplyScalar(fit);
      }

      model.position.add(new THREE.Vector3(position[0] || 0, position[1] || 0, position[2] || 0));
      model.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
      model.scale.multiply(new THREE.Vector3(scale[0] || 1, scale[1] || 1, scale[2] || 1));
    }

    function tryLoadAtPaths(paths, onSuccess, onFailure) {
      if (!THREE.GLTFLoader) {
        onFailure('GLTFLoader missing');
        return;
      }

      const loader = new THREE.GLTFLoader();
      let idx = 0;

      function next() {
        if (idx >= paths.length) {
          onFailure('All paths failed');
          return;
        }

        const path = paths[idx++];
        loader.load(
          path,
          (gltf) => onSuccess(gltf, path),
          undefined,
          () => next()
        );
      }

      next();
    }

    function loadExternalModel(config) {
      const configuredPath = config && config.path ? config.path : 'blender/lighthouse.glb';
      const pathCandidates = [
        configuredPath,
        './' + configuredPath,
        '/blender/lighthouse.glb',
        'blender/lighthouse.glb'
      ];

      tryLoadAtPaths(
        pathCandidates,
        (gltf, loadedPath) => {
          const model = gltf.scene;
          applyModelTransform(model, config);

          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });

          state.modelAnchor.add(model);
          state.externalModel = model;

          state.debugLabel.material.opacity = 0;
          state.debugLabel.visible = false;

          console.log('[PoemFarolScene] Lighthouse loaded from', loadedPath);
        },
        () => {
          state.debugLabel.material.opacity = 1;
          state.debugLabel.visible = true;
          state.debugLabel.material.color.set('#ffb7b7');
          state.debugLabel.scale.multiplyScalar(1.08);
          state.debugLabel.position.y = 0.5;

          const errorText = makeTextSprite('Falha a carregar blender/lighthouse.glb', '#ffb7b7', 0.07);
          errorText.position.set(0, 0.38, 0);
          group.add(errorText);

          console.warn('[PoemFarolScene] Lighthouse model failed to load from all candidates.');
        }
      );
    }

    loadExternalModel(modelConfig);

    function update(delta, elapsed) {
      state.intro = Math.min(state.intro + delta * 0.8, 1);

      state.verseSprites.forEach((sprite, i) => {
        const appear = Math.max(0, Math.min(1, (state.intro * 1.6) - i * 0.18));
        sprite.material.opacity = appear;
        sprite.position.y += Math.sin(elapsed * 0.9 + i) * 0.0006;
      });

      if (state.externalModel) {
        state.modelAnchor.position.y = Math.sin(elapsed * 1.1) * 0.01;
      }
    }

    function dispose() {
      group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
        if (obj.material && obj.material.map) obj.material.map.dispose();
      });
    }

    function getInteractionTarget() {
      return state.externalModel ? state.modelAnchor : group;
    }

    return { group, update, dispose, getInteractionTarget };
  }

  windowObj.PoemFarolScene = { create };
})(window);
