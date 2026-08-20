class Planet {
  constructor(orbitRadius, size, speed, yearData, index) {
    // Parameters
    this.orbitRadius = orbitRadius;
    this.size = size;
    this.speed = speed;
    this.yearData = yearData;
    this.index = index;
    this.angle = random(TWO_PI);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.glowIntensity = 0;
    this.satellites = [];
    this.particles = [];
    this.pulsePhase = random(TWO_PI);
    this.isPaused = false;
  }

  update() {
    // Pause check
    if (this.isPaused) return;

    // Update position and rotation
    this.angle += this.speed;
    this.rotationX += 0.005 + this.index * 0.001;
    this.rotationY += 0.008 + this.index * 0.0005;
    this.rotationZ += 0.003 + this.index * 0.0003;
    this.pulsePhase += 0.05;

    // Update speed of satellites and particles
    for (let s of this.satellites) {
      s.angle += s.speed;
    }

    // Update particles
    for (let p of this.particles) {
      if (p.speed) p.angle += p.speed;
      if (p.phase !== undefined) p.phase += 0.05;
      if (p.twinkle !== undefined) p.twinkle += 0.1;
    }
  }

  // Draw the orbit path
  drawOrbit() {
    push();
    noFill();
    stroke(
      this.yearData.color.r,
      this.yearData.color.g,
      this.yearData.color.b,
      40
    );
    strokeWeight(3);

    rotateX(PI / 2);
    circle(0, 0, this.orbitRadius * 2);

    pop();
  }

  // Draw the planet
  display() {
    push();

    let x = cos(this.angle) * this.orbitRadius;
    let z = sin(this.angle) * this.orbitRadius;

    translate(x, 0, z);

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
      pop();
    }


    rotateX(this.rotationX);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);

    push();

    ambientMaterial(255);

    // Apply procedural texture if available
    if (proceduralTextures.length > 0) {
      texture(proceduralTextures[this.index % proceduralTextures.length]);
    }

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

    pop();
  }

  drawPlanetShape() {
    const s = this.size;
    push();
    noStroke();
    box(s);
    pop();
  }
}