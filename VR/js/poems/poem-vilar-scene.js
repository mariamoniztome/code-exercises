/**
 * Poem scene 1: birds, wind and birthplace atmosphere.
 */

(function registerPoemVilarScene(windowObj) {
  function makeTextSprite(text, colorHex, size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = Math.max(28, Math.round(size * 420));
    const padding = 20;

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
    group.position.set(0, -0.17, 0);

    const modelAnchor = new THREE.Group();
    group.add(modelAnchor);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.5, 0.05, 40),
      new THREE.MeshStandardMaterial({ color: 0x3c2f20, roughness: 0.95 })
    );
    base.position.y = -0.03;
    group.add(base);

    const mist = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.03, 10, 50),
      new THREE.MeshBasicMaterial({ color: 0xe1cfa3, transparent: true, opacity: 0.35 })
    );
    mist.rotation.x = Math.PI / 2;
    mist.position.y = 0.04;
    group.add(mist);

    const fallbackBird = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.12, 0.03, 120, 14),
      new THREE.MeshStandardMaterial({ color: 0xd8bf8a, roughness: 0.45, metalness: 0.1 })
    );
    fallbackBird.position.set(0, 0.28, 0);
    group.add(fallbackBird);

    const verses = poemData && Array.isArray(poemData.verses)
      ? poemData.verses
      : [];

    const verseSprites = verses.map((line, index) => {
      const sprite = makeTextSprite(line, '#f2d8a4', 0.13);
      const angle = (index / verses.length) * Math.PI * 2;
      sprite.position.set(Math.cos(angle) * 0.23, 0.22 + index * 0.045, Math.sin(angle) * 0.23);
      sprite.material.opacity = 0;
      group.add(sprite);
      return sprite;
    });

    const state = {
      intro: 0,
      mist,
      verseSprites,
      fallbackBird,
      modelAnchor,
      externalModel: null
    };

    function applyModelTransform(model, config) {
      const position = (config && Array.isArray(config.position)) ? config.position : [0, 0.04, 0];
      const rotation = (config && Array.isArray(config.rotation)) ? config.rotation : [0, 0, 0];
      const scale = (config && Array.isArray(config.scale)) ? config.scale : [0.25, 0.25, 0.25];

      model.position.set(position[0] || 0, position[1] || 0, position[2] || 0);
      model.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
      model.scale.set(scale[0] || 0.25, scale[1] || 0.25, scale[2] || 0.25);
    }

    function loadExternalModel(config) {
      if (!config || !config.path || !THREE.GLTFLoader) return;

      const loader = new THREE.GLTFLoader();
      loader.load(
        config.path,
        (gltf) => {
          const model = gltf.scene;
          applyModelTransform(model, config);

          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });

          state.fallbackBird.visible = false;
          state.modelAnchor.add(model);
          state.externalModel = model;
        },
        undefined,
        () => {
          console.warn('Could not load model for poem 1 at', config.path);
        }
      );
    }

    loadExternalModel(modelConfig);

    function update(delta, elapsed) {
      state.intro = Math.min(state.intro + delta * 0.5, 1);

      state.fallbackBird.rotation.x += delta * 0.35;
      state.fallbackBird.rotation.y += delta * 0.75;
      state.fallbackBird.scale.setScalar(0.8 + Math.sin(elapsed * 1.4) * 0.1);

      if (state.externalModel) {
        state.modelAnchor.rotation.y += delta * 0.05;
      }

      state.mist.rotation.z += delta * 0.25;
      state.mist.material.opacity = 0.26 + Math.sin(elapsed * 1.2) * 0.08;

      state.verseSprites.forEach((sprite, i) => {
        const appear = Math.max(0, Math.min(1, (state.intro * 1.5) - i * 0.18));
        sprite.material.opacity = appear;
        sprite.position.y += Math.sin(elapsed * 1.3 + i) * 0.0006;
      });
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

  windowObj.PoemVilarScene = { create };
})(window);
