import { CONFIG } from '../constants.js';

export class StarField {
  constructor() {
    this.stars = [];
    this.initializeStars();
  }

  initializeStars() {
    for (let i = 0; i < CONFIG.NUM_STARS; i++) {
      this.stars.push({
        x: random(-CONFIG.STAR_FIELD_SIZE, CONFIG.STAR_FIELD_SIZE),
        y: random(-CONFIG.STAR_FIELD_SIZE, CONFIG.STAR_FIELD_SIZE),
        z: random(CONFIG.STAR_FIELD_SIZE),
        pz: 0
      });
    }
  }

  update() {
    if (window.isPaused) return;
    
    for (let star of this.stars) {
      star.pz = star.z;
      star.z -= 2;
      
      if (star.z < 1) {
        star.z = CONFIG.STAR_FIELD_SIZE;
        star.x = random(-CONFIG.STAR_FIELD_SIZE, CONFIG.STAR_FIELD_SIZE);
        star.y = random(-CONFIG.STAR_FIELD_SIZE, CONFIG.STAR_FIELD_SIZE);
        star.pz = star.z;
      }
    }
  }

  draw() {
    push();
    translate(0, 0, -CONFIG.STAR_FIELD_SIZE / 2);
    
    for (let star of this.stars) {
      const sx = map(star.x / star.z, 0, 1, 0, width);
      const sy = map(star.y / star.z, 0, 1, 0, height);
      const r = map(star.z, 0, CONFIG.STAR_FIELD_SIZE, 4, 0);
      
      const px = map(star.x / star.pz, 0, 1, 0, width);
      const py = map(star.y / star.pz, 0, 1, 0, height);
      
      stroke(255, 255, 255, map(star.z, 0, CONFIG.STAR_FIELD_SIZE, 255, 0));
      strokeWeight(r);
      line(px, py, sx, sy);
    }
    
    pop();
  }
}

export function createStars() {
  return new StarField();
}
