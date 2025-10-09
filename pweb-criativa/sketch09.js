let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < 400; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.5, 2),
      radius: random(30, 120),
      hue: random(360)
    });
  }

  colorMode(HSB, 360, 100, 100, 100); // modo de cor baseado em matiz
}

function draw() {
  fill(0, 10);
  rect(0, 0, width, height);

  for (let p of particles) {
    // movimento circular
    p.angle += 0.01 * p.speed;
    p.x += cos(p.angle) * 0.5;
    p.y += sin(p.angle) * 0.5;

    // mudar cor com o tempo
    p.hue = (p.hue + 0.2) % 360;

    // desenhar partícula
    fill(p.hue, 80, 100, 80);
    circle(p.x, p.y, 3);
  }
}