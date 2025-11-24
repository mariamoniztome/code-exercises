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

    this.isPaused = false;

    this.initUniqueFeatures();
  }

  initUniqueFeatures() {
    if (this.index === 1) {
      for (let i = 0; i < 3; i++) {
        this.satellites.push({
          angle: random(TWO_PI),
          speed: random(0.02, 0.05),
          distance: this.size * (1.5 + i * 0.3),
          size: 5,
        });
      }
    }

    if (this.index === 3) {
      for (let i = 0; i < 5; i++) {
        this.particles.push({
          angle: random(TWO_PI),
          speed: random(0.01, 0.03),
          distance: this.size * 1.4,
          phase: random(TWO_PI),
        });
      }
    }

    if (this.index === 5) {
      for (let i = 0; i < 8; i++) {
        this.particles.push({
          angle: (TWO_PI / 8) * i,
          speed: 0.02,
          distance: this.size * 1.3,
          twinkle: random(TWO_PI),
        });
      }
    }

    if (this.index === 8) {
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          angle: (TWO_PI / 6) * i,
          phase: random(TWO_PI),
          length: this.size * 0.8,
        });
      }
    }
  }

  update() {
    if (this.isPaused) return;

    this.angle += this.speed;

    this.rotationX += 0.005 + this.index * 0.001;
    this.rotationY += 0.008 + this.index * 0.0005;
    this.rotationZ += 0.003 + this.index * 0.0003;

    this.pulsePhase += 0.05;

    for (let s of this.satellites) {
      s.angle += s.speed;
    }

    for (let p of this.particles) {
      if (p.speed) p.angle += p.speed;
      if (p.phase !== undefined) p.phase += 0.05;
      if (p.twinkle !== undefined) p.twinkle += 0.1;
    }
  }

  drawOrbit() {
    push();
    noFill();
    stroke(this.yearData.color.r, this.yearData.color.g, this.yearData.color.b, 40);
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

    // Glow outer rings
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
      this.drawShapeOutline(1.4);
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
      this.drawShapeOutline(1.7);
      pop();
    }

    this.drawAnimBefore();

    rotateX(this.rotationX);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);

   push();

// MATERIAL CORRETO PARA TEXTURA (SEM LINHAS)
ambientMaterial(255);

// aplica textura
if (proceduralTextures.length > 0) {
  texture(proceduralTextures[this.index % proceduralTextures.length]);
}

// brilho suave opcional
if (this.glowIntensity > 0.1) {
  emissiveMaterial(
    this.yearData.color.r * this.glowIntensity * 0.15,
    this.yearData.color.g * this.glowIntensity * 0.15,
    this.yearData.color.b * this.glowIntensity * 0.15
  );
}

this.drawPlanetShape();
pop();


    rotateZ(-this.rotationZ);
    rotateY(-this.rotationY);
    rotateX(-this.rotationX);

    this.drawAnimAfter();
    pop();
  }

  drawPlanetShape() {
    const s = this.size;

    switch (this.index) {
      case 0:
        push();
        rotateX(sin(this.pulsePhase) * 0.3);
        box(s);
        pop();
        break;

      case 1:
        sphere((s / 2) * (1 + sin(this.pulsePhase * 2) * 0.1));
        break;

      case 2:
        push();
        cone(s / 2, s);
        rotateX(PI);
        cone(s / 2, s);
        pop();
        break;

      case 3:
        for (let i = 0; i < 3; i++) {
          push();
          translate(0, (i - 1) * s * 0.3, 0);
          rotateY((i * PI) / 3);
          cylinder(s / 2 - i * 5, s / 3);
          pop();
        }
        break;

      case 4:
        torus(s / 2, s / 5);
        push();
        rotateX(PI / 2);
        torus(s / 2.2, s / 6);
        pop();
        break;

      case 5:
        push();
        for (let i = 0; i < 4; i++) {
          rotateY(PI / 2);
          cone(s * 0.7, s / 3);
        }
        pop();
        break;

      case 6:
        for (let i = 0; i < 8; i++) {
          push();
          translate(0, (i - 4) * (s / 8), 0);
          rotateY(i * PI / 4 + this.pulsePhase);
          cone(s / 3 - i * 2, s / 4);
          pop();
        }
        break;

      case 7:
        sphere(s / 3);
        for (let i = 0; i < 6; i++) {
          push();
          translate(cos((TWO_PI / 6) * i) * (s / 2), 0, sin((TWO_PI / 6) * i) * (s / 2));
          sphere(s / 5);
          pop();
        }
        break;

      case 8:
        for (let i = 0; i < 12; i++) {
          push();
          let a = (i / 12) * TWO_PI * 3;
          translate(cos(a) * (s / 4), (i / 12 - 0.5) * s * 1.5, sin(a) * (s / 4));
          sphere(s / 8);
          pop();
        }
        cylinder(s / 6, s * 1.5);
        break;

      case 9:
        torus(s / 2.5, s / 8);
        push();
        rotateX(PI / 3);
        torus(s / 3, s / 10);
        pop();
        push();
        rotateY(PI / 3);
        torus(s / 3.5, s / 12);
        pop();
        break;

      default:
        box(s);
    }
  }

  drawShapeOutline(scale) {
    const s = this.size * scale;

    switch (this.index) {
      case 0: box(s); break;
      case 1: sphere(s / 2); break;
      case 2: cone(s / 2, s); break;
      case 3: cylinder(s / 2, s); break;
      case 4: torus(s / 2, s / 5); break;
      case 5: box(s, s / 2, s); break;
      case 6: cone(s / 2, s * 1.5); break;
      case 7: sphere(s / 3); break;
      case 8: cylinder(s / 3, s * 1.2); break;
      case 9: torus(s / 2.5, s / 8); break;
      default: box(s);
    }
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
      stroke(180, 100, 200, 150);
      let s = this.size + sin(this.pulsePhase) * 10;
      box(s);
      pop();
    }
  }

  drawAnimAfter() {
    this.draw2DEffects();

    if (this.index === 1) {
      push();
      for (let s of this.satellites) {
        translate(cos(s.angle) * s.distance, 0, sin(s.angle) * s.distance);
        sphere(s.size);
        translate(-cos(s.angle) * s.distance, 0, -sin(s.angle) * s.distance);
      }
      pop();
    }

    if (this.index === 3) {
      push();
      for (let p of this.particles) {
        translate(
          cos(p.angle) * p.distance,
          sin(p.phase) * 15,
          sin(p.angle) * p.distance
        );
        sphere(4);
        translate(
          -cos(p.angle) * p.distance,
          -sin(p.phase) * 15,
          -sin(p.angle) * p.distance
        );
      }
      pop();
    }

    if (this.index === 5) {
      push();
      for (let p of this.particles) {
        let b = (sin(p.twinkle) + 1) * 0.5;
        fill(255, 255, 255, b * 255);
        translate(cos(p.angle) * p.distance, 0, sin(p.angle) * p.distance);
        sphere(3);
        translate(-cos(p.angle) * p.distance, 0, -sin(p.angle) * p.distance);
      }
      pop();
    }
  }

  draw2DEffects() {
    push();

    switch (this.index) {
      case 0:
        stroke(255, 255, 0, 150);
        for (let i = 0; i < 8; i++) {
          let a = this.pulsePhase + (TWO_PI / 8) * i;
          line(0, 0, 0, cos(a) * this.size * 0.9, sin(a) * this.size * 0.9, 0);
        }
        break;

      case 1:
        noFill();
        stroke(255, 200, 100, 100);
        let p = sin(this.pulsePhase) * 10;
        circle(0, 0, this.size * 1.2 + p);
        circle(0, 0, this.size * 1.5 + p * 1.5);
        break;

      case 4:
        noStroke();
        for (let i = 0; i < 12; i++) {
          let a = (TWO_PI / 12) * i;
          let b = (sin(this.pulsePhase + i * 0.5) + 1) * 0.5;
          fill(255, 255, 255, b * 200);
          translate(cos(a) * this.size * 1.1, sin(a) * this.size * 1.1, 0);
          sphere(4);
          translate(-cos(a) * this.size * 1.1, -sin(a) * this.size * 1.1, 0);
        }
        break;
    }

    pop();
  }
}