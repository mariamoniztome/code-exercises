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
    if (!shortcuts.contains(e.target) &&
        e.target !== helpBtn &&
        !helpBtn.contains(e.target)) 
    {
      shortcuts.classList.add("hidden");
    }
  });

  // Botão de Som
  const soundBtn = document.getElementById("sound-toggle");
  soundBtn.addEventListener("click", () => {
    if (typeof toggleSound === "function") toggleSound();
  });
});