/**
 * Poem scene 3: giant field, flowers and singing afternoon.
 */

(function registerPoemCampoScene(windowObj) {
  function makeTextSprite(text, colorHex, size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = Math.max(24, Math.round(size * 380));
    const padding = 18;

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

  function makeFlower(colorPetal, colorCore) {
    const flower = new THREE.Group();

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.004, 0.11, 6),
      new THREE.MeshStandardMaterial({ color: 0x2d6b35, roughness: 0.95 })
    );
    stem.position.y = 0.055;
    flower.add(stem);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 8, 8),
      new THREE.MeshStandardMaterial({ color: colorCore, roughness: 0.8 })
    );
    core.position.y = 0.115;
    flower.add(core);

    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2;
      const petal = new THREE.Mesh(
        new THREE.SphereGeometry(0.011, 8, 8),
        new THREE.MeshStandardMaterial({ color: colorPetal, roughness: 0.76 })
      );
      petal.position.set(Math.cos(angle) * 0.014, 0.115, Math.sin(angle) * 0.014);
      flower.add(petal);
    }

    return flower;
  }

  function makeNote() {
    const note = new THREE.Group();
    const stem = new THREE.Mesh(
      new THREE.BoxGeometry(0.004, 0.04, 0.004),
      new THREE.MeshStandardMaterial({ color: 0x231710, roughness: 0.5 })
    );
    stem.position.y = 0.022;

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x231710, roughness: 0.5 })
    );
    head.position.set(-0.008, 0.002, 0);

    note.add(stem, head);
    return note;
  }

  function create(options) {
    const poemData = options && options.poemData ? options.poemData : null;
    const group = new THREE.Group();
    group.position.set(0, -0.22, 0);

    const modelConfig = poemData && poemData.sceneModel ? poemData.sceneModel : null;
    const modelAnchor = new THREE.Group();
    group.add(modelAnchor);

    const field = new THREE.Mesh(
      new THREE.CircleGeometry(0.58, 72),
      new THREE.MeshStandardMaterial({ color: 0x4f8c3c, roughness: 0.95 })
    );
    field.rotation.x = -Math.PI / 2;
    group.add(field);

    const hillA = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 16, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x6fae55, roughness: 0.9 })
    );
    hillA.scale.set(1.7, 0.55, 1.2);
    hillA.position.set(-0.24, 0.06, -0.18);
    group.add(hillA);

    const hillB = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 24, 16, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x74b863, roughness: 0.9 })
    );
    hillB.scale.set(1.5, 0.5, 1.1);
    hillB.position.set(0.2, 0.06, -0.24);
    group.add(hillB);

    const flowers = [];
    for (let i = 0; i < 120; i += 1) {
      const petalColors = [0xf9d4e0, 0xf6e7a4, 0xded0ff, 0xffceb0];
      const colorPetal = petalColors[i % petalColors.length];
      const flower = makeFlower(colorPetal, 0xf3c95f);

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 0.5;
      flower.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      flower.userData.swayOffset = Math.random() * Math.PI * 2;
      flower.userData.swayPower = 0.4 + Math.random() * 0.8;

      group.add(flower);
      flowers.push(flower);
    }

    const notes = [];
    for (let i = 0; i < 14; i += 1) {
      const note = makeNote();
      note.position.set((Math.random() - 0.5) * 0.38, 0.08 + Math.random() * 0.12, (Math.random() - 0.5) * 0.24);
      note.userData.floatOffset = Math.random() * Math.PI * 2;
      note.userData.floatSpeed = 0.8 + Math.random() * 1.1;
      note.userData.drift = (Math.random() - 0.5) * 0.0005;
      group.add(note);
      notes.push(note);
    }

    const verses = poemData && Array.isArray(poemData.verses)
      ? poemData.verses
      : [];

    const verseSprites = verses.map((line, i) => {
      const sprite = makeTextSprite(line, '#f4ebd5', 0.11);
      const angle = (i / verses.length) * Math.PI * 2;
      sprite.position.set(Math.cos(angle) * 0.34, 0.2 + i * 0.04, Math.sin(angle) * 0.2);
      sprite.material.opacity = 0;
      group.add(sprite);
      return sprite;
    });

    const state = {
      intro: 0,
      flowers,
      notes,
      verseSprites,
      hillA,
      hillB,
      externalModel: null,
      modelAnchor
    };

    function applyModelTransform(model, config) {
      const position = (config && Array.isArray(config.position)) ? config.position : [0, 0, 0];
      const rotation = (config && Array.isArray(config.rotation)) ? config.rotation : [0, 0, 0];
      const scale = (config && Array.isArray(config.scale)) ? config.scale : [0.25, 0.25, 0.25];

      model.position.set(position[0] || 0, position[1] || 0, position[2] || 0);
      model.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
      model.scale.set(scale[0] || 0.25, scale[1] || 0.25, scale[2] || 0.25);
    }

    function loadExternalModel(config) {
      if (!config || !config.path) return;
      if (!THREE.GLTFLoader) {
        console.warn('GLTFLoader is not available. Skipping external model load.');
        return;
      }

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

          state.modelAnchor.add(model);
          state.externalModel = model;
        },
        undefined,
        () => {
          console.warn('Could not load model at', config.path, '- using procedural field fallback.');
        }
      );
    }

    loadExternalModel(modelConfig);

    function update(delta, elapsed) {
      state.intro = Math.min(state.intro + delta * 0.65, 1);

      state.hillA.position.y = 0.06 + Math.sin(elapsed * 0.45) * 0.008;
      state.hillB.position.y = 0.06 + Math.sin(elapsed * 0.52 + 0.7) * 0.008;

      state.flowers.forEach((flower) => {
        const sway = Math.sin(elapsed * flower.userData.swayPower + flower.userData.swayOffset) * 0.14;
        flower.rotation.z = sway;
        flower.scale.setScalar(0.2 + state.intro * 0.8);
      });

      state.notes.forEach((note, i) => {
        note.position.y += Math.sin(elapsed * note.userData.floatSpeed + note.userData.floatOffset) * 0.0009;
        note.position.x += note.userData.drift;
        note.rotation.z = Math.sin(elapsed * 2.0 + i) * 0.22;

        if (note.position.x > 0.24) note.position.x = -0.24;
        if (note.position.x < -0.24) note.position.x = 0.24;

        note.scale.setScalar(0.35 + Math.sin(elapsed * 1.6 + i) * 0.08 + state.intro * 0.65);
      });

      if (state.externalModel) {
        state.modelAnchor.rotation.y += delta * 0.03;
      }

      state.verseSprites.forEach((sprite, i) => {
        const appear = Math.max(0, Math.min(1, (state.intro * 1.8) - i * 0.16));
        sprite.material.opacity = appear;
        sprite.position.y += Math.sin(elapsed * 0.9 + i * 0.8) * 0.0007;
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

  windowObj.PoemCampoScene = { create };
})(window);
