let x, y, vx, vy;

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = random(width);
  y = random(height);
  vx = random(-5, 5);
  vy = random(-5, 5);
  background(0);
  noStroke();
}

function draw() {
  fill(255, 50);
  circle(x, y, 50);

  x += vx;
  y += vy;

  if (x > width - 25 || x < 25) vx = -vx;
  if (y > height - 25 || y < 25) vy = -vy;
}