// UI — botões e janelas
window.addEventListener("DOMContentLoaded", () => {
  // Toggle shortcuts
  const helpBtn = document.getElementById("help-toggle");
  const shortcuts = document.getElementById("shortcuts");

  helpBtn.addEventListener("click", () => {
    shortcuts.classList.toggle("hidden");
  });

  // Fechar ao clicar fora
  document.addEventListener("click", (e) => {
    if (
      !shortcuts.contains(e.target) &&
      e.target !== helpBtn &&
      !helpBtn.contains(e.target)
    ) {
      shortcuts.classList.add("hidden");
    }
  });

  // Botão de Som
  const soundBtn = document.getElementById("sound-toggle");
  soundBtn.addEventListener("click", () => {
    if (typeof toggleSound === "function") toggleSound();
  });
});

function showPlanetInfo(planet) {
  const info = document.getElementById("planet-info");
  const title = document.getElementById("planet-title");
  const desc = document.getElementById("planet-description");

  if (info && title && desc) {
    title.textContent = `${planet.yearData.year} — ${planet.yearData.theme}`;
    desc.textContent = planet.yearData.details;
    info.classList.remove("hidden");
  }
}

function hidePlanetInfo() {
  const info = document.getElementById("planet-info");
  if (info) info.classList.add("hidden");
}

function drawHoverTooltip() {
  push();
  resetMatrix();

  let tx = mouseX - width / 2;
  let ty = mouseY - height / 2 - 60;
  translate(tx, ty);

  // Background colorido
  fill(
    hoveredPlanet.yearData.color.r,
    hoveredPlanet.yearData.color.g,
    hoveredPlanet.yearData.color.b,
    230
  );
  stroke(255);
  strokeWeight(3);
  rectMode(CENTER);
  rect(0, 0, 180, 70, 12);

  // Ano
  noStroke();
  fill(255);
  textSize(28);
  textAlign(CENTER, CENTER);
  textFont("Arial");
  text(hoveredPlanet.yearData.year, 0, -12);

  // Tema
  textSize(14);
  fill(255, 255, 255, 220);
  text(hoveredPlanet.yearData.theme, 0, 15);

  pop();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = document.querySelector("#sound-toggle .icon");

  if (soundEnabled) {
    if (spaceSound && !spaceSound.isPlaying()) spaceSound.loop();
    spaceSound.setVolume(0.5);
    if (soundButton) {
      const newIcon = document.createElement("i");
      newIcon.setAttribute("data-lucide", "volume-2");
      newIcon.className = "icon";
      newIcon.style.width = "1.2em";
      newIcon.style.height = "1.2em";
      newIcon.style.color = "white";
      icon.replaceWith(newIcon);
      lucide.createIcons();
    }
  } else {
    spaceSound.setVolume(0);
    if (soundButton) {
      const newIcon = document.createElement("i");
      newIcon.setAttribute("data-lucide", "volume-x");
      newIcon.className = "icon";
      newIcon.style.width = "1.2em";
      newIcon.style.height = "1.2em";
      newIcon.style.color = "white";
      icon.replaceWith(newIcon);
      lucide.createIcons();
    }
  }
}