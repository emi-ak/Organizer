import { startAuth } from "./js/auth.js";
import { setCurrentUser, loadPlanner, savePlanner } from "./js/database.js";
import { defaultData, todayISO } from "./js/data.js";

let data = null;

function renderAll() {
  if (!data) return;

  renderDashboard();
  renderActivities();
  renderTimeline();
  renderModules();
  renderVision();
  renderAffirmations();
  renderResources();
  renderGoals();
}

document.querySelectorAll(".form-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const form = document.getElementById(button.dataset.target);
    form.classList.toggle("open");

    const isOpen = form.classList.contains("open");
    const label = button.textContent.replace("+ ", "").replace("− ", "").trim();

    button.textContent = isOpen ? `− ${label}` : `+ ${label}`;
  });
});

startAuth(async (user) => {
  console.log("Signed in as:", user.email);

  setCurrentUser(user);
  data = await loadPlanner(defaultData);

  data.modules = (data.modules || []).map(module => ({
    ...module,
    year: module.year || "Year 1"
  }));

  renderAll();
  openPage(localStorage.getItem("emsPlannerCurrentPage") || "dashboard");
});

window.toggleEdit = toggleEdit;
window.removeById = removeById;
window.updateActivity = updateActivity;
window.updateCategory = updateCategory;
window.deleteCategory = deleteCategory;
window.deleteActivity = deleteActivity;
window.updateTimeline = updateTimeline;
window.updateModule = updateModule;
window.updateAssignment = updateAssignment;
window.deleteAssignment = deleteAssignment;
window.updateAffirmation = updateAffirmation;
window.updateResource = updateResource;
window.updateGoal = updateGoal;
window.toggleGoal = toggleGoal;

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
