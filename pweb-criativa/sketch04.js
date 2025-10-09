let x = [];
let y = [];
let vx = [];
let vy = [];
let c = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < 20; i++) {
    x[i] = random(width);
    y[i] = random(height);
    vx[i] = random(-5, 5);
    vy[i] = random(-5, 5);
    c[i] = color(random(255), random(255), random(255), 100);
  }
}

function draw() {
  fill(0, 20);
  rect(0, 0, width, height);

  for (let i = 0; i < x.length; i++) {
    fill(c[i]);
    circle(x[i], y[i], 50);

    x[i] += vx[i];
    y[i] += vy[i];

    // colisões
    if (x[i] > width - 25 || x[i] < 25) vx[i] = -vx[i];
    if (y[i] > height - 25 || y[i] < 25) vy[i] = -vy[i];
  }
}