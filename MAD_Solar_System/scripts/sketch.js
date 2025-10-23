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
let selectedPlanet = null;
let camX = 0, camY = -800, camZ = 1400; // posição da câmara
let targetX = 0, targetY = -800, targetZ = 1400; // alvo para zoom suave

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

  // câmara segue o planeta quando está em zoom
  if (isZoomedIn && selectedPlanet) {
    // posição do planeta em tempo real
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    
    // câmara move-se com o planeta
    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.radius * 1 + 100;
  }

  // smooth
  camX = lerp(camX, targetX, 0.05);
  camY = lerp(camY, targetY, 0.05);
  camZ = lerp(camZ, targetZ, 0.05);
  
  // câmara sempre olha para o planeta
  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    camera(camX, camY, camZ, px, 0, pz, 0, 1, 0);
  } else {
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  }

  orbitControl(2, 2, 0.2);
  

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

  // mostrar título quando planeta selecionado
  if (selectedPlanet) {
    resetMatrix(); // volta à 2D
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    text(`🌌 Festival MAD ${2025 - selectedPlanet.type}`, width / 2, height / 2 - 40);
    textSize(18);
    text("Explora o universo da criatividade digital", width / 2, height / 2 + 10);
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

let isZoomedIn = false;

function mousePressed() {
  if (!isZoomedIn) {
    // ZOOM IN - aproximar de um planeta
    selectedPlanet = random(planets);
    isZoomedIn = true;
  } else {
    // ZOOM OUT - voltar a ver tudo
    selectedPlanet = null;
    targetX = 0;
    targetY = -800;
    targetZ = 1400;
    isZoomedIn = false;
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
