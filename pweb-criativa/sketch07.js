let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  // fundo semi-transparente para rasto suave
  fill(0, 30);
  rect(0, 0, width, height);

  // gerar partículas enquanto clicas
  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) { // cria várias de cada vez
      let p = {
        x: mouseX,
        y: mouseY,
        vx: random(-2, 2),
        vy: random(-5, -1),  // sobe (negativo no eixo y)
        col: color(random(200,255), random(100,150), 0), // amarelo-alaranjado
        life: 255
      };
      particles.push(p);
    }
  }

  // atualizar e desenhar todas
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    // física simples
    p.vy += 0.05;  // gravidade
    p.vx *= 0.99;  // atrito
    p.vy *= 0.99;

    // atualizar posição
    p.x += p.vx;
    p.y += p.vy;

    // diminuir vida
    p.life -= 3;

    // definir transparência conforme vida
    let c = color(red(p.col), green(p.col), blue(p.col), p.life);
    fill(c);
    circle(p.x, p.y, 10);

    // remover se morrer
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}