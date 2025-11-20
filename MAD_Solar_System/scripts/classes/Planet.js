let lastImageChange = 0;
const IMAGE_CHANGE_INTERVAL = 1000;
let currentImageIndex = 0;

class Planet {
  constructor(orbitRadius, size, speed, yearData, index) {
    this.orbitRadius = orbitRadius;
    this.size = size;
    this.speed = speed;
    this.yearData = yearData;
    this.index = index;
    this.angle = random(TWO_PI);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.hoverScale = 1.0;
    this.glowIntensity = 0;
    this.satellites = [];
    this.particles = [];
    this.pulsePhase = random(TWO_PI);
    this.initUniqueFeatures();
  }

  initUniqueFeatures() {
    if (this.index === 1) {
      for (let i = 0; i < 3; i++)
        this.satellites.push({
          angle: random(TWO_PI),
          speed: random(0.02, 0.05),
          distance: this.size * (1.5 + i * 0.3),
          size: 5,
        });
    }
    if (this.index === 3) {
      for (let i = 0; i < 5; i++)
        this.particles.push({
          angle: random(TWO_PI),
          speed: random(0.01, 0.03),
          distance: this.size * 1.4,
          phase: random(TWO_PI),
        });
    }
    if (this.index === 5) {
      for (let i = 0; i < 8; i++)
        this.particles.push({
          angle: (TWO_PI / 8) * i,
          speed: 0.02,
          distance: this.size * 1.3,
          twinkle: random(TWO_PI),
        });
    }
    if (this.index === 8) {
      for (let i = 0; i < 6; i++)
        this.particles.push({
          angle: (TWO_PI / 6) * i,
          phase: random(TWO_PI),
          length: this.size * 0.8,
        });
    }
  }

  update() {
    if (!isPaused) {
      this.angle += this.speed;
      this.rotationX += 0.005;
      this.rotationY += 0.008;
      this.rotationZ += 0.003;
      this.pulsePhase += 0.05;
      for (let s of this.satellites) s.angle += s.speed;
      for (let p of this.particles) {
        if (p.speed) p.angle += p.speed;
        if (p.phase !== undefined) p.phase += 0.05;
        if (p.twinkle !== undefined) p.twinkle += 0.1;
      }
    }
    if (this === hoveredPlanet) {
      this.hoverScale = lerp(this.hoverScale, 1.2, 0.15);
      this.glowIntensity = lerp(this.glowIntensity, 1, 0.15);
    } else {
      this.hoverScale = lerp(this.hoverScale, 1.0, 0.15);
      this.glowIntensity = lerp(this.glowIntensity, 0, 0.15);
    }
  }

  drawOrbit() {
    push();
    noFill();
    stroke(
      this.yearData.color.r,
      this.yearData.color.g,
      this.yearData.color.b,
      80
    );
    strokeWeight(3);
    rotateX(PI / 2);
    circle(0, 0, this.orbitRadius * 2);
    pop();
  }

  display() {
    push();
    let x = cos(this.angle) * this.orbitRadius;
    let z = sin(this.angle) * this.orbitRadius;
    translate(x, 0, z);
    scale(this.hoverScale);

    // (opcional) animação temporal global
    const now = millis();
    if (now - lastImageChange > IMAGE_CHANGE_INTERVAL) {
      currentImageIndex = (currentImageIndex + 1) % 8;
      lastImageChange = now;
    }

    // Glow geométrico quando hover
    if (this.glowIntensity > 0.1) {
      push();
      noFill();
      stroke(
        this.yearData.color.r,
        this.yearData.color.g,
        this.yearData.color.b,
        this.glowIntensity * 200
      );
      strokeWeight(6);
      box(this.size * 1.4);
      pop();

      push();
      noFill();
      stroke(
        this.yearData.color.r,
        this.yearData.color.g,
        this.yearData.color.b,
        this.glowIntensity * 100
      );
      strokeWeight(3);
      box(this.size * 1.7);
      pop();
    }

    this.drawAnimBefore();
    rotateX(this.rotationX);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);

    // -------- MATERIAL REALISTA (luz do Sol) --------
    push();

    // cor especular branca (reflexo do sol)
    specularMaterial(255);
    shininess(80);

    // textura do planeta (GIFs carregados no preload)
    texture(planetTextures[this.index % 8]);

    // um bocadinho de emissão quando hover
    if (this.glowIntensity > 0.1) {
      emissiveMaterial(
        this.yearData.color.r * this.glowIntensity * 0.3,
        this.yearData.color.g * this.glowIntensity * 0.3,
        this.yearData.color.b * this.glowIntensity * 0.3
      );
    }

    box(this.size);
    pop();

    rotateZ(-this.rotationZ);
    rotateY(-this.rotationY);
    rotateX(-this.rotationX);
    this.drawAnimAfter();
    pop();
  }

  drawAnimBefore() {
    if (this.index === 2) {
      push();
      noStroke();
      fill(60, 50, 80, 30);
      sphere(this.size * 1.3);
      fill(60, 50, 80, 20);
      sphere(this.size * 1.5);
      pop();
    }
    if (this.index === 4) {
      push();
      noFill();
      stroke(100, 255, 150, 100);
      strokeWeight(2);
      translate(this.size * 0.15, this.size * 0.15, this.size * 0.15);
      box(this.size);
      pop();
    }
    if (this.index === 6) {
      push();
      noFill();
      let s = this.size + sin(this.pulsePhase) * 10;
      stroke(180, 100, 200, 150);
      strokeWeight(2);
      box(s);
      pop();
    }
  }

  drawAnimAfter() {
    if (this.index === 0) {
      push();
      for (let i = 0; i < 4; i++) {
        let a = this.pulsePhase + (TWO_PI / 4) * i;
        let d = this.size * 0.7;
        let sx = cos(a) * d;
        let sy = sin(a) * d;
        noStroke();
        fill(255, 255, 200, 200);
        translate(sx, sy, 0);
        sphere(3);
        translate(-sx, -sy, 0);
      }
      pop();
    }
    if (this.index === 1) {
      push();
      for (let s of this.satellites) {
        let sx = cos(s.angle) * s.distance;
        let sz = sin(s.angle) * s.distance;
        noStroke();
        fill(150, 160, 180);
        translate(sx, 0, sz);
        sphere(s.size);
        translate(-sx, 0, -sz);
      }
      pop();
    }
    if (this.index === 3) {
      push();
      for (let p of this.particles) {
        let px = cos(p.angle) * p.distance;
        let py = sin(p.phase) * 15;
        let pz = sin(p.angle) * p.distance;
        noStroke();
        fill(200, 170, 100, 200);
        translate(px, py, pz);
        sphere(4);
        translate(-px, -py, -pz);
      }
      pop();
    }
    if (this.index === 5) {
      push();
      for (let s of this.particles) {
        let sx = cos(s.angle) * s.distance;
        let sz = sin(s.angle) * s.distance;
        let b = (sin(s.twinkle) + 1) * 0.5;
        noStroke();
        fill(255, 255, 255, b * 255);
        translate(sx, 0, sz);
        sphere(3);
        translate(-sx, 0, -sz);
      }
      pop();
    }
    if (this.index === 7) {
      push();
      stroke(100, 120, 140, 150);
      strokeWeight(1);
      noFill();
      let g = this.size * 1.2;
      let sp = g / 4;
      for (let i = -2; i <= 2; i++) {
        line(-g / 2, i * sp, 0, g / 2, i * sp, 0);
        line(i * sp, -g / 2, 0, i * sp, g / 2, 0);
      }
      pop();
    }
    if (this.index === 8) {
      push();
      for (let t of this.particles) {
        stroke(255, 80, 150, 200);
        strokeWeight(3);
        noFill();
        beginShape();
        for (let j = 0; j < 5; j++) {
          let f = j / 5;
          let tx = cos(t.angle) * t.length * f;
          let ty = sin(t.phase + f * PI) * 15;
          let tz = sin(t.angle) * t.length * f;
          vertex(tx, ty, tz);
        }
        endShape();
      }
      pop();
    }
    if (this.index === 9) {
      push();
      noFill();
      let p = (sin(this.pulsePhase) + 1) * 0.5;
      stroke(0, 200, 255, p * 200);
      strokeWeight(2);
      for (let i = 0; i < 3; i++) {
        let o = i * 15;
        translate(0, o, 0);
        box(this.size * 1.1);
        translate(0, -o, 0);
      }
      pop();
    }
  }
}