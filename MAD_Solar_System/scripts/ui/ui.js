// UI — botões e janelas
window.addEventListener("DOMContentLoaded", () => {
  // Toggle shortcuts
  const helpBtn = document.getElementById("help-toggle");
  const shortcuts = document.getElementById("shortcuts");

  helpBtn.addEventListener("click", () => {
    shortcuts.classList.toggle("hidden");
  });

  // Hide shortcuts when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !shortcuts.contains(e.target) &&
      e.target !== helpBtn &&
      !helpBtn.contains(e.target)
    ) {
      shortcuts.classList.add("hidden");
    }
  });

  // Sound toggle
  const soundBtn = document.getElementById("sound-toggle");
  soundBtn.addEventListener("click", () => {
    if (typeof toggleSound === "function") toggleSound();
  });

  document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor");
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
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

function toggleSound() {
  const icon = document.querySelector("#sound-toggle .icon");

  if (audioMode === "sound") {

    // ➤ Mudar para modo voz
    audioMode = "speech";
    activateSpeechMode();

    // Atualizar ícone para "mic"
    const newIcon = document.createElement("i");
    newIcon.setAttribute("data-lucide", "mic");
    newIcon.className = "icon";
    icon.replaceWith(newIcon);
    lucide.createIcons();

  } else {

    // ➤ Mudar para modo som
    audioMode = "sound";
    activateSoundMode();

    // Atualizar ícone para volume-2
    const newIcon = document.createElement("i");
    newIcon.setAttribute("data-lucide", "volume-2");
    newIcon.className = "icon";
    icon.replaceWith(newIcon);
    lucide.createIcons();
  }
}
