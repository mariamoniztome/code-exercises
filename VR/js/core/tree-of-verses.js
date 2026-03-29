/**
 * TreeOfVerses facade.
 * Keeps API compatibility while delegating each poem to a dedicated 3D scene file.
 */

const TreeOfVerses = (() => {
  const FALLBACK_POEMS = [
    {
      id: 'vilar',
      title: 'O Poeta e Vilar',
      verses: [
        'Assim como os passarinhos',
        'Nasceram para voar',
        'Eu, nasci para ser poeta',
        'Nesta terra de Vilar'
      ]
    },
    {
      id: 'letras',
      title: 'As Letras e o Farol',
      verses: [
        'Nas letras do alfabeto',
        'Ha um imenso farol',
        'Quem estudar encontra nelas',
        'Mais luz que o proprio Sol!'
      ]
    },
    {
      id: 'rebeldia',
      title: 'A Rebeldia e o Povo',
      verses: [
        'No campo por entre as flores',
        'Com alegres ceifeiras',
        'Eu cantava ao desafio',
        'As vezes tardes inteiras!'
      ]
    }
  ];

  const SCENE_CREATORS = [
    () => window.PoemVilarScene,
    () => window.PoemFarolScene,
    () => window.PoemCampoScene
  ];

  let poems = FALLBACK_POEMS;
  let scene = null;
  let activeScene = null;
  let activePoemIndex = null;
  let onPoemReady = null;
  let readyTimer = null;
  let phase = 'idle';

  function init(sceneRef) {
    scene = sceneRef;

    const repoPoems = (window.TextRepository && window.TextRepository.getPoems)
      ? window.TextRepository.getPoems()
      : [];

    if (Array.isArray(repoPoems) && repoPoems.length >= 3) {
      poems = repoPoems;
    }
  }

  function startPoem(poemIndex) {
    dispose();

    const poem = poems[poemIndex];
    const creatorGetter = SCENE_CREATORS[poemIndex];
    if (!scene || !poem || !creatorGetter) {
      phase = 'idle';
      return;
    }

    const creator = creatorGetter();
    if (!creator || typeof creator.create !== 'function') {
      console.warn('Poem scene factory is missing for index:', poemIndex);
      phase = 'idle';
      return;
    }

    activeScene = creator.create({ poemIndex, poemData: poem });
    if (!activeScene || !activeScene.group) {
      phase = 'idle';
      return;
    }

    scene.add(activeScene.group);
    activePoemIndex = poemIndex;
    phase = 'playing';

    readyTimer = setTimeout(() => {
      if (onPoemReady && activePoemIndex === poemIndex) {
        onPoemReady(poem);
      }
    }, 900);
  }

  function update(delta, elapsed) {
    if (!activeScene || typeof activeScene.update !== 'function') return;
    activeScene.update(delta, elapsed);
  }

  function dispose() {
    if (readyTimer) {
      clearTimeout(readyTimer);
      readyTimer = null;
    }

    if (activeScene && activeScene.group && scene) {
      scene.remove(activeScene.group);
    }

    if (activeScene && typeof activeScene.dispose === 'function') {
      activeScene.dispose();
    }

    activeScene = null;
    activePoemIndex = null;
    phase = 'idle';
  }

  function getPoemData(index) {
    return poems[index];
  }

  function getPoemsCount() {
    return poems.length;
  }

  function getInteractionTarget() {
    if (!activeScene) return null;
    if (typeof activeScene.getInteractionTarget === 'function') {
      return activeScene.getInteractionTarget();
    }
    return activeScene.group || null;
  }

  return {
    init,
    startPoem,
    update,
    dispose,
    getPoemData,
    getPoemsCount,
    getInteractionTarget,
    set onPoemReady(fn) { onPoemReady = fn; },
    getPhase: () => phase
  };
})();
