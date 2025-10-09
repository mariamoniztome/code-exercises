let x = 100;
let y = 100;
let vx = 3;
let vy = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  fill(255);
  circle(x, y, 50);

  // movimento
  x += vx;
  y += vy;

  // colisão com as bordas
  if (x > width - 25 || x < 25) {
    vx = -vx;
  }
  if (y > height - 25 || y < 25) {
    vy = -vy;
  }
}