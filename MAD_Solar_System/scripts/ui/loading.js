import { CONFIG } from '../constants.js';

export function drawLoadingScreen(loadProgress) {
  push();
  background(0);
  
  // Center content
  translate(width / 2, height / 2);
  
  // Title
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("MAD SOLAR SYSTEM", 0, -50);
  
  // Loading bar background
  const barWidth = width * 0.5;
  const barHeight = 20;
  const barX = -barWidth / 2;
  const barY = 0;
  
  noFill();
  stroke(255);
  strokeWeight(2);
  rect(barX, barY, barWidth, barHeight, 10);
  
  // Loading progress
  noStroke();
  fill(255, 255, 255, 200);
  rect(barX, barY, barWidth * loadProgress, barHeight, 10);
  
  // Loading text
  fill(255);
  textSize(16);
  text(`Loading... ${floor(loadProgress * 100)}%`, 0, 40);
  
  // Credits
  textSize(12);
  text("MAD Game Jam - ESMAD", 0, height / 2 - 30);
  
  pop();
}

export function incrementLoadProgress(assetsLoaded) {
  return {
    assetsLoaded: assetsLoaded + 1,
    loadProgress: (assetsLoaded + 1) / CONFIG.ASSETS_TO_LOAD
  };
}
