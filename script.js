import { startAuth } from "./js/auth.js";
import { setCurrentUser, loadPlanner, savePlanner } from "./js/database.js";
import { defaultData, todayISO } from "./js/data.js";

let data = null;

function importanceRank(value) {
  return { High: 0, Medium: 1, Low: 2 }[value] ?? 3;
}

function importanceClass(value) {
  if (value === "High") return "importance-high";
  if (value === "Medium") return "importance-medium";
  return "importance-low";
}

function renderGoals() {
  const sorted = [...data.goals].sort((a, b) => {
    const importanceDiff = importanceRank(a.importance) - importanceRank(b.importance);
    if (importanceDiff !== 0) return importanceDiff;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  goalList.innerHTML = sorted.map(g => `
    <div class="item">
      <div class="item-header">
        <label class="check">
          <input type="checkbox" ${g.done ? "checked" : ""} onchange="toggleGoal('${g.id}')">
          <strong style="${g.done ? "text-decoration: line-through;" : ""}">${g.text}</strong>
        </label>
        <div class="action-row">
          <button class="soft-btn" onclick="toggleEdit('edit-goal-${g.id}')">Edit</button>
          <button class="delete" onclick="removeById('goals','${g.id}')">Delete</button>
        </div>
      </div>
      <p>
        <span class="badge">${g.category}</span>
        <span class="badge ${importanceClass(g.importance)}">${g.importance || "Low"}</span>
        Due: ${g.dueDate}
      </p>
      <div id="edit-goal-${g.id}" class="edit-panel">
        <input id="goal-text-${g.id}" value="${escapeHTML(g.text)}">
        <input id="goal-date-${g.id}" type="date" value="${g.dueDate}">
        <input id="goal-category-${g.id}" value="${escapeHTML(g.category)}">
        <select id="goal-importance-${g.id}">
          ${["High", "Medium", "Low"].map(option => `<option ${option === (g.importance || "Low") ? "selected" : ""}>${option}</option>`).join("")}
        </select>
        <button onclick="updateGoal('${g.id}')">Save Task</button>
      </div>
    </div>
  `).join("");
}

function updateGoal(id) {
  const goal = data.goals.find(g => g.id === id);
  goal.text = document.getElementById(`goal-text-${id}`).value;
  goal.dueDate = document.getElementById(`goal-date-${id}`).value;
  goal.category = document.getElementById(`goal-category-${id}`).value;
  goal.importance = document.getElementById(`goal-importance-${id}`).value;
  save();
}

function toggleGoal(id) {
  const goal = data.goals.find(g => g.id === id);
  goal.done = !goal.done;
  save();
}

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
