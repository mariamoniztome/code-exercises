let proceduralTextures = [];
const TEX_SIZE = 256;

function createProceduralTextures() {
  proceduralTextures = [];

  for (let i = 0; i < 10; i++) {
    let pg = createGraphics(TEX_SIZE, TEX_SIZE);
    pg.colorMode(HSB, 360, 100, 100, 100);
    pg.noStroke();

    pg.push();

    switch (i) {

      // 0 — Riscas coloridas horizontais
      case 0:
        for (let y = 0; y < TEX_SIZE; y += 12) {
          pg.fill((y * 2) % 360, 80, 90);
          pg.rect(0, y, TEX_SIZE, 10);
        }
        break;

      // 1 — Bolas distribuídas em grid
      case 1:
        for (let x = 20; x < TEX_SIZE; x += 40) {
          for (let y = 20; y < TEX_SIZE; y += 40) {
            pg.fill((x + y) % 360, 80, 100);
            pg.circle(x, y, 20);
          }
        }
        break;

      // 2 — Xadrez clássico
      case 2:
        let s = 32;
        for (let x = 0; x < TEX_SIZE; x += s) {
          for (let y = 0; y < TEX_SIZE; y += s) {
            let b = ((x + y) / s) % 2 === 0 ? 100 : 20;
            pg.fill((x * 3 + y * 2) % 360, 80, b);
            pg.rect(x, y, s, s);
          }
        }
        break;

      // 3 — Zebra ondulada
      case 3:
        for (let x = 0; x < TEX_SIZE; x += 8) {
          pg.fill((x * 2) % 360, 90, 100);
          pg.rect(x, (sin(x * 0.1) * 20) + TEX_SIZE/2, 6, TEX_SIZE);
        }
        break;

      // 4 — Espiral estática
      case 4:
        pg.translate(TEX_SIZE / 2, TEX_SIZE / 2);
        for (let a = 0; a < TWO_PI * 4; a += 0.1) {
          let r = a * 10;
          let x = cos(a) * r;
          let y = sin(a) * r;
          pg.fill((a * 60) % 360, 80, 100);
          pg.circle(x, y, 5);
        }
        break;

      // 5 — Degradê arco-íris vertical
      case 5:
        for (let x = 0; x < TEX_SIZE; x++) {
          pg.fill((x * 1.5) % 360, 80, 100);
          pg.rect(x, 0, 1, TEX_SIZE);
        }
        break;

      // 6 — Perlin noise colorido (estático)
      case 6:
        for (let x = 0; x < TEX_SIZE; x++) {
          for (let y = 0; y < TEX_SIZE; y++) {
            let n = noise(x * 0.03, y * 0.03);
            pg.fill((n * 360) % 360, 70, 90);
            pg.rect(x, y, 1, 1);
          }
        }
        break;

      // 7 — Hexágonos (círculos aproximados)
      case 7:
        for (let x = 0; x < TEX_SIZE; x += 30) {
          for (let y = 0; y < TEX_SIZE; y += 26) {
            pg.fill((x + y * 2) % 360, 60, 90);
            pg.circle(x + 15, y + 13, 22);
          }
        }
        break;

      // 8 — Linhas diagonais fixas
      case 8:
        for (let i2 = -TEX_SIZE; i2 < TEX_SIZE * 2; i2 += 20) {
          pg.fill((i2 * 2) % 360, 80, 100);
          pg.rect(i2, 0, 10, TEX_SIZE);
        }
        break;

      // 9 — Pontilhado estelar
      case 9:
        for (let p = 0; p < 140; p++) {
          pg.fill((p * 5) % 360, 80, 100);
          pg.circle(
            random(TEX_SIZE),
            random(TEX_SIZE),
            random(3, 7)
          );
        }
        break;
    }

    pg.pop();
    proceduralTextures.push(pg);
  }
}