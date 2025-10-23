// Textura dos planetas
let planetTexture;

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

// Câmara
let camX = 0,
  camY = -800,
  camZ = 2000;   
let targetX = 0,
  targetY = -800,
  targetZ = 2000;


function preload() {
  spaceSound = loadSound("assets/sounds/space.mp3");
  planetTexture = loadImage("assets/textures/tv.gif");
}

function setup() {
  frameRate(60);
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  camera(0, -800, 2000);

  // gerar estrelas
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
  }

  let sizes = [30, 45, 32, 60, 35, 50, 33, 65, 48, 80];

  // criar planetas
  for (let i = 0; i < NUM_PLANETS; i++) {
    let orbitRadius = 200 + i * 100;
  let planetRadius = sizes[i]; // tamanhos fixos
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

  if (spaceSound && spaceSound.isPlaying() && soundEnabled) {
    if (isZoomedIn) {
      spaceSound.setVolume(0.1); // volume mais baixo no zoom
    } else {
      let distFromCenter = dist(camX, camY, camZ, 0, 0, 0);
      let vol = map(distFromCenter, 400, 2800, 0.8, 0.05, true);
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

  // campo de estrelas - ESCONDER no zoom
  if (!isZoomedIn) {
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
  }

  // luzes
  ambientLight(60);
  directionalLight(255, 255, 255, 0.6, -1, -0.2);

  // sol - ESCONDER no zoom
  if (!isZoomedIn) {
    push();
    noStroke();
    emissiveMaterial(255, 210, 80);
    sphere(SUN_RADIUS, 48, 36);
    pop();
  }

  // planetas - mostrar APENAS o selecionado no zoom
  for (let p of planets) {
    p.update();
    
    if (isZoomedIn) {
      // No zoom: renderizar APENAS o planeta selecionado
      if (p === selectedPlanet) {
        p.display();
      }
    } else {
      // Fora do zoom: mostrar todos
      p.display();
    }
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
      case 0: // lava
        let lavaGlow = sin(frameCount * 0.08) * 100 + 155;
        emissiveMaterial(255, lavaGlow * 0.3, 0);
        let deform = noise(frameCount * 0.02, this.angle) * 3;
        sphere(this.radius + deform, 24, 16);
        // Crateras brilhantes
        for (let i = 0; i < 8; i++) {
          let a = (i * TWO_PI) / 8 + frameCount * 0.01;
          let px = cos(a) * this.radius * 0.7;
          let pz = sin(a) * this.radius * 0.7;
          push();
          translate(px, 0, pz);
          emissiveMaterial(255, 100, 0);
          sphere(this.radius * 0.15, 8, 6);
          pop();
        }
        break;

      case 1: // saturno
        // Planeta base iridescente
        let hue1 = (frameCount * 0.5 + this.angle * 50) % 360;
        let c1 = color(`hsl(${hue1}, 70%, 60%)`);
        ambientMaterial(red(c1), green(c1), blue(c1));
        specularMaterial(255);
        shininess(100);
        sphere(this.radius, 32, 24);
        // Anéis multicoloridos
        push();
        rotateX(HALF_PI);
        noFill();
        strokeWeight(2);
        for (let i = 0; i < 12; i++) {
          let ringHue = (hue1 + i * 30) % 360;
          let ringColor = color(`hsl(${ringHue}, 80%, 60%)`);
          stroke(red(ringColor), green(ringColor), blue(ringColor), 200);
          circle(0, 0, this.radius * (2.5 + i * 0.4));
        }
        pop();
        break;

      case 2: // luas arco ires
        // Planeta holográfico
        let shimmer = sin(frameCount * 0.05) * 50 + 205;
        specularMaterial(shimmer, 180, 255);
        shininess(150);
        sphere(this.radius, 24, 16);
        // Luas orbitantes coloridas
        push();
        for (let i = 0; i < 8; i++) {
          let a = frameCount * 0.05 + (i * PI) / 4;
          let px = cos(a) * this.radius * 2;
          let pz = sin(a) * this.radius * 2;
          let moonHue = (i * 45 + frameCount) % 360;
          let moonC = color(`hsl(${moonHue}, 90%, 65%)`);
          push();
          translate(px, 0, pz);
          emissiveMaterial(red(moonC), green(moonC), blue(moonC));
          sphere(this.radius * 0.12, 8, 6);
          pop();
        }
        pop();
        break;

      case 3: // cristal
        let crystal = sin(frameCount * 0.1) * 80 + 175;
        specularMaterial(crystal, 255, 255);
        shininess(200);
        sphere(this.radius, 32, 24);
        // Cristais flutuantes
        for (let i = 0; i < 6; i++) {
          let angle = (i * TWO_PI) / 6 + frameCount * 0.03;
          let dist = this.radius * 1.3;
          push();
          translate(cos(angle) * dist, sin(frameCount * 0.02 + i) * 10, sin(angle) * dist);
          rotateY(frameCount * 0.05);
          specularMaterial(200, 240, 255);
          shininess(250);
          box(this.radius * 0.2);
          pop();
        }
        break;

      case 4: // ocean
        // Água profunda com ondas
        let wave = noise(frameCount * 0.01, this.angle) * 50;
        specularMaterial(30, 120 + wave, 200 + wave);
        shininess(180);
        sphere(this.radius, 32, 24);
        // Espuma brilhante
        push();
        noFill();
        strokeWeight(1.5);
        for (let i = 0; i < 5; i++) {
          let waveSize = this.radius * (1.05 + i * 0.08);
          let alpha = 150 - i * 30;
          stroke(100, 200, 255, alpha);
          rotateY(frameCount * 0.02);
          circle(0, 0, waveSize * 2);
        }
        pop();
        break;

     case 5: // ⚡ PLANETA ELÉTRICO - Tempestade de raios com textura
  push();
  // aplicar textura ao planeta
  texture(planetTexture);
  sphere(this.radius, 48, 36);
  pop();

  // efeitos elétricos por cima
  push();
  stroke(255, 255, 100, 200);
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    let boltAngle = random(TWO_PI);
    let boltDist = this.radius * 1.2;
    let x1 = cos(boltAngle) * this.radius * 0.9;
    let z1 = sin(boltAngle) * this.radius * 0.9;
    let x2 = cos(boltAngle) * boltDist;
    let z2 = sin(boltAngle) * boltDist;
    if (frameCount % (10 + i) < 2) {
      line(x1, 0, z1, x2, random(-10, 10), z2);
    }
  }
  pop();
  break;
      case 6: // nebulosa
        // Camadas de gás colorido
        for (let layer = 0; layer < 4; layer++) {
          let layerGlow = sin(frameCount * 0.1 + layer) * 80 + 175;
          let layerHue = (frameCount + layer * 90) % 360;
          let gasColor = color(`hsl(${layerHue}, 100%, 60%)`);
          push();
          emissiveMaterial(red(gasColor) * (layerGlow/255), green(gasColor) * (layerGlow/255), blue(gasColor) * (layerGlow/255));
          sphere(this.radius * (1 - layer * 0.15), 24, 16);
          pop();
        }
        break;

      case 7: // cores
        // Superfície mutante
        push();
        rotateY(frameCount * 0.02);
        for (let lat = 0; lat < 8; lat++) {
          for (let lon = 0; lon < 12; lon++) {
            let n = noise(frameCount * 0.02, lat * 0.5, lon * 0.5);
            let hue = (n * 360 + frameCount) % 360;
            let patchColor = color(`hsl(${hue}, 90%, 60%)`);
            let theta = map(lat, 0, 8, 0, PI);
            let phi = map(lon, 0, 12, 0, TWO_PI);
            let x = this.radius * sin(theta) * cos(phi);
            let y = this.radius * cos(theta);
            let z = this.radius * sin(theta) * sin(phi);
            push();
            translate(x, y, z);
            ambientMaterial(red(patchColor), green(patchColor), blue(patchColor));
            sphere(this.radius * 0.15, 8, 6);
            pop();
          }
        }
        pop();
        break;

      case 8: // sombrio
        // Base escura misteriosa
        ambientMaterial(20, 15, 40);
        shininess(5);
        sphere(this.radius, 32, 24);
        // Fissuras brilhantes
        push();
        stroke(100, 50, 150, 150);
        strokeWeight(2);
        noFill();
        for (let i = 0; i < 15; i++) {
          let crackAngle = random(TWO_PI);
          let crackDist = random(this.radius * 0.8, this.radius);
          push();
          rotateY(crackAngle);
          rotateZ(random(-0.3, 0.3));
          beginShape();
          for (let t = 0; t < 5; t++) {
            let x = random(-this.radius * 0.3, this.radius * 0.3);
            let y = map(t, 0, 4, -crackDist, crackDist);
            vertex(x, y);
          }
          endShape();
          pop();
        }
        pop();
        break;

      case 9: // fragmentado
        // Núcleo central brilhante
        push();
        emissiveMaterial(255, 200, 100);
        sphere(this.radius * 0.4, 16, 12);
        pop();
        // Fragmentos coloridos orbitantes
        ambientMaterial(this.color);
        for (let i = 0; i < 8; i++) {
          let angle = (i * TWO_PI) / 8 + frameCount * 0.02;
          let distance = this.radius * 0.7;
          let dx = cos(angle) * distance;
          let dy = sin(frameCount * 0.03 + i) * this.radius * 0.3;
          let dz = sin(angle) * distance;
          let fragHue = (i * 45 + frameCount * 0.5) % 360;
          let fragColor = color(`hsl(${fragHue}, 75%, 55%)`);
          push();
          translate(dx, dy, dz);
          rotateX(frameCount * 0.03);
          rotateZ(frameCount * 0.02);
          ambientMaterial(red(fragColor), green(fragColor), blue(fragColor));
          box(this.radius * 0.3);
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
    targetZ = 2000;
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
    targetZ = constrain(targetZ, 600, 5000);
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