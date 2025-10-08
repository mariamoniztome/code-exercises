function setup() {
  createCanvas(500, 500);
  color = color(255, 255, 255);
}

let isLit = false;

function draw() {
  background(149, 175, 221)
  ellipse(250, 300, 200, 300)
  fill(0, 0, 0)
  ellipse(250, 300, 200, 300)
  fill(color)
  circle(250, 200, 180) 
  fill(255, 0, 0)
  noStroke()

}
