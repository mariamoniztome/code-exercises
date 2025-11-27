let proceduralTextures = [];
const TEX_SIZE = 200;

// Create procedural textures for planets
function createProceduralTextures() {
  proceduralTextures = [];

  // Initialize procedural textures
  for (let i = 0; i < 10; i++) {
    let pg = createGraphics(TEX_SIZE, TEX_SIZE);
    pg.colorMode(RGB);
    proceduralTextures.push(pg);
  }
}

// Update procedural textures each frame
function updateProceduralTextures(i) {
  let time = millis() / 1000;

  switch (i) {
    // Circular waves pulsing outward
    case 0:
      {
        let pg = proceduralTextures[0];
        pg.push();
        pg.background(255, 140, 0);
        pg.noFill();
        pg.strokeWeight(3);

        for (let r = 10; r < TEX_SIZE; r += 12) {
          let col = r % 24 < 12 ? color(0, 206, 209) : color(255, 215, 0);
          pg.stroke(col);
          let offset = sin(time + r * 0.01) * 5;
          pg.ellipse(TEX_SIZE / 2, TEX_SIZE / 2, r + offset, r + offset);
        }

        pg.pop();
      }
      break;
    // Isometric triangles rotating
    case 1:
      {
        let pg = proceduralTextures[1];
        pg.push();
        pg.background(255, 69, 0);
        pg.translate(TEX_SIZE / 2, TEX_SIZE / 2);
        pg.rotate(time * 0.3);
        pg.noStroke();

        pg.fill(255, 215, 0);
        pg.quad(-80, -40, 0, -80, 80, -40, 0, 0);

        pg.fill(0, 206, 209);
        pg.quad(0, 0, 80, -40, 80, 60, 0, 100);

        pg.fill(255, 20, 147);
        pg.quad(-80, -40, 0, 0, 0, 100, -80, 60);

        pg.pop();
      }
      break;
    // Colorful sinusoidal waves
    case 2:
      {
        let pg = proceduralTextures[2];
        pg.push();
        pg.background(138, 43, 226);
        pg.noFill();
        pg.strokeWeight(4);

        for (let k = 0; k < 12; k++) {
          pg.stroke(k % 2 === 0 ? color(255, 215, 0) : color(255, 69, 0));
          pg.beginShape();
          for (let x = 0; x <= TEX_SIZE; x += 5) {
            let y =
              TEX_SIZE / 2 + sin(x * 0.02 + time + k * 0.5) * (15 + k * 3);
            pg.vertex(x, y);
          }
          pg.endShape();
        }

        pg.pop();
      }
      break;
    // Pulsating circle grid
    case 3:
      {
        let pg = proceduralTextures[3];
        pg.push();
        pg.background(0, 206, 209);
        pg.noStroke();

        for (let x = 20; x < TEX_SIZE; x += 40) {
          for (let y = 20; y < TEX_SIZE; y += 40) {
            let size = 12 + sin(time * 2 + x * 0.1 + y * 0.1) * 8;
            let col =
              (x + y) % 80 < 40 ? color(255, 69, 0) : color(255, 215, 0);
            pg.fill(col);
            pg.circle(x, y, size);
          }
        }

        pg.pop();
      }
      break;
    // Concentric animated lines
    case 4:
      {
        let pg = proceduralTextures[4];
        pg.push();
        pg.background(255, 215, 0);
        pg.strokeWeight(4);
        pg.translate(TEX_SIZE / 2, TEX_SIZE / 2);

        for (let a = 0; a < TWO_PI; a += PI / 12) {
          let len = 80 + sin(time * 2 + a * 3) * 15;
          let col =
            a % (PI / 6) < PI / 12 ? color(255, 69, 0) : color(138, 43, 226);
          pg.stroke(col);
          pg.line(0, 0, cos(a) * len, sin(a) * len);
        }

        pg.pop();
      }
      break;
    // Multicolor animated spiral
    case 5:
      {
        let pg = proceduralTextures[5];
        pg.push();
        pg.background(255, 20, 147);
        pg.noFill();
        pg.strokeWeight(5);
        pg.translate(TEX_SIZE / 2, TEX_SIZE / 2);
        pg.rotate(time * 0.5);

        pg.beginShape();
        for (let a = 0; a < TWO_PI * 6; a += 0.1) {
          let r = a * 8 + sin(time * 2 + a) * 10;
          let col =
            a % (TWO_PI / 3) < TWO_PI / 6
              ? color(255, 215, 0)
              : color(0, 206, 209);
          pg.stroke(col);
          pg.vertex(cos(a) * r, sin(a) * r);
        }
        pg.endShape();

        pg.pop();
      }
      break;
    // Vibrant animated checkerboard
    case 6:
      {
        let pg = proceduralTextures[6];
        pg.push();
        pg.background(255);
        let grid = 40;

        let cols = [
          color(255, 69, 0),
          color(255, 215, 0),
          color(0, 206, 209),
          color(138, 43, 226),
        ];

        for (let x = 0; x < TEX_SIZE; x += grid) {
          for (let y = 0; y < TEX_SIZE; y += grid) {
            let index = floor((x / grid + y / grid + time * 2) % 4);
            pg.fill(cols[index]);
            pg.rect(x, y, grid, grid);
          }
        }

        pg.pop();
      }
      break;
    // Organic animated circles
    case 7:
      {
        let pg = proceduralTextures[7];
        pg.push();
        pg.background(255, 215, 0, 80);
        pg.noStroke();

        for (let k = 0; k < 30; k++) {
          let x = TEX_SIZE / 2 + sin(time + k) * 90;
          let y = TEX_SIZE / 2 + cos(time * 0.8 + k) * 90;
          let size = 40 + sin(time * 2 + k * 0.5) * 25;

          let cols = [
            color(255, 69, 0, 150),
            color(0, 206, 209, 150),
            color(138, 43, 226, 150),
          ];

          pg.fill(cols[k % 3]);
          pg.circle(x, y, size);
        }

        pg.pop();
      }
      break;
    // Impossible Penrose Triangle
    case 8:
      {
        let pg = proceduralTextures[8];
        pg.push();
        pg.background(255, 182, 193);
        pg.translate(TEX_SIZE / 2, TEX_SIZE / 2);
        pg.rotate(time * 0.4);
        pg.noStroke();

        let tri = 100;

        pg.fill(147, 112, 219);
        pg.quad(-tri, 0, 0, -tri * 0.6, tri * 0.3, -tri * 0.4, 0, tri * 0.3);

        pg.fill(216, 191, 216);
        pg.quad(tri, 0, tri * 0.3, -tri * 0.4, 0, -tri * 0.6, 0, tri * 0.3);

        pg.fill(75, 0, 130);
        pg.quad(0, tri, 0, tri * 0.3, tri, 0, tri * 0.5, tri * 0.5);

        pg.pop();
      }
      break;
    // Perlin noise colorful mosaic
    case 9:
      {
        let pg = proceduralTextures[9];
        pg.push();

        let cs = 8;
        for (let x = 0; x < TEX_SIZE; x += cs) {
          for (let y = 0; y < TEX_SIZE; y += cs) {
            let n = noise(x * 0.01, y * 0.01, time * 0.3);
            let idx = floor(n * 4);

            let palette = [
              color(255, 69, 0),
              color(255, 215, 0),
              color(0, 206, 209),
              color(255, 20, 147),
            ];

            pg.fill(palette[idx]);
            pg.rect(x, y, cs, cs);
          }
        }

        pg.pop();
      }
      break;
  }
}