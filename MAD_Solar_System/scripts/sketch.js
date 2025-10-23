// Som
let spaceSound;
let volume = 0.5;
let soundEnabled = true;
let zoomFactor = 900; // valor inicial da câmara
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
    let orbitRadius = 150 + i * 70; // distância do sol
    let planetRadius = random(20, 40); // tamanho do planeta
    let speed = random(0.01, 0.0015); // velocidade de órbita
    let c = color(random(80, 255), random(80, 255), random(80, 255)); // cor diferente
    planets.push(new Planet(orbitRadius, planetRadius, speed, c, i));
  }

  // carregar o som
  spaceSound = loadSound("assets/sounds/space.mp3", () => {
    spaceSound.loop(); // toca em loop
    spaceSound.setVolume(volume);
  });

  // botão de som
  soundButton = document.getElementById("sound-toggle");
  soundButton.addEventListener("click", toggleSound);
}

function draw() {
  background(11, 13, 20);
  // camera(0, -600, zoomFactor);
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

    // desenhar órbita
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

    switch (this.type) {
      case 0: // noise planet
        ambientMaterial(this.color);
        let deform = noise(frameCount * 0.02, this.angle) * 2;
        sphere(this.radius + deform, 24, 16);
        break;

      case 1: // 🪐 com anéis
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

      case 2: // ✨ partículas orbitais
        ambientMaterial(this.color);
        sphere(this.radius, 24, 16);
        push();
        fill(255);
        for (let i = 0; i < 6; i++) {
          let a = frameCount * 0.05 + i * PI / 3;
          let px = cos(a) * this.radius * 2;
          let pz = sin(a) * this.radius * 2;
          push();
          translate(px, 0, pz);
          sphere(2, 6, 4);
          pop();
        }
        pop();
        break;

      case 3: // 🧊 vidro
        specularMaterial(180);
        shininess(80);
        sphere(this.radius, 32, 24);
        break;

      case 4: // ⚙️ metálico
        specularMaterial(120, 120, 140);
        shininess(200);
        sphere(this.radius, 32, 24);
        break;

      case 5: // 🌕 emissivo
        emissiveMaterial(180, 240, 255);
        sphere(this.radius, 32, 24);
        break;

      case 6: // 💡 neon digital
        let glow = sin(frameCount * 0.1) * 100 + 155;
        emissiveMaterial(glow, 0, 255);
        sphere(this.radius, 32, 24);
        break;

      case 7: // 🌀 cor dinâmica via ruído
        let n = noise(frameCount * 0.01, this.orbitRadius * 0.01) * 255;
        ambientMaterial(n, 180, 255 - n);
        sphere(this.radius, 32, 24);
        break;

      case 8: // 🌚 sombra forte
        ambientMaterial(40, 40, 80);
        shininess(10);
        sphere(this.radius, 32, 24);
        break;

      case 9: // 🪨 fragmentado
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


function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mouseWheel(event) {
  zoomFactor += event.delta * 0.5; // roda para zoom in/out
  zoomFactor = constrain(zoomFactor, 400, 2500); // limitar zoom
}

function toggleSound() {
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    spaceSound.setVolume(0.5);
    soundButton.textContent = "🔊";
  } else {
    spaceSound.setVolume(0);
    soundButton.textContent = "🔇";
  }
}
