import { startAuth } from "./js/auth.js";
import { setCurrentUser, loadPlanner, savePlanner } from "./js/database.js";
import { defaultData, todayISO } from "./js/data.js";

let data = null;

let classificationVisible = false;

function classifyUK(mark) {
  if (mark >= 70) return "1st Honors";
  if (mark >= 60) return "2:1 Honors";
  if (mark >= 50) return "2:2 Honors";
  if (mark >= 40) return "3rd Honors";
  if (mark === "" || Number.isNaN(mark)) return "—";
  return "Fail";
}

function moduleTotal(module) {
  const assignments = module.assignments || [];
  const totalWeight = assignments.reduce((sum, a) => sum + Number(a.weight || 0), 0);
  if (!assignments.length || totalWeight === 0) return "";
  const weighted = assignments.reduce((sum, a) => sum + Number(a.mark || 0) * (Number(a.weight || 0) / 100), 0);
  return weighted.toFixed(1);
}

function averageOfModuleTotals() {
  const totals = data.modules.map(m => moduleTotal(m)).filter(v => v !== "");
  if (!totals.length) return "";
  const average = totals.reduce((sum, value) => sum + Number(value), 0) / totals.length;
  return average.toFixed(1);
}

function ringHTML(name, done, goal) {
  const p = percent(done, goal);
  return `
    <div class="ring-card">
      <div class="progress-ring" style="--value:${p}">
        <span>${p}%</span>
      </div>
      <p class="ring-label">${name}</p>
      <p class="ring-sub">${done} / ${goal} hrs</p>
    </div>
  `;
}

function renderDashboard() {
  const completedHours = data.categories.reduce((sum, c) => sum + totalHours(c), 0);
  const goalHours = data.categories.reduce((sum, c) => sum + Number(c.goal || 0), 0);
  const moduleAverage = averageOfModuleTotals();

  dashTotalHours.textContent = completedHours;
  dashActivityProgress.textContent = `${percent(completedHours, goalHours)}%`;
  dashModules.textContent = data.modules.length;
  
  const classification = moduleAverage ? classifyUK(Number(moduleAverage)) : "—";
  
  dashClassification.textContent =
    classificationVisible ? classification : "";

  dashboardRings.innerHTML = data.categories.map(c => ringHTML(c.name, totalHours(c), c.goal)).join("");

  const upcoming = [...data.timeline].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  dashboardTimeline.innerHTML = upcoming.map((t, index) => `
    <div class="item">
      <span class="badge">#${index + 1} · ${t.type}</span>
      <h4>${t.title}</h4>
      <p>${t.date}</p>
    </div>
  `).join("");
}

function renderActivities() {
  activityCategory.innerHTML = data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

  activityList.innerHTML = data.categories.map(c => {
    const done = totalHours(c);
    return `
      <div class="category-card">
        <div class="item-header">
          <div>
            <h3>${c.name}</h3>
            <p>${done} / ${c.goal} hours completed</p>
          </div>
          <div class="action-row">
            <button class="soft-btn" onclick="toggleEdit('edit-category-${c.id}')">Edit Goal</button>
            <button class="delete" onclick="deleteCategory('${c.id}')">Delete</button>
          </div>
        </div>
        <div id="edit-category-${c.id}" class="edit-panel">
          <input id="category-name-${c.id}" value="${escapeHTML(c.name)}">
          <input id="category-goal-${c.id}" type="number" min="1" step="1" value="${c.goal}">
          <button onclick="updateCategory('${c.id}')">Save Category</button>
        </div>
        ${ringHTML(c.name, done, c.goal)}
        <div class="activity-sublist">
          ${(c.activities || []).map(a => `
            <div class="activity-pill">
              <div class="item-header">
                <div>
                  <strong>${a.name}</strong>
                  <p>${a.date || "No date"} · ${a.hours} hours</p>
                  <p>${a.notes || ""}</p>
                </div>
                <div class="action-row">
                  <button class="soft-btn" onclick="toggleEdit('edit-activity-${a.id}')">Edit</button>
                  <button class="delete" onclick="deleteActivity('${c.id}', '${a.id}')">Delete</button>
                </div>
              </div>
              <div id="edit-activity-${a.id}" class="edit-panel">
                <input id="activity-name-${a.id}" value="${escapeHTML(a.name)}">
                <input id="activity-date-${a.id}" type="date" value="${a.date || ""}">
                <input id="activity-hours-${a.id}" type="number" min="0" step="0.5" value="${a.hours}">
                <textarea id="activity-notes-${a.id}">${escapeHTML(a.notes || "")}</textarea>
                <button onclick="updateActivity('${c.id}', '${a.id}')">Save Activity</button>
              </div>
            </div>
          `).join("") || "<p>No activities yet.</p>"}
        </div>
      </div>
    `;
  }).join("");
}

function updateActivity(categoryId, activityId) {
  const category = data.categories.find(c => c.id === categoryId);
  const activity = category.activities.find(a => a.id === activityId);
  activity.name = document.getElementById(`activity-name-${activityId}`).value;
  activity.date = document.getElementById(`activity-date-${activityId}`).value;
  activity.hours = Number(document.getElementById(`activity-hours-${activityId}`).value);
  activity.notes = document.getElementById(`activity-notes-${activityId}`).value;
  save();
}

function updateCategory(id) {
  const category = data.categories.find(c => c.id === id);
  category.name = document.getElementById(`category-name-${id}`).value;
  category.goal = Number(document.getElementById(`category-goal-${id}`).value);
  save();
}

function deleteCategory(id) {
  if (!safeConfirmDelete("Delete this activity category and all activities inside it?")) return;
  data.categories = data.categories.filter(c => c.id !== id);
  save();
}

function deleteActivity(categoryId, activityId) {
  if (!safeConfirmDelete()) return;
  const category = data.categories.find(c => c.id === categoryId);
  category.activities = category.activities.filter(a => a.id !== activityId);
  save();
}

function renderTimeline() {
  const sorted = [...data.timeline].sort((a, b) => new Date(a.date) - new Date(b.date));
  timelineList.innerHTML = sorted.map((t, index) => `
    <div class="timeline-item">
      <div class="timeline-content-wrap">
        <div class="timeline-number">${index + 1}</div>
        <div>
          <span class="badge">${t.type}</span>
          <h3>${t.title}</h3>
          <p class="timeline-date-large">${t.date}</p>
          <p>${t.notes || ""}</p>
          <div class="action-row">
            <button class="soft-btn" onclick="toggleEdit('edit-timeline-${t.id}')">Edit</button>
            <button class="delete" onclick="removeById('timeline','${t.id}')">Delete</button>
          </div>
        </div>
      </div>
      <div id="edit-timeline-${t.id}" class="edit-panel">
        <input id="timeline-title-${t.id}" value="${escapeHTML(t.title)}">
        <input id="timeline-date-${t.id}" type="date" value="${t.date}">
        <select id="timeline-type-${t.id}">
          ${["Academic", "MCAT", "Application", "Interview", "Personal", "Extracurriculars"].map(option => `<option ${option === t.type ? "selected" : ""}>${option}</option>`).join("")}
        </select>
        <textarea id="timeline-notes-${t.id}">${escapeHTML(t.notes || "")}</textarea>
        <button onclick="updateTimeline('${t.id}')">Save Milestone</button>
      </div>
    </div>
  `).join("");
}

function updateTimeline(id) {
  const item = data.timeline.find(t => t.id === id);
  item.title = document.getElementById(`timeline-title-${id}`).value;
  item.date = document.getElementById(`timeline-date-${id}`).value;
  item.type = document.getElementById(`timeline-type-${id}`).value;
  item.notes = document.getElementById(`timeline-notes-${id}`).value;
  save();
}

function renderModules() {
  assignmentModule.innerHTML = data.modules
    .map(m => `<option value="${m.id}">${m.year || "No Year"} — ${m.name} — ${m.term}</option>`)
    .join("");

  const years = ["Year 1", "Year 2", "Year 3"];

  const yearSections = years.map(year => {
    const yearModules = data.modules.filter(m => m.year === year);

    const yearTotals = yearModules
      .map(m => moduleTotal(m))
      .filter(v => v !== "");

    const yearAverage = yearTotals.length
      ? (yearTotals.reduce((sum, value) => sum + Number(value), 0) / yearTotals.length).toFixed(1)
      : "";

    return `
      <details class="year-box">
        <summary>
          <span class="year-arrow"></span>
          <span class="year-title">
          ${year}
          </span>
          <span class="year-average">
          ${yearAverage
            ? `${yearAverage}% (${classifyUK(Number(yearAverage))})`
            : "No marks yet"}
          </span>
        </summary>

        ${yearModules.length ? yearModules.map(module => {
          const total = moduleTotal(module);
          const totalWeight = (module.assignments || []).reduce((sum, a) => sum + Number(a.weight || 0), 0);

          return `
            <div class="category-card">
              <div class="item-header">
                <div>
                  <h3>${module.name}</h3>
                  <div class="module-summary">
                    <span>${module.term}</span>
                    <span>Total: ${total ? `${total}% (${classifyUK(Number(total))})` : "—"}</span>
                    <span>Weight entered: ${totalWeight}%</span>
                  </div>
                </div>

                <div class="action-row">
                  <button class="soft-btn" onclick="toggleEdit('edit-module-${module.id}')">Edit</button>
                  <button class="delete" onclick="removeById('modules','${module.id}')">Delete</button>
                </div>
              </div>

              <div id="edit-module-${module.id}" class="edit-panel">
                <input id="module-name-${module.id}" value="${escapeHTML(module.name)}">

                <select id="module-term-${module.id}">
                  ${["Term 1", "Term 2", "Term 3"].map(option =>
                    `<option ${option === module.term ? "selected" : ""}>${option}</option>`
                  ).join("")}
                </select>

                <select id="module-year-${module.id}">
                  ${["Year 1", "Year 2", "Year 3"].map(option =>
                    `<option ${option === module.year ? "selected" : ""}>${option}</option>`
                  ).join("")}
                </select>

                <button onclick="updateModule('${module.id}')">Save Module</button>
              </div>

              <div class="assignment-list">
                ${(module.assignments || []).map(a => `
                  <div class="assignment-card">
                    <div class="item-header">
                      <div>
                        <strong>${a.name}</strong>
                        <p>${a.mark}% (${classifyUK(Number(a.mark))}) · Weighting: ${a.weight}% ${a.date ? `· ${a.date}` : ""}</p>
                      </div>

                      <div class="action-row">
                        <button class="soft-btn" onclick="toggleEdit('edit-assignment-${a.id}')">Edit</button>
                        <button class="delete" onclick="deleteAssignment('${module.id}', '${a.id}')">Delete</button>
                      </div>
                    </div>

                    <div id="edit-assignment-${a.id}" class="edit-panel">
                      <input id="assignment-name-${a.id}" value="${escapeHTML(a.name)}">
                      <input id="assignment-mark-${a.id}" type="number" min="0" max="100" step="0.1" value="${a.mark}">
                      <input id="assignment-weight-${a.id}" type="number" min="0" max="100" step="0.1" value="${a.weight}">
                      <input id="assignment-date-${a.id}" type="date" value="${a.date || ""}">
                      <button onclick="updateAssignment('${module.id}', '${a.id}')">Save Assignment</button>
                    </div>
                  </div>
                `).join("") || "<p>No assignments yet.</p>"}
              </div>
            </div>
          `;
        }).join("") : "<p>No modules yet.</p>"}
      </details>
    `;
  }).join("");

  moduleList.innerHTML = yearSections;

  const average = averageOfModuleTotals();
  moduleAverageDisplay.textContent = average ? `${average}%` : "—";
  classificationDisplay.textContent = average
    ? `Classification: ${classifyUK(Number(average))}`
    : "Classification: —";
}

function updateModule(id) {
  const module = data.modules.find(m => m.id === id);
  module.name = document.getElementById(`module-name-${id}`).value;
  module.term = document.getElementById(`module-term-${id}`).value;
  module.year = document.getElementById(`module-year-${id}`).value;
  save();
}

function updateAssignment(moduleId, assignmentId) {
  const module = data.modules.find(m => m.id === moduleId);
  const assignment = module.assignments.find(a => a.id === assignmentId);
  assignment.name = document.getElementById(`assignment-name-${assignmentId}`).value;
  assignment.mark = Number(document.getElementById(`assignment-mark-${assignmentId}`).value);
  assignment.weight = Number(document.getElementById(`assignment-weight-${assignmentId}`).value);
  assignment.date = document.getElementById(`assignment-date-${assignmentId}`).value;
  save();
}

function deleteAssignment(moduleId, assignmentId) {
  if (!safeConfirmDelete()) return;
  const module = data.modules.find(m => m.id === moduleId);
  module.assignments = module.assignments.filter(a => a.id !== assignmentId);
  save();
}

function renderVision() {
  visionBoard.innerHTML = data.vision.map((v, index) => `
    <div class="pin" draggable="true" data-index="${index}">
      ${v.image ? `<img src="${v.image}" alt="${escapeHTML(v.title || "Vision image")}">` : `<div class="pin-placeholder">✦</div>`}
      ${v.title ? `<h3>${v.title}</h3>` : ""}
      ${v.quote ? `<p>${v.quote}</p>` : ""}
      <button class="delete" onclick="removeById('vision','${v.id}')">Delete</button>
    </div>
  `).join("");

  enableVisionDragDrop();
}

function enableVisionDragDrop() {
  const pins = document.querySelectorAll(".pin");
  let draggedIndex = null;

  pins.forEach(pin => {
    pin.addEventListener("dragstart", () => {
      draggedIndex = Number(pin.dataset.index);
      pin.classList.add("dragging");
    });

    pin.addEventListener("dragend", () => {
      pin.classList.remove("dragging");
      pins.forEach(p => p.classList.remove("drag-over"));
    });

    pin.addEventListener("dragover", e => {
      e.preventDefault();
      pin.classList.add("drag-over");
    });

    pin.addEventListener("dragleave", () => {
      pin.classList.remove("drag-over");
    });

    pin.addEventListener("drop", e => {
      e.preventDefault();
      const droppedIndex = Number(pin.dataset.index);
      if (draggedIndex === null || draggedIndex === droppedIndex) return;

      const moved = data.vision.splice(draggedIndex, 1)[0];
      data.vision.splice(droppedIndex, 0, moved);
      save();
    });
  });
}

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

document.getElementById("toggleClassification").addEventListener("click", () => {
  classificationVisible = !classificationVisible;

  const moduleAverage = averageOfModuleTotals();
  const classification = moduleAverage ? classifyUK(Number(moduleAverage)) : "—";

  document.getElementById("dashClassification").textContent =
    classificationVisible ? classification : "";

  document.getElementById("toggleClassification").textContent =
    classificationVisible ? "Hide" : "Show";
});

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
