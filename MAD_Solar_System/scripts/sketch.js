// Som
let spaceSound;
let volume = 0.5;
let soundEnabled = true;
let soundButton;

// Estrelas
let stars = [];
const NUM_STARS = 200;
const STAR_FIELD_SIZE = 2000;

// Sol
const SUN_RADIUS = 80;

// Planetas
let planets = [];
const NUM_PLANETS = 10;
let selectedPlanet = null;
let hoveredPlanet = null;
let isZoomedIn = false;
let camX = 0,
  camY = -800,
  camZ = 1400;
let targetX = 0,
  targetY = -800,
  targetZ = 1400;

function preload() {
  // Carregar som ANTES de tudo
  spaceSound = loadSound("assets/sounds/space.mp3");
}

function setup() {
  frameRate(60);
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  camera(0, -800, 1400);

  // gerar estrelas
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
  }

  // criar planetas
  for (let i = 0; i < NUM_PLANETS; i++) {
    let orbitRadius = 200 + i * 100;
    let planetRadius = random(35, 65);
    let speed = random(0.008, 0.002);
    let c = color(random(80, 255), random(80, 255), random(80, 255));
    planets.push(new Planet(orbitRadius, planetRadius, speed, c, i));
  }

  // iniciar som
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  // botão de som
  soundButton = document.getElementById("sound-toggle");
  soundButton.addEventListener("click", toggleSound);
}

function draw() {
  background(11, 13, 20);

  // 🔊 Ajustar volume baseado no zoom (CORRIGIDO)
  if (spaceSound && spaceSound.isPlaying() && soundEnabled) {
    if (isZoomedIn) {
      spaceSound.setVolume(0.2); // volume mais baixo no zoom
    } else {
      let distFromCenter = dist(camX, camY, camZ, 0, 0, 0);
      let vol = map(distFromCenter, 600, 2500, 0.5, 0.1, true);
      spaceSound.setVolume(vol);
    }
  }

  // Detetar planeta sob o rato
  if (!isZoomedIn) {
    hoveredPlanet = null;
    let minDist = Infinity;

    for (let p of planets) {
      let px = cos(p.angle) * p.orbitRadius;
      let pz = sin(p.angle) * p.orbitRadius;
      let sx = width / 2 + px * 0.5;
      let sy = height / 2 + pz * 0.5;
      let d = dist(mouseX, mouseY, sx, sy);

      if (d < 120 && d < minDist) {
        minDist = d;
        hoveredPlanet = p;
      }
    }
  } else {
    hoveredPlanet = null;
  }

  // câmara segue o planeta quando está em zoom
  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;

    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.radius * 1.5 + 80;
  }

  // movimento suave da câmara
  camX = lerp(camX, targetX, 0.05);
  camY = lerp(camY, targetY, 0.05);
  camZ = lerp(camZ, targetZ, 0.05);

  // câmara sempre olha para o alvo
  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    camera(camX, camY, camZ, px, 0, pz, 0, 1, 0);
  } else {
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  }

  // 🎮 Controlo da câmara (CORRIGIDO - agora permite Y)
  if (!isZoomedIn) {
    orbitControl(2, 2, 0.2); // controlo livre com Y
  }

  // campo de estrelas
  push();
  noStroke();
  fill(255);
  for (let s of stars) {
    push();
    translate(s.x, s.y, s.z);
    sphere(1.5, 6, 4);
    pop();
  }
  pop();

  // luzes
  ambientLight(60);
  directionalLight(255, 255, 255, 0.6, -1, -0.2);

  // sol
  push();
  noStroke();
  emissiveMaterial(255, 210, 80);
  sphere(SUN_RADIUS, 48, 36);
  pop();

  // planetas
  for (let p of planets) {
    p.update();
    p.display();
  }
}

// class Planet
class Planet {
  constructor(orbitRadius, radius, speed, c, type) {
    this.orbitRadius = orbitRadius;
    this.radius = radius;
    this.speed = speed;
    this.color = c;
    this.type = type;
    this.angle = random(TWO_PI);
  }

  update() {
    this.angle += this.speed;
  }

  display() {
    let x = cos(this.angle) * this.orbitRadius;
    let z = sin(this.angle) * this.orbitRadius;

    if (!isZoomedIn) {
      push();
      rotateX(HALF_PI);
      stroke(80, 90, 120, 80);
      noFill();
      circle(0, 0, this.orbitRadius * 2);
      pop();
    }

    if (this === hoveredPlanet) {
      push();
      translate(x, 0, z);
      noFill();
      stroke(255, 255, 0);
      strokeWeight(2);
      sphere(this.radius * 1.5, 16, 12);
      pop();
    }

    push();
    translate(x, 0, z);
    noStroke();

    switch (this.type) {
      case 0:
        ambientMaterial(this.color);
        let deform = noise(frameCount * 0.02, this.angle) * 2;
        sphere(this.radius + deform, 24, 16);
        break;

      case 1:
        ambientMaterial(this.color);
        sphere(this.radius, 32, 24);
        push();
        rotateX(HALF_PI);
        stroke(200);
        noFill();
        circle(0, 0, this.radius * 3);
        circle(0, 0, this.radius * 4);
        circle(0, 0, this.radius * 5);
        circle(0, 0, this.radius * 6);
        pop();
        break;

      case 2:
        ambientMaterial(this.color);
        sphere(this.radius, 24, 16);
        push();
        fill(255);
        for (let i = 0; i < 6; i++) {
          let a = frameCount * 0.05 + (i * PI) / 3;
          let px = cos(a) * this.radius * 2;
          let pz = sin(a) * this.radius * 2;
          push();
          translate(px, 0, pz);
          sphere(2, 6, 4);
          pop();
        }
        pop();
        break;

      case 3:
        specularMaterial(180);
        shininess(80);
        sphere(this.radius, 32, 24);
        break;

      case 4:
        specularMaterial(120, 120, 140);
        shininess(200);
        sphere(this.radius, 32, 24);
        break;

      case 5:
        emissiveMaterial(180, 240, 255);
        sphere(this.radius, 32, 24);
        break;

      case 6:
        let glow = sin(frameCount * 0.1) * 100 + 155;
        emissiveMaterial(glow, 0, 255);
        sphere(this.radius, 32, 24);
        break;

      case 7:
        let n = noise(frameCount * 0.01, this.orbitRadius * 0.01) * 255;
        ambientMaterial(n, 180, 255 - n);
        sphere(this.radius, 32, 24);
        break;

      case 8:
        ambientMaterial(40, 40, 80);
        shininess(10);
        sphere(this.radius, 32, 24);
        break;

      case 9:
        ambientMaterial(this.color);
        for (let i = 0; i < 5; i++) {
          let dx = random(-this.radius / 2, this.radius / 2);
          let dy = random(-this.radius / 2, this.radius / 2);
          let dz = random(-this.radius / 2, this.radius / 2);
          push();
          translate(dx, dy, dz);
          sphere(this.radius / 2.5, 16, 12);
          pop();
        }
        break;
    }
    pop();
  }
}

function mousePressed() {
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  if (!isZoomedIn && hoveredPlanet) {
    selectedPlanet = hoveredPlanet;
    isZoomedIn = true;
    showPlanetInfo(selectedPlanet);
  } else if (isZoomedIn) {
    selectedPlanet = null;
    targetX = 0;
    targetY = -800;
    targetZ = 1400;
    isZoomedIn = false;
    hidePlanetInfo();
  }
}

function showPlanetInfo(planet) {
  const infoDiv = document.getElementById("planet-info");
  const titleElement = document.getElementById("planet-title");
  const descElement = document.getElementById("planet-description");

  titleElement.textContent = `MAD Jam Fest ${2025 - planet.type}`;
  descElement.textContent = "Explora o universo da criatividade digital";

  infoDiv.classList.remove("hidden");
}

function hidePlanetInfo() {
  const infoDiv = document.getElementById("planet-info");
  infoDiv.classList.add("hidden");
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mouseWheel(event) {
  if (!isZoomedIn) {
    targetZ += event.delta * 2;
    targetZ = constrain(targetZ, 600, 2500);
  }
  return false;
}

function toggleSound() {
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    if (spaceSound && !spaceSound.isPlaying()) {
      spaceSound.loop();
    }
    spaceSound.setVolume(0.5);
    soundButton.textContent = "🔊";
  } else {
    spaceSound.setVolume(0);
    soundButton.textContent = "🔇";
  }
}