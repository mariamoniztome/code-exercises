class PartyMode {
  constructor() {
    this.isPartyMode = false;
    this.partyInterval = null;
    this.sunHue = 0;
    this.originalSunColor = { r: 251, g: 217, b: 70 };
    
    this.initElements();
    this.addEventListeners();
  }

  initElements() {
    this.partyButton = document.getElementById('party-toggle');
    this.partyModal = document.getElementById('party-modal');
    this.partyYes = document.getElementById('party-yes');
    this.partyNo = document.getElementById('party-no');
  }

  addEventListeners() {
    // Toggle party mode modal
    this.partyButton.addEventListener('click', () => {
      this.toggleModal(true);
    });

    // Party mode on
    this.partyYes.addEventListener('click', () => {
      this.togglePartyMode(true);
      this.toggleModal(false);
    });

    // Party mode off
    this.partyNo.addEventListener('click', () => {
      this.toggleModal(false);
    });

    // Close modal when clicking outside
    this.partyModal.addEventListener('click', (e) => {
      if (e.target === this.partyModal) {
        this.toggleModal(false);
      }
    });

    // ESC key to exit party mode
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isPartyMode) {
          this.togglePartyMode(false);
        } else {
          this.toggleModal(false);
        }
      }
    });
  }

  toggleModal(show) {
    if (show) {
      this.partyModal.classList.add('visible');
      // Focus the first button for better accessibility
      setTimeout(() => this.partyYes.focus(), 100);
    } else {
      this.partyModal.classList.remove('visible');
    }
  }

togglePartyMode(enable) {
  this.isPartyMode = enable;
  
  if (enable) {
    document.body.classList.add('party-mode');
    this.startPartyEffects();
    this.updatePlanetSpeeds(true); // Make planets spin faster
  } else {
    document.body.classList.remove('party-mode');
    this.stopPartyEffects();
    this.updatePlanetSpeeds(false); // Reset planet speeds
    // Reset sun color to default
    if (window.solarColor) {
      window.solarColor = { ...this.originalSunColor };
    }
  }
}

// In partyMode.js, update the startPartyEffects method:
startPartyEffects() {
  // Start color cycling for the sun - faster updates
  this.partyInterval = setInterval(() => {
    this.sunHue = (this.sunHue + 9) % 360; // Increased from 2 to 5 for faster color changes

    // Convert HSL to RGB for p5.js
    const color = this.hslToRgb(this.sunHue / 360, 1, 0.6); // Increased brightness

    // Update the global solarColor used in the draw function
    if (window.solarColor) {
      window.solarColor = {
        r: color.r * 255,
        g: color.g * 255,
        b: color.b * 255
      };
    }

    // Update the light colors as well - more intense
    if (window.partyLights) {
      window.partyLights = {
        r: color.r * 3.5 * 255, // Increased from 2.5 to 3.5 for brighter lights
        g: color.g * 3.5 * 255,
        b: color.b * 3.5 * 255
      };
    }
  }, 30); // Faster updates (reduced from 50ms to 30ms)
}

// Add this method to update planet speeds
updatePlanetSpeeds(faster = true) {
  if (!window.planets) return;
  
  window.planets.forEach(planet => {
    if (faster) {
      planet.originalSpeed = planet.speed; // Store original speed
      planet.speed *= 3; // Triple the speed
    } else if (planet.originalSpeed !== undefined) {
      planet.speed = planet.originalSpeed; // Restore original speed
    }
  });
}

  stopPartyEffects() {
    if (this.partyInterval) {
      clearInterval(this.partyInterval);
      this.partyInterval = null;
    }
  }

  // Helper function to convert HSL to RGB (returns values 0-1)
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

// Initialize party mode when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.partyMode = new PartyMode();
});
