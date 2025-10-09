let x = [], y = [], vx = [], vy = [], c = [];
let r = 25;
let n = 10; // número de bolas

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < n; i++) {
    x[i] = random(width);
    y[i] = random(height);
    vx[i] = random(-3, 3);
    vy[i] = random(-3, 3);
    c[i] = color(random(255), random(255), random(255), 150);
  }
}

function draw() {
  fill(0, 30);
  rect(0, 0, width, height);

  for (let i = 0; i < n; i++) {
    fill(c[i]);
    circle(x[i], y[i], r * 2);

    x[i] += vx[i];
    y[i] += vy[i];

    // colisão com bordas
    if (x[i] > width - r || x[i] < r) vx[i] *= -1;
    if (y[i] > height - r || y[i] < r) vy[i] *= -1;
  }

  // colisões entre bolas
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let d = dist(x[i], y[i], x[j], y[j]);
      if (d < r * 2) {
        // troca simples de direção
        vx[i] *= -1;
        vy[i] *= -1;
        vx[j] *= -1;
        vy[j] *= -1;
      }
    }
  }
}