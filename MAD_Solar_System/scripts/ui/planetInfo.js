import { YEAR_DATA } from '../constants.js';

let infoDiv = null;

export function showPlanetInfo(planet) {
  if (!infoDiv) {
    infoDiv = document.createElement('div');
    infoDiv.id = 'planet-info';
    infoDiv.style.position = 'fixed';
    infoDiv.style.bottom = '20px';
    infoDiv.style.left = '50%';
    infoDiv.style.transform = 'translateX(-50%)';
    infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    infoDiv.style.color = 'white';
    infoDiv.style.padding = '20px';
    infoDiv.style.borderRadius = '10px';
    infoDiv.style.maxWidth = '600px';
    infoDiv.style.width = '90%';
    infoDiv.style.textAlign = 'center';
    infoDiv.style.zIndex = '1000';
    infoDiv.style.backdropFilter = 'blur(5px)';
    infoDiv.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    document.body.appendChild(infoDiv);
  }

  const yearData = YEAR_DATA[planet.index];
  const color = `rgb(${yearData.color.r}, ${yearData.color.g}, ${yearData.color.b})`;
  
  infoDiv.innerHTML = `
    <h2 style="margin: 0 0 10px 0; color: ${color}">${yearData.year} - ${yearData.theme}</h2>
    <p style="margin: 0 0 15px 0; font-size: 1.1em;">${yearData.description}</p>
    <p style="margin: 0; color: #ccc;">${yearData.details}</p>
    <div style="margin-top: 15px;">
      <button id="close-info" style="
        background: ${color};
        color: white;
        border: none;
        padding: 8px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9em;
        transition: transform 0.2s, background 0.2s;
      ">Back to Solar System</button>
    </div>
  `;
  
  // Add close button event
  document.getElementById('close-info').addEventListener('click', () => {
    hidePlanetInfo();
    window.unselectPlanet();
  });
  
  // Add animation
  infoDiv.style.opacity = '0';
  infoDiv.style.transition = 'opacity 0.3s';
  setTimeout(() => { infoDiv.style.opacity = '1'; }, 10);
}

export function hidePlanetInfo() {
  if (infoDiv) {
    infoDiv.style.opacity = '0';
    setTimeout(() => {
      if (infoDiv && infoDiv.parentNode) {
        infoDiv.parentNode.removeChild(infoDiv);
        infoDiv = null;
      }
    }, 300);
  }
}

// Handle window resize to keep info centered
window.addEventListener('resize', () => {
  if (infoDiv) {
    infoDiv.style.left = '50%';
    infoDiv.style.transform = 'translateX(-50%)';
  }
});
