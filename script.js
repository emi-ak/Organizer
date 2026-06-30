const todayISO = new Date().toISOString().slice(0, 10);

const defaultData = {
  categories: [
    { id: crypto.randomUUID(), name: "Volunteering", goal: 120, activities: [
      { id: crypto.randomUUID(), name: "Community health volunteering", date: todayISO, hours: 12, notes: "Helped with patient-facing community support." }
    ]},
    { id: crypto.randomUUID(), name: "Shadowing", goal: 50, activities: [] },
    { id: crypto.randomUUID(), name: "Research", goal: 300, activities: [] },
    { id: crypto.randomUUID(), name: "Clinical Experience", goal: 150, activities: [] },
    { id: crypto.randomUUID(), name: "Leadership", goal: 100, activities: [] }
  ],
  timeline: [
    { id: crypto.randomUUID(), title: "Start MCAT content review", date: "2026-09-01", type: "MCAT", notes: "Build weekly study schedule." },
    { id: crypto.randomUUID(), title: "Join one extracurricular project", date: "2026-10-01", type: "Extracurriculars", notes: "Choose something meaningful and consistent." },
    { id: crypto.randomUUID(), title: "Ask for letters of recommendation", date: "2027-02-01", type: "Application", notes: "Prepare CV and activity list." }
  ],
  modules: [
    {
      id: crypto.randomUUID(),
      name: "Cell Biology",
      term: "Term 1",
      assignments: [
        { id: crypto.randomUUID(), name: "Lab report", mark: 72, weight: 30, date: todayISO },
        { id: crypto.randomUUID(), name: "Final exam", mark: 68, weight: 70, date: todayISO }
      ]
    }
  ],
  vision: [],
  affirmations: [
    { id: crypto.randomUUID(), date: todayISO, text: "I am building my future one disciplined day at a time." },
    { id: crypto.randomUUID(), date: todayISO, text: "God has not given me a spirit of fear, but of power, love, and self-control. — 2 Timothy 1:7" },
    { id: crypto.randomUUID(), date: todayISO, text: "Commit your work to the Lord, and your plans will be established. — Proverbs 16:3" }
  ],
  resources: [
    { id: crypto.randomUUID(), title: "AMCAS Applicant Guide", url: "https://students-residents.aamc.org/applying-medical-school-amcas/applying-medical-school-amcas", notes: "Primary application information." }
  ],
  goals: [
    { id: crypto.randomUUID(), text: "Update CV this month", dueDate: todayISO, category: "Career", importance: "Medium", done: false },
    { id: crypto.randomUUID(), text: "Find one research opportunity", dueDate: todayISO, category: "Research", importance: "High", done: false }
  ]
};

let data = JSON.parse(localStorage.getItem("emsPlannerData")) || defaultData;

function save() {
  localStorage.setItem("emsPlannerData", JSON.stringify(data));
  renderAll();
}

function percent(done, goal) {
  if (!goal) return 0;
  return Math.min(100, Math.round((done / goal) * 100));
}

function totalHours(category) {
  return category.activities.reduce((sum, a) => sum + Number(a.hours || 0), 0);
}

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

function removeById(collection, id) {
  if (!confirm("Are you sure you want to delete this?")) return;
  data[collection] = data[collection].filter(item => item.id !== id);
  save();
}

function safeConfirmDelete(message = "Are you sure you want to delete this?") {
  return confirm(message);
}

function toggleEdit(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("open");
}

const sidebar = document.getElementById("sidebar");
document.getElementById("mobileMenu").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.page).classList.add("active");
    sidebar.classList.remove("open");
  });
});

document.getElementById("categoryForm").addEventListener("submit", e => {
  e.preventDefault();
  data.categories.push({
    id: crypto.randomUUID(),
    name: categoryName.value,
    goal: Number(categoryGoal.value),
    activities: []
  });
  e.target.reset();
  save();
});

document.getElementById("activityForm").addEventListener("submit", e => {
  e.preventDefault();
  const category = data.categories.find(c => c.id === activityCategory.value);
  category.activities.push({
    id: crypto.randomUUID(),
    name: activityName.value,
    date: activityDate.value,
    hours: Number(activityHours.value),
    notes: activityNotes.value
  });
  e.target.reset();
  save();
});

document.getElementById("timelineForm").addEventListener("submit", e => {
  e.preventDefault();
  data.timeline.push({
    id: crypto.randomUUID(),
    title: timelineTitle.value,
    date: timelineDate.value,
    type: timelineType.value,
    notes: timelineNotes.value
  });
  e.target.reset();
  save();
});

document.getElementById("moduleForm").addEventListener("submit", e => {
  e.preventDefault();
  data.modules.push({
    id: crypto.randomUUID(),
    name: moduleName.value,
    term: moduleTerm.value,
    assignments: []
  });
  e.target.reset();
  save();
});

document.getElementById("assignmentForm").addEventListener("submit", e => {
  e.preventDefault();
  const module = data.modules.find(m => m.id === assignmentModule.value);
  module.assignments.push({
    id: crypto.randomUUID(),
    name: assignmentName.value,
    mark: Number(assignmentMark.value),
    weight: Number(assignmentWeight.value),
    date: assignmentDate.value
  });
  e.target.reset();
  save();
});

document.getElementById("visionForm").addEventListener("submit", e => {
  e.preventDefault();
  const file = visionImageFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    data.vision.push({
      id: crypto.randomUUID(),
      title: visionTitle.value,
      image: reader.result,
      quote: visionQuote.value
    });
    e.target.reset();
    save();
  };
  reader.readAsDataURL(file);
});

document.getElementById("affirmationForm").addEventListener("submit", e => {
  e.preventDefault();
  data.affirmations.push({
    id: crypto.randomUUID(),
    date: affirmationDate.value,
    text: newAffirmation.value
  });
  e.target.reset();
  save();
});

document.getElementById("shuffleAffirmation").addEventListener("click", renderRandomAffirmation);

document.getElementById("resourceForm").addEventListener("submit", e => {
  e.preventDefault();
  data.resources.push({
    id: crypto.randomUUID(),
    title: resourceTitle.value,
    url: resourceUrl.value,
    notes: resourceNotes.value
  });
  e.target.reset();
  save();
});

document.getElementById("goalForm").addEventListener("submit", e => {
  e.preventDefault();
  data.goals.push({
    id: crypto.randomUUID(),
    text: goalText.value,
    dueDate: goalDueDate.value,
    category: goalCategory.value,
    importance: goalImportance.value,
    done: false
  });
  e.target.reset();
  save();
});

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
  dashClassification.textContent = moduleAverage ? classifyUK(Number(moduleAverage)) : "—";

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
  assignmentModule.innerHTML = data.modules.map(m => `<option value="${m.id}">${m.name} — ${m.term}</option>`).join("");

  const average = averageOfModuleTotals();
  moduleAverageDisplay.textContent = average ? `${average}%` : "—";
  classificationDisplay.textContent = average ? `Classification: ${classifyUK(Number(average))}` : "Classification: —";

  const grouped = {};
  data.modules.forEach(m => {
    grouped[m.term] ||= [];
    grouped[m.term].push(m);
  });

  moduleList.innerHTML = Object.keys(grouped).sort().map(term => `
    <h3>${term}</h3>
    ${grouped[term].map(module => {
      const total = moduleTotal(module);
      const totalWeight = (module.assignments || []).reduce((sum, a) => sum + Number(a.weight || 0), 0);
      return `
        <div class="category-card">
          <div class="item-header">
            <div>
              <h3>${module.name}</h3>
              <div class="module-summary">
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
              ${["Term 1", "Term 2", "Term 3"].map(option => `<option ${option === module.term ? "selected" : ""}>${option}</option>`).join("")}
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
    }).join("")}
  `).join("");
}

function updateModule(id) {
  const module = data.modules.find(m => m.id === id);
  module.name = document.getElementById(`module-name-${id}`).value;
  module.term = document.getElementById(`module-term-${id}`).value;
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

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderAll() {
  renderDashboard();
  renderActivities();
  renderTimeline();
  renderModules();
  renderVision();
  renderAffirmations();
  renderResources();
  renderGoals();
}

renderAll();
