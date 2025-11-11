export class CursorParticle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 50 + floor(random(0, 30));
    this.size = random(3, 10);
    this.hue = random(180, 255);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.vy += 0.015;
    this.life--;
  }
  
  drawScreen() {
    push();
    resetMatrix();
    translate(-width / 2, -height / 2);
    blendMode(ADD);
    noStroke();
    const alpha = map(this.life, 0, 80, 0, 255);
    
    // Main star
    fill(255, 255, 255, alpha);
    ellipse(this.x, this.y, this.size);
    
    // Soft glow
    fill(255, 255, 255, alpha * 0.4);
    ellipse(this.x, this.y, this.size * 1.8);
    
    // Star tail
    fill(255, 255, 255, alpha * 0.6);
    const tx = this.x - this.vx * 4;
    const ty = this.y - this.vy * 4;
    ellipse(tx, ty, max(1, this.size * 0.5));
    
    pop();
  }
  
  isDead() {
    return this.life <= 0;
  }
}
