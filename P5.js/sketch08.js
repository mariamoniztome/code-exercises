let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  fill(0, 30);
  rect(0, 0, width, height);

  // gerar novas partículas aleatórias
  if (frameCount % 3 === 0) { // cria uma a cada 3 frames
    let p = {
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      life: 255,
      col: color(random(100,255), random(150,255), 255, 150)
    };
    particles.push(p);
  }

  // atualizar e desenhar todas
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    // calcular distância até ao rato
    let d = dist(p.x, p.y, mouseX, mouseY);

    // se estiver perto do rato, puxar para o rato
    if (d < 200) {
      let dx = mouseX - p.x;
      let dy = mouseY - p.y;
      p.vx += dx * 0.001; // 0.001 = força de atração
      p.vy += dy * 0.001;
    }

    // atualizar posição
    p.x += p.vx;
    p.y += p.vy;

    // reduzir vida
    p.life -= 2;

    // desenhar com fade
    fill(red(p.col), green(p.col), blue(p.col), p.life);
    circle(p.x, p.y, 8);

    // remover quando morre
    if (p.life <= 0) particles.splice(i, 1);
  }
}