function applyTheme(theme) {
  document.body.classList.remove(
    "theme-butter",
    "theme-sage",
    "theme-lavender",
    "theme-blue",
    "theme-orange");

  if (theme !== "pink") {
    document.body.classList.add(`theme-${theme}`);
  }

  localStorage.setItem("emsPlannerTheme", theme);
}

document.querySelectorAll(".theme-choice").forEach(button => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
  });
});

const savedTheme = localStorage.getItem("emsPlannerTheme") || "pink";
applyTheme(savedTheme);
