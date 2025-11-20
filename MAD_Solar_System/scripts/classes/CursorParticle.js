class CursorParticle {
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
    // Convert stored mouse (top-left) coords into WEBGL drawing space.
    translate(this.x - width / 2, this.y - height / 2);
    blendMode(ADD);
    noStroke();
    const alpha = map(this.life, 0, 80, 0, 255);

    // Main star (draw at origin after translating)
    fill(255, 255, 255, alpha);
    ellipse(0, 0, this.size);

    // Soft glow
    fill(255, 255, 255, alpha * 0.4);
    ellipse(0, 0, this.size * 1.8);

    // Star tail
    fill(255, 255, 255, alpha * 0.6);
    const tx = -this.vx * 4;
    const ty = -this.vy * 4;
    ellipse(tx, ty, max(1, this.size * 0.5));

    pop();
  }
  
  isDead() {
    return this.life <= 0;
  }
}