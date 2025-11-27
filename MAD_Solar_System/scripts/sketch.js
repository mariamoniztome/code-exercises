// Sound
let spaceSound;
let volume = 0.5;
let soundEnabled = true;
let soundButton;
// Stars
let stars = [];
let TARGET_FPS = 60;
const STAR_MIN = 500;
const STAR_MAX = 5000;
const NUM_STARS = 5000;
const STAR_FIELD_SIZE = 3000;
// Sun
const SUN_RADIUS = 80;
let solarColor = { r: 251, g: 217, b: 70 };
let sunHue = 30; // 0–360
let sunBright = 1.0; // 0–1
// Planets
let planets = [];
const NUM_PLANETS = 10;
let selectedPlanet = null;
let hoveredPlanet = null;
let isZoomedIn = false;
let isPaused = false;
// Camera
let camX = 0,
  camY = -800,
  camZ = 2000;
let targetX = 0,
  targetY = -800,
  targetZ = 2000;
// Procedural textures
let textureIndexToUpdate = 0;

// Global functions

// Auto adjust star count based on frame rate
function autoAdjustStars() {
  const fps = frameRate();

  if (fps < TARGET_FPS * 0.8 && stars.length > STAR_MIN) {
    stars.splice(0, 20);
  }

  // Always ensure we have at least minStars
  while (stars.length < STAR_MIN) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
  }

  if (fps > TARGET_FPS * 0.95 && stars.length < STAR_MAX) {
    for (let i = 0; i < 30; i++) {
      stars.push({
        x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
        y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
        z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      });
    }
  }
}

// Select a planet by its index
function selectPlanetByIndex(idx) {
  if (idx < 0 || idx >= planets.length) return;
  const p = planets[idx];
  if (isZoomedIn && selectedPlanet === p) {
    unselectPlanet();
    return;
  }
  selectedPlanet = p;
  isZoomedIn = true;
  const px = cos(p.angle) * p.orbitRadius;
  const pz = sin(p.angle) * p.orbitRadius;
  targetX = px;
  targetY = 0;
  targetZ = pz + p.size * 1.5 + 150;
  showPlanetInfo(p);
  console.log(`${p.yearData.year} selected.`);
}

// Unselect the current planet and return to overview
function unselectPlanet() {
  selectedPlanet = null;
  isZoomedIn = false;
  targetX = 0;
  targetY = -800;
  targetZ = 2000;
  hidePlanetInfo();
  console.log("Return to solar system overview.");
}

// Preload assets
function preload() {
  spaceSound = loadSound("assets/sounds/space.mp3");
}

// Setup the sketch
function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera(0, -800, 2000);
  createProceduralTextures();

  // Video for PoseNet 
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Stars
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
  }

  // Planets
  let sizes = [50, 55, 50, 70, 55, 60, 52, 75, 58, 90];
  for (let i = 0; i < NUM_PLANETS; i++) {
    planets.push(
      new Planet(200 + i * 100, sizes[i], random(0.002, 0.006), yearData[i], i)
    );
  }

  // Sound
  setTimeout(() => {
    if (spaceSound && !spaceSound.isPlaying()) {
      spaceSound.loop();
      spaceSound.setVolume(0.5);
    }
  }, 500);

  soundButton = document.getElementById("sound-toggle");
  if (soundButton) soundButton.addEventListener("click", toggleSound);

  // Keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "Escape") {
      if (isZoomedIn) unselectPlanet();
    } else if (e.code === "Space") {
      isPaused = !isPaused;
      e.preventDefault();
    } else if (e.key === "h" || e.key === "H") {
      const p = document.getElementById("shortcuts");
      if (p) p.classList.toggle("hidden");
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      if (selectedPlanet) {
        let idx = planets.indexOf(selectedPlanet);
        idx = (idx - 1 + NUM_PLANETS) % NUM_PLANETS;
        selectPlanetByIndex(idx);
      }
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      if (selectedPlanet) {
        let idx = planets.indexOf(selectedPlanet);
        idx = (idx + 1) % NUM_PLANETS;
        selectPlanetByIndex(idx);
      }
      e.preventDefault();
    } else {
      const num = parseInt(e.key);
      if (!isNaN(num)) {
        let idx = num - 1;
        if (num === 0) idx = 9;
        if (idx >= 0 && idx < NUM_PLANETS) selectPlanetByIndex(idx);
      }
    }
  });

  // ML5
  setupPoseNet();
  setupSoundClassifier();
}

// Helpers

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: round(r * 255),
    g: round(g * 255),
    b: round(b * 255),
  };
}

// Draw stars in the background
function drawStars() {
  push();
  noStroke();

  // Increased star brightness and made it less dependent on sunProgress
  const starBrightness = map(1 - sunProgress, 0, 1, 80, 255, true);
  fill(starBrightness);

  // Make stars slightly bigger and more detailed
  for (let s of stars) {
    push();
    translate(s.x, s.y, s.z);
    sphere(3, 8, 6);
    pop();
  }

  pop();
}

// Main draw loop
function draw() {
  updateProceduralTextures(textureIndexToUpdate);
  textureIndexToUpdate = (textureIndexToUpdate + 1) % 10;

  // Update sun cycle based on hand position
  updateSunCycle();
  background(5, 5, 15);

  // Update sun color - use manual mode colors if active
  if (window.manualMode && window.manualMode.isManualMode) {
    // In manual mode, solarColor is updated by the manual mode effect
    // Use the manualLights for the light sources
    const lr = window.manualLights ? window.manualLights.r : 255;
    const lg = window.manualLights ? window.manualLights.g : 255;
    const lb = window.manualLights ? window.manualLights.b : 255;
    
    ambientLight(30, 30, 50);
    directionalLight(lr, lg, lb, 0.5, -0.3, -0.4);
    pointLight(lr * 1.5, lg * 1.5, lb * 1.5, 0, 0, 0);
  } else {
    // Normal mode - controlled by hand position
    let rgb = hslToRgb(sunHue, 0.7, 0.5); // saturation 70%, lightness 50%
    solarColor = rgb; // update global sun color
    
    let intensity = lerp(0.3, 2.5, sunProgress); // sun stronger when hand is at the top
    let lr = solarColor.r * intensity;
    let lg = solarColor.g * intensity;
    let lb = solarColor.b * intensity;
    
    // Very soft ambient light
    ambientLight(10);
    // Directional light (sun as a beam from the top-right)
    directionalLight(lr, lg, lb, 0.5, -0.3, -0.4);
    // Intense point light (the sun's actual glow)
    pointLight(lr * 2, lg * 2, lb * 2, 0, 0, 0);
  }

  // Dynamic sound
  if (spaceSound && spaceSound.isPlaying() && soundEnabled) {
    if (isZoomedIn) {
      spaceSound.setVolume(0.1);
    } else {
      let d = dist(camX, camY, camZ, 0, 0, 0);
      let v = map(d, 400, 2800, 0.8, 0.05, true);
      spaceSound.setVolume(v);
    }
  }

  // Camera tracking
  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.size * 1.5 + 150;
  }

  camX = lerp(camX, targetX, 0.05);
  camY = lerp(camY, targetY, 0.05);
  camZ = lerp(camZ, targetZ, 0.05);

  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    camera(camX, camY, camZ, px, 0, pz, 0, 1, 0);
  } else {
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  }

  // Stars
  autoAdjustStars();
  drawStars();

  // Sun
  if (!isZoomedIn) {
    push();
    noStroke();

    let base = solarColor;
    
    // In manual mode, use more vibrant colors and effects
    if (window.manualMode && window.manualMode.isManualMode) {
      // More intense and colorful sun in manual mode
      const intensity = 1.5 + 0.5 * sin(frameCount * 0.05); // Pulsing effect
      
      // LAYER 1 — super bright core with vibrant colors
      emissiveMaterial(base.r * 5 * intensity, base.g * 5 * intensity, base.b * 5 * intensity);
      sphere(SUN_RADIUS, 64, 48);

      // LAYER 2 — inner halo with color shift
      push();
      const hue = (frameCount * 0.5) % 360;
      const rgb = hslToRgb(hue, 1, 0.7);
      emissiveMaterial(rgb.r * 3, rgb.g * 3, rgb.b * 3);
      scale(1.3);
      sphere(SUN_RADIUS, 64, 48);
      pop();

      // LAYER 3 — middle halo with another color
      push();
      const hue2 = (frameCount * 0.3 + 120) % 360;
      const rgb2 = hslToRgb(hue2, 1, 0.6);
      emissiveMaterial(rgb2.r * 2, rgb2.g * 2, rgb2.b * 2);
      scale(1.6);
      sphere(SUN_RADIUS, 64, 48);
      pop();

      // LAYER 4 — outer bloom with third color
      push();
      const hue3 = (frameCount * 0.2 + 240) % 360;
      const rgb3 = hslToRgb(hue3, 1, 0.5);
      emissiveMaterial(rgb3.r, rgb3.g, rgb3.b);
      scale(2.0);
      sphere(SUN_RADIUS, 64, 48);
      pop();
    } else {
      // Normal sun rendering
      // LAYER 1 — super bright core
      emissiveMaterial(base.r * 4, base.g * 4, base.b * 4);
      sphere(SUN_RADIUS, 64, 48);

      // LAYER 2 — inner halo
      push();
      emissiveMaterial(base.r * 0.8, base.g * 0.8, base.b * 0.8);
      scale(1.3);
      sphere(SUN_RADIUS, 64, 48);
      pop();

      // LAYER 3 — outer soft halo
      push();
      emissiveMaterial(base.r * 0.4, base.g * 0.4, base.b * 0.4);
      scale(1.6);
      sphere(SUN_RADIUS, 64, 48);
      pop();

      // LAYER 4 — very soft fake bloom
      push();
      emissiveMaterial(base.r * 0.25, base.g * 0.25, base.b * 0.25);
      scale(2.0);
      sphere(SUN_RADIUS, 64, 48);
      pop();
    }

    pop();
  }

  // Orbits
  if (!isZoomedIn) {
    for (let p of planets) {
      p.drawOrbit();
    }
  }

  // Planets
  for (let p of planets) {
    if (!isPaused) p.update();
    if (!isZoomedIn || p === selectedPlanet) {
      p.display();
    }
  }
}

// Event handlers

// Mouse pressed
function mousePressed() {
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  // Simple selection by click 
  if (!isZoomedIn && hoveredPlanet) {
    selectedPlanet = hoveredPlanet;
    isZoomedIn = true;

    const px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    const pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;

    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.size * 1.5 + 150;

    showPlanetInfo(selectedPlanet); // se também quiseres remover, digo-te como
  } else if (isZoomedIn) {
    unselectPlanet();
  }
}


// Window resized 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Mouse wheel for zooming
function mouseWheel(event) {
  if (!isZoomedIn) {
    targetZ += event.delta * 2;
    targetZ = constrain(targetZ, 600, 5000);
  }
  return false;
}