// Import all necessary modules
import { CONFIG, YEAR_DATA } from './constants.js';
import { Planet } from './objects/Planet.js';
import { CursorParticle } from './objects/CursorParticle.js';
import { createStars } from './objects/stars.js';
import { drawLoadingScreen, incrementLoadProgress } from './ui/loading.js';
import { drawHoverTooltip } from './ui/tooltip.js';
import { showPlanetInfo, hidePlanetInfo } from './ui/planetInfo.js';
import { createIcons, Volume2, VolumeX } from 'lucide';

// Global state
const state = {
  // Sound
  spaceSound: null,
  volume: 0.5,
  soundEnabled: true,
  
  // Loading
  isLoading: true,
  loadProgress: 0,
  assetsLoaded: 0,
  
  // Camera
  camX: 0,
  camY: -800,
  camZ: 2000,
  targetX: 0,
  targetY: -800,
  targetZ: 2000,
  
  // Game state
  isZoomedIn: false,
  isPaused: false,
  
  // Objects
  stars: null,
  planets: [],
  cursorParticles: [],
  selectedPlanet: null,
  hoveredPlanet: null,
  
  // Textures
  planetTextures: [],
  
  // ML
  soundClassifier: null,
  faceApi: null,
  video: null,
  detections: [],
  poseNet: null,
  poses: [],
  
  // Visuals
  globalBrightness: 1.0,
  globalColorTint: null,
  soundButton: null
};

// Make state available globally for callbacks
window.state = state;

// Export state for other modules
window.isPaused = () => state.isPaused;
window.hoveredPlanet = () => state.hoveredPlanet;
window.globalColorTint = () => state.globalColorTint;
window.planetTextures = () => state.planetTextures;
window.unselectPlanet = unselectPlanet;

// Initialize the application
function preload() {
  // Load planet textures
  for (let i = 0; i < CONFIG.NUM_PLANETS; i++) {
    state.planetTextures[i] = loadImage(`assets/planets/planet${i}.jpg`, 
      () => updateLoadProgress(),
      () => console.error(`Failed to load planet texture ${i}`)
    );
  }
  
  // Load sound
  state.spaceSound = loadSound('assets/sounds/space-ambient.mp3', 
    () => updateLoadProgress(),
    () => console.error('Failed to load space sound')
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Set up 3D scene
  setAttributes('antialias', true);
  perspective(PI / 3, width / height, 0.1, 10000);
  
  // Initialize objects
  state.stars = createStars();
  initializePlanets();
  
  // Set up UI
  createSoundButton();
  
  // Set up event listeners
  windowResized();
  
  // Start sound if enabled
  if (state.soundEnabled && state.spaceSound) {
    state.spaceSound.loop();
    state.spaceSound.setVolume(state.volume);
  }
  
  // Set up ML models
  setupML();
}

function draw() {
  if (state.isLoading) {
    drawLoadingScreen(state.loadProgress);
    return;
  }
  
  // Update camera
  updateCamera();
  
  // Clear canvas
  background(0);
  
  // Set camera position
  camera(state.camX, state.camY, state.camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw stars
  state.stars.update();
  state.stars.draw();
  
  // Draw orbits and planets
  drawOrbits();
  updateAndDrawPlanets();
  
  // Draw cursor particles
  updateAndDrawCursorParticles();
  
  // Draw HUD
  drawHUD();
}

// Helper functions
function updateLoadProgress() {
  const newState = incrementLoadProgress(state.assetsLoaded);
  state.assetsLoaded = newState.assetsLoaded;
  state.loadProgress = newState.loadProgress;
  
  if (state.assetsLoaded >= CONFIG.ASSETS_TO_LOAD) {
    setTimeout(() => {
      state.isLoading = false;
    }, 500);
  }
}

function initializePlanets() {
  for (let i = 0; i < CONFIG.NUM_PLANETS; i++) {
    const orbitRadius = 200 + i * 120;
    const size = 30 + (i % 3) * 5;
    const speed = map(i, 0, CONFIG.NUM_PLANETS - 1, 0.002, 0.0005);
    
    const planet = new Planet(
      orbitRadius,
      size,
      speed,
      YEAR_DATA[i],
      i
    );
    
    state.planets.push(planet);
  }
}

function updateCamera() {
  state.camX = lerp(state.camX, state.targetX, 0.1);
  state.camY = lerp(state.camY, state.targetY, 0.1);
  state.camZ = lerp(state.camZ, state.targetZ, 0.1);
}

function drawOrbits() {
  for (const planet of state.planets) {
    planet.drawOrbit();
  }
}

function updateAndDrawPlanets() {
  for (const planet of state.planets) {
    planet.update();
    planet.display();
  }
}

function updateAndDrawCursorParticles() {
  // Update particles
  for (let i = state.cursorParticles.length - 1; i >= 0; i--) {
    const p = state.cursorParticles[i];
    p.update();
    p.drawScreen();
    
    if (p.isDead()) {
      state.cursorParticles.splice(i, 1);
    }
  }
  
  // Add new particles on mouse move
  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    for (let i = 0; i < 2; i++) {
      if (state.cursorParticles.length < CONFIG.MAX_CURSOR_PARTICLES) {
        const vx = (mouseX - pmouseX) * 0.1 + random(-0.5, 0.5);
        const vy = (mouseY - pmouseY) * 0.1 + random(-0.5, 0.5);
        state.cursorParticles.push(new CursorParticle(mouseX, mouseY, vx, vy));
      }
    }
  }
}

function drawHUD() {
  // Draw tooltip for hovered planet
  if (state.hoveredPlanet && !state.isZoomedIn) {
    drawHoverTooltip(state.hoveredPlanet, state.isZoomedIn);
  }
  
  // Draw FPS counter (debug)
  if (window.debugMode) {
    push();
    resetMatrix();
    textAlign(LEFT, TOP);
    fill(255);
    textSize(14);
    text(`FPS: ${frameRate().toFixed(1)}`, 10, 10);
    pop();
  }
}

function createSoundButton() {
  // Create container for the button
  state.soundButton = createDiv();
  state.soundButton.id = 'sound-button';
  state.soundButton.style('position', 'absolute');
  state.soundButton.style('top', '20px');
  state.soundButton.style('left', '20px');
  state.soundButton.style('cursor', 'pointer');
  state.soundButton.style('width', '32px');
  state.soundButton.style('height', '32px');
  state.soundButton.style('display', 'flex');
  state.soundButton.style('align-items', 'center');
  state.soundButton.style('justify-content', 'center');
  state.soundButton.style('background', 'rgba(0, 0, 0, 0.5)');
  state.soundButton.style('border-radius', '50%');
  state.soundButton.style('border', '1px solid rgba(255, 255, 255, 0.2)');
  state.soundButton.style('transition', 'all 0.2s');
  
  // Create the icon element
  const icon = document.createElement('i');
  icon.setAttribute('data-lucide', 'volume-2');
  icon.style.color = 'white';
  icon.style.width = '20px';
  icon.style.height = '20px';
  
  // Add the icon to the button
  state.soundButton.elt.appendChild(icon);
  
  // Initialize Lucide icons
  createIcons({
    icons: { Volume2, VolumeX }
  });
  
  // Add hover effect
  state.soundButton.mouseOver(() => {
    state.soundButton.style('background', 'rgba(255, 255, 255, 0.1)');
  });
  
  state.soundButton.mouseOut(() => {
    state.soundButton.style('background', 'rgba(0, 0, 0, 0.5)');
  });
  
  // Add click handler
  state.soundButton.mousePressed(toggleSound);
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  
  if (state.spaceSound) {
    const icon = state.soundButton.elt.querySelector('i');
    
    if (state.soundEnabled) {
      state.spaceSound.setVolume(state.volume);
      state.spaceSound.loop();
      icon.setAttribute('data-lucide', 'volume-2');
    } else {
      state.spaceSound.setVolume(0);
      icon.setAttribute('data-lucide', 'volume-x');
    }
    
    // Update the icon
    const iconName = icon.getAttribute('data-lucide');
    const iconElement = document.createElement('i');
    iconElement.setAttribute('data-lucide', iconName);
    iconElement.style.color = 'white';
    iconElement.style.width = '20px';
    iconElement.style.height = '20px';
    
    // Replace the old icon
    state.soundButton.elt.replaceChild(iconElement, icon);
    
    // Re-initialize Lucide icons
    createIcons({
      icons: { Volume2, VolumeX },
      attrs: {
        'stroke-width': 2.5
      }
    });
  }
}

function selectPlanetByIndex(idx) {
  if (idx < 0 || idx >= state.planets.length) return;
  
  const planet = state.planets[idx];
  
  if (state.isZoomedIn && state.selectedPlanet === planet) {
    unselectPlanet();
    return;
  }
  
  state.selectedPlanet = planet;
  state.isZoomedIn = true;
  
  const px = cos(planet.angle) * planet.orbitRadius;
  const pz = sin(planet.angle) * planet.orbitRadius;
  
  state.targetX = px;
  state.targetY = 0;
  state.targetZ = pz + planet.size * 1.5 + 150;
  
  showPlanetInfo(planet);
  console.log(`✨ ${planet.yearData.year} selected!`);
}

function unselectPlanet() {
  state.selectedPlanet = null;
  state.isZoomedIn = false;
  state.targetX = CONFIG.INITIAL_CAMERA.x;
  state.targetY = CONFIG.INITIAL_CAMERA.y;
  state.targetZ = CONFIG.INITIAL_CAMERA.z;
  
  hidePlanetInfo();
  console.log("🔙 Going back");
}

// Event handlers
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  perspective(PI / 3, width / height, 0.1, 10000);
}

function mousePressed() {
  if (state.isLoading) return;
  
  // Check if a planet was clicked
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  
  for (let i = 0; i < state.planets.length; i++) {
    const planet = state.planets[i];
    const planetPosition = new THREE.Vector3(
      cos(planet.angle) * planet.orbitRadius,
      0,
      sin(planet.angle) * planet.orbitRadius
    );
    
    const distance = raycaster.ray.distanceToPoint(planetPosition);
    
    if (distance < planet.size * 1.5) {
      selectPlanetByIndex(i);
      return;
    }
  }
  
  // If no planet was clicked, unselect current planet if zoomed in
  if (state.isZoomedIn) {
    unselectPlanet();
  }
}

function mouseMoved() {
  if (state.isLoading || state.isZoomedIn) {
    state.hoveredPlanet = null;
    return;
  }
  
  // Check if mouse is over a planet
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  
  let closestPlanet = null;
  let closestDistance = Infinity;
  
  for (const planet of state.planets) {
    const planetPosition = new THREE.Vector3(
      cos(planet.angle) * planet.orbitRadius,
      0,
      sin(planet.angle) * planet.orbitRadius
    );
    
    const distance = raycaster.ray.distanceToPoint(planetPosition);
    
    if (distance < planet.size * 1.5 && distance < closestDistance) {
      closestPlanet = planet;
      closestDistance = distance;
    }
  }
  
  state.hoveredPlanet = closestPlanet;
}

function touchMoved() {
  mouseMoved();
  return false; // Prevent default touch behavior
}

function mouseWheel(event) {
  if (state.isZoomedIn) {
    const zoomSpeed = 0.1;
    state.targetZ += event.delta * zoomSpeed;
    return false;
  }
}

// ML setup (simplified for this example)
function setupML() {
  // ML initialization would go here
  console.log("ML models would be initialized here");
}

// Initialize the app when the page loads
window.setup = setup;
window.draw = draw;
window.preload = preload;
window.windowResized = windowResized;
window.mousePressed = mousePressed;
window.mouseMoved = mouseMoved;
window.touchMoved = touchMoved;
window.mouseWheel = mouseWheel;

// Make sure Lucide icons are properly initialized when the page loads
document.addEventListener('DOMContentLoaded', () => {
  createIcons({
    icons: { Volume2, VolumeX },
    attrs: {
      'stroke-width': 2.5
    }
  });
});
