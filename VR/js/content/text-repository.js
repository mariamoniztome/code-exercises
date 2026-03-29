/**
 * TextRepository
 * Loads and exposes centralized texts from JSON.
 */

(function initTextRepository(windowObj) {
  const state = {
    loaded: false,
    data: null
  };

  function getByPath(source, path) {
    return String(path || '')
      .split('.')
      .filter(Boolean)
      .reduce((acc, key) => (acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined), source);
  }

  async function load(path) {
    if (state.loaded) return state.data;

    const response = await fetch(path || 'data/texts.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Unable to load texts JSON: ' + response.status);
    }

    state.data = await response.json();
    state.loaded = true;
    return state.data;
  }

  function get(path, fallbackValue) {
    const value = state.data ? getByPath(state.data, path) : undefined;
    return value === undefined ? fallbackValue : value;
  }

  function getPoems() {
    return get('poems', []);
  }

  windowObj.TextRepository = {
    load,
    get,
    getPoems,
    isLoaded: () => state.loaded
  };
})(window);
