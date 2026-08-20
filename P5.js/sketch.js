// Mouse drag effect
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  fill(0, 20);
  rect(0, 0, width, height);
  fill(255);
  noStroke();
  circle(mouseX, mouseY, 20);
}