class ManualMode {
  constructor() {
    this.isManualMode = false;
    this.manualInterval = null;
    this.sunHue = 0;
    this.originalSunColor = { r: 251, g: 217, b: 70 };

    this.initElements();
    this.addEventListeners();
  }

  initElements() {
    this.manualButton = document.getElementById('manual-toggle');
  }

  addEventListeners() {
    // Toggle manual mode on button click
    this.manualButton.addEventListener('click', () => {
      this.toggleManualMode(!this.isManualMode);
    });

    // 'M' key for manual mode
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'm') {
        this.toggleManualMode(!this.isManualMode);
      }
    });

    // ESC also disables manual mode
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isManualMode) {
        this.toggleManualMode(false);
      }
    });
  }

  // Enable or disable manual mode
  toggleManualMode(enable) {
    this.isManualMode = enable;
    
    const handCursor = document.getElementById('hand-cursor');
    const handControls = document.getElementById('hand-controls');
    
    if (enable) {
      document.body.classList.add('manual-mode');
      if (handCursor) handCursor.style.display = 'none';
      if (handControls) handControls.style.display = 'none';
      this.startManualEffects();
      this.updatePlanetSpeeds(true);
    } else {
      document.body.classList.remove('manual-mode');
      if (handCursor) handCursor.style.display = 'flex';
      if (handControls) handControls.style.display = 'flex';
      this.stopManualEffects();
      this.updatePlanetSpeeds(false);

      if (window.solarColor) {
        window.solarColor = { ...this.originalSunColor };
      }
    }
  }

  // Start manual color cycling effects
  startManualEffects() {
    this.manualInterval = setInterval(() => {
      this.sunHue = (this.sunHue + 9) % 360;
      const color = this.hslToRgb(this.sunHue / 360, 1, 0.6);

      if (window.solarColor) {
        window.solarColor = {
          r: color.r * 255,
          g: color.g * 255,
          b: color.b * 255
        };
      }

      if (window.manualLights) {
        window.manualLights = {
          r: color.r * 3.5 * 255,
          g: color.g * 3.5 * 255,
          b: color.b * 3.5 * 255
        };
      }
    }, 30);
  }

  // Speed up or reset planet speeds
  updatePlanetSpeeds(faster = true) {
    if (!window.planets) return;
    
    window.planets.forEach(planet => {
      if (faster) {
        planet.originalSpeed = planet.speed;
        planet.speed *= 3;
      } else if (planet.originalSpeed !== undefined) {
        planet.speed = planet.originalSpeed;
      }
    });
  }

  // Stop manual color cycling effects
  stopManualEffects() {
    if (this.manualInterval) {
      clearInterval(this.manualInterval);
      this.manualInterval = null;
    }
  }

  // Convert HSL to RGB
  hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r, g, b };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.manualMode = new ManualMode();
});