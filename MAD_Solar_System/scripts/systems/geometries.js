// -----------------------------------------------------------
// 1) Octaedro simples
// -----------------------------------------------------------
function poly1_octahedron(size) {
  beginShape(TRIANGLES);
  const s = size;
  const v = [
    [0,  s,  0],
    [0, -s,  0],
    [ s,  0,  0],
    [-s,  0,  0],
    [0,  0,  s],
    [0,  0, -s]
  ];
  const faces = [
    [0,2,4],[0,4,3],[0,3,5],[0,5,2],
    [1,4,2],[1,3,4],[1,5,3],[1,2,5]
  ];
  for (let f of faces) {
    for (let i=0;i<3;i++) vertex(...v[f[i]]);
  }
  endShape();
}


// -----------------------------------------------------------
// 2) Octaedro truncado
// -----------------------------------------------------------
function poly2_truncatedOct(size) {
  const s = size * 0.7;
  beginShape(TRIANGLES);
  for (let x of [-1,1]) {
    for (let y of [-1,1]) {
      for (let z of [-1,1]) {
        vertex(x*s, y*s*0.4, 0);
        vertex(x*s*0.4, y*s, 0);
        vertex(0, y*s, z*s*0.4);
      }
    }
  }
  endShape();
}


// -----------------------------------------------------------
// 3) Icosaedro regular
// -----------------------------------------------------------
function poly3_icosahedron(size) {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts = [
    [-1,  t, 0],[1,  t, 0],[-1, -t, 0],[1, -t, 0],
    [0, -1,  t],[0, 1,  t],[0, -1, -t],[0, 1, -t],
    [ t, 0, -1],[ t, 0, 1],[-t, 0, -1],[-t, 0, 1]
  ].map(v => v.map(n => n * size * 0.3));

  const faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
  ];

  beginShape(TRIANGLES);
  for (let f of faces) {
    for (let i=0;i<3;i++) vertex(...verts[f[i]]);
  }
  endShape();
}


// -----------------------------------------------------------
// 4) Icosaedro com spikes
// -----------------------------------------------------------
function poly4_icosaSpike(size) {
  push();
  scale(1.1);
  poly3_icosahedron(size);

  beginShape(TRIANGLES);
  const spike = size * 0.4;
  for (let ang = 0; ang < TWO_PI; ang += PI/5) {
    let x = cos(ang) * size;
    let y = sin(ang) * size;
    vertex(0,0,0);
    vertex(x, y, spike);
    vertex(-x*0.3, -y*0.3, spike);
  }
  endShape();
  pop();
}


// -----------------------------------------------------------
// 5) Dodecaedro
// -----------------------------------------------------------
function poly5_dodeca(size) {
  let phi = (1 + Math.sqrt(5)) / 2;
  let a = size * 0.25;

  let verts = [
    [-a,-a,-a],[ a,-a,-a],[ a, a,-a],[-a, a,-a],
    [-a,-a, a],[ a,-a, a],[ a, a, a],[-a, a, a],
    [0,-a/phi,-a*phi],[0, a/phi,-a*phi],[0,-a/phi, a*phi],[0, a/phi, a*phi],
    [-a/phi,-a*phi,0],[ a/phi,-a*phi,0],[-a/phi, a*phi,0],[ a/phi, a*phi,0]
  ];

  const faces = [
    [0,1,9,16,12],[1,2,13,17,9],[2,3,14,18,13],[3,0,12,19,14],
    [4,5,13,18,15],[5,6,17,20,13],[6,7,14,19,21],[7,4,15,22,14],
    [0,1,5,4,8],[1,2,6,5,10],[2,3,7,6,11],[3,0,4,7,23]
  ];

  beginShape();
  for (let f of faces) {
    for (let i of f) vertex(...verts[i]);
  }
  endShape(CLOSE);
}


// -----------------------------------------------------------
// 6) Dodecaedro extrudido
// -----------------------------------------------------------
function poly6_extrudedDodeca(size) {
  push();
  poly5_dodeca(size);

  beginShape(TRIANGLES);
  for (let ang = 0; ang < TWO_PI; ang += PI/3) {
    let x = cos(ang) * size * 0.8;
    let y = sin(ang) * size * 0.8;
    vertex(0,0,size*0.6);
    vertex(x,y,size*0.4);
    vertex(-x*0.2,-y*0.2,size*0.4);
  }
  endShape();
  pop();
}


// -----------------------------------------------------------
// 7) Cubo facetado (bevel cube)
// -----------------------------------------------------------
function poly7_bevelCube(size) {
  let s = size;
  beginShape(QUADS);
  for (let x of [-1,1]) {
    for (let y of [-1,1]) {
      for (let z of [-1,1]) {
        vertex(x*s, y*s*0.6, z*s*0.6);
        vertex(x*s*0.6, y*s, z*s*0.6);
        vertex(x*s*0.6, y*s*0.6, z*s);
        vertex(x*s, y*s, z*s);
      }
    }
  }
  endShape();
}


// -----------------------------------------------------------
// 8) Estrela de 12 pontas
// -----------------------------------------------------------
function poly8_spikeBall(size) {
  beginShape(TRIANGLES);
  for (let ang = 0; ang < TWO_PI; ang += PI/6) {
    let x = cos(ang) * size * 0.6;
    let y = sin(ang) * size * 0.6;
    vertex(0,0,0);
    vertex(x,y,size*1.3);
    vertex(x*0.3,y*0.3,size*0.6);
  }
  endShape();
}


// -----------------------------------------------------------
// 9) Esfera facetada com ruído
// -----------------------------------------------------------
function poly9_noiseSphere(size) {
  beginShape(TRIANGLES);
  for (let lat = 0; lat < PI; lat += PI/12) {
    for (let lon = 0; lon < TWO_PI; lon += PI/12) {

      let r = size * (0.8 + noise(lat*2, lon*2) * 0.4);

      vertex(
        r * sin(lat) * cos(lon),
        r * cos(lat),
        r * sin(lat) * sin(lon)
      );
    }
  }
  endShape();
}


// -----------------------------------------------------------
// 10) Poliedro orgânico (metaball-like)
// -----------------------------------------------------------
function poly10_meta(size) {
  beginShape(TRIANGLES);
  for (let i = 0; i < 20; i++) {
    let ang = random(TWO_PI);
    let elev = random(-PI/2, PI/2);
    let r = size * (0.7 + random(0.5));
    vertex(
      r*cos(elev)*cos(ang),
      r*sin(elev),
      r*cos(elev)*sin(ang)
    );
  }
  endShape();
}