import { YEAR_DATA } from '../constants.js';

export function drawHoverTooltip(hoveredPlanet, isZoomedIn) {
  if (!hoveredPlanet || isZoomedIn) return;
  
  const yearData = YEAR_DATA[hoveredPlanet.index];
  const x = mouseX;
  const y = mouseY - 40;
  const padding = 10;
  const textSize = 14;
  const titleSize = 16;
  const lineHeight = 20;
  
  // Calculate tooltip dimensions
  textSize(titleSize);
  const titleWidth = textWidth(yearData.year + " - " + yearData.theme);
  textSize(textSize);
  const descWidth = textWidth(yearData.description);
  const tooltipWidth = max(titleWidth, descWidth) + padding * 2;
  const tooltipHeight = lineHeight * 2 + padding * 2;
  
  // Position tooltip (keep within canvas)
  let tooltipX = x + 20;
  let tooltipY = y - tooltipHeight;
  
  if (tooltipX + tooltipWidth > width) {
    tooltipX = x - tooltipWidth - 20;
  }
  if (tooltipY < 0) {
    tooltipY = y + 20;
  }
  
  // Draw tooltip background
  fill(0, 0, 0, 200);
  stroke(255, 255, 255, 100);
  strokeWeight(1);
  rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5);
  
  // Draw title
  fill(255);
  textSize(titleSize);
  textAlign(LEFT, TOP);
  text(yearData.year + " - " + yearData.theme, tooltipX + padding, tooltipY + padding);
  
  // Draw description
  textSize(textSize);
  fill(200);
  text(yearData.description, tooltipX + padding, tooltipY + padding + lineHeight);
  
  // Draw click hint if not on mobile
  if (!/Mobi|Android/i.test(navigator.userAgent)) {
    textSize(12);
    fill(150);
    text("Click to zoom in", tooltipX + padding, tooltipY + tooltipHeight - padding - 12);
  }
}
