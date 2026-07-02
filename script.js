import { startAuth } from "./js/auth.js";
import { setCurrentUser, loadPlanner, savePlanner } from "./js/database.js";
import { defaultData, todayISO } from "./js/data.js";

let data = null;

function renderRandomAffirmation() {
  const random = data.affirmations[Math.floor(Math.random() * data.affirmations.length)];
  affirmationText.textContent = random ? random.text : "Add your first affirmation.";
}

function renderAffirmations() {
  renderRandomAffirmation();
  affirmationList.innerHTML = data.affirmations.map(a => `
    <div class="item">
      <div class="item-header">
        <div>
          <span class="badge">${a.date}</span>
          <p>${a.text}</p>
        </div>
        <div class="action-row">
          <button class="soft-btn" onclick="toggleEdit('edit-affirmation-${a.id}')">Edit</button>
          <button class="delete" onclick="removeById('affirmations','${a.id}')">Delete</button>
        </div>
      </div>
      <div id="edit-affirmation-${a.id}" class="edit-panel">
        <input id="affirmation-date-${a.id}" type="date" value="${a.date}">
        <textarea id="affirmation-text-${a.id}">${escapeHTML(a.text)}</textarea>
        <button onclick="updateAffirmation('${a.id}')">Save Affirmation</button>
      </div>
    </div>
  `).join("");
}

function updateAffirmation(id) {
  const affirmation = data.affirmations.find(a => a.id === id);
  affirmation.date = document.getElementById(`affirmation-date-${id}`).value;
  affirmation.text = document.getElementById(`affirmation-text-${id}`).value;
  save();
}

function renderResources() {
  resourceList.innerHTML = data.resources.map(r => `
    <div class="item">
      <h3>${r.url ? `<a href="${r.url}" target="_blank">${r.title}</a>` : r.title}</h3>
      <p>${r.notes || ""}</p>
      <div class="action-row">
        <button class="soft-btn" onclick="toggleEdit('edit-resource-${r.id}')">Edit</button>
        <button class="delete" onclick="removeById('resources','${r.id}')">Delete</button>
      </div>
      <div id="edit-resource-${r.id}" class="edit-panel">
        <input id="resource-title-${r.id}" value="${escapeHTML(r.title)}">
        <input id="resource-url-${r.id}" value="${escapeHTML(r.url || "")}">
        <textarea id="resource-notes-${r.id}">${escapeHTML(r.notes || "")}</textarea>
        <button onclick="updateResource('${r.id}')">Save Resource</button>
      </div>
    </div>
  `).join("");
}

function updateResource(id) {
  const resource = data.resources.find(r => r.id === id);
  resource.title = document.getElementById(`resource-title-${id}`).value;
  resource.url = document.getElementById(`resource-url-${id}`).value;
  resource.notes = document.getElementById(`resource-notes-${id}`).value;
  save();
}

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
