// Som
let spaceSound;
let volume = 0.5;
let soundEnabled = true;
let zoomFactor = 900; // valor inicial da câmara

// Estrelas
let stars = [];
const NUM_STARS = 200;
const STAR_FIELD_SIZE = 2000;

// Sol
const SUN_RADIUS = 80;

// Planetas
let planets = [];
const NUM_PLANETS = 10;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  camera(0, -600, 900); // x, y, z

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
    let orbitRadius = 150 + i * 70; // distância do sol
    let planetRadius = random(12, 25); // tamanho do planeta
    let speed = random(0.005, 0.015); // velocidade de órbita
    let c = color(random(80, 255), random(80, 255), random(80, 255)); // cor diferente
    planets.push(new Planet(orbitRadius, planetRadius, speed, c));
  }

  // carregar o som
  spaceSound = loadSound("assets/sounds/space.mp3", () => {
    spaceSound.loop(); // toca em loop
    spaceSound.setVolume(volume);
  });
}

function draw() {
  background(11, 13, 20);
  camera(0, -600, zoomFactor);
  orbitControl(2, 2, 0.2);

  // ajustar volume conforme zoom
  if (spaceSound && soundEnabled) {
    let vol = map(zoomFactor, 400, 2500, 1.0, 0.1, true);
    spaceSound.setVolume(vol);
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
  constructor(orbitRadius, radius, speed, c) {
    this.orbitRadius = orbitRadius;
    this.radius = radius;
    this.speed = speed;
    this.color = c;
    this.angle = random(TWO_PI); // posição inicial
  }

  update() {
    this.angle += this.speed;
  }

  display() {
    // posição 3D do planeta em órbita
    let x = cos(this.angle) * this.orbitRadius;
    let z = sin(this.angle) * this.orbitRadius;

    // desenhar órbita (anel no chão)
    push();
    rotateX(HALF_PI);
    stroke(80, 90, 120, 80);
    noFill();
    circle(0, 0, this.orbitRadius * 2);
    pop();

    // desenhar planeta
    push();
    translate(x, 0, z);
    noStroke();
    ambientMaterial(this.color);
    sphere(this.radius, 32, 24);

    pop();
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mouseWheel(event) {
  zoomFactor += event.delta * 0.5; // roda para zoom in/out
  zoomFactor = constrain(zoomFactor, 400, 2500); // limitar zoom
}