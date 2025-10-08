function setup() {
  createCanvas(400, 400, WEBGL);
}

let isLit = false;

function draw() {
  background(220);
  let c = color(255,192,203);
  fill(c)
  noStroke();
  ambientLight(255, 0, 255);

  orbitControl();
  torus(30, 20);
}