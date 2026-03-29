let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  fill(0, 20);
  rect(0, 0, width, height);

  // criar nova partícula na posição do rato
  if (mouseIsPressed) {
    let p = {
      x: mouseX,
      y: mouseY,
      vx: random(-2, 2),
      vy: random(-2, 2),
      col: color(random(100,255), random(100,255), 255, 150),
      life: 255
    };
    particles.push(p);
  }

  // atualizar e desenhar partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    fill(p.col);
    circle(p.x, p.y, 10);

    p.x += p.vx;
    p.y += p.vy;
    p.life -= 3; // desaparece com o tempo

    if (p.life <= 0) {
      particles.splice(i, 1); // remover partícula morta
    }
  }
}