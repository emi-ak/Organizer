import { getData } from "./state.js";
import { save } from "./save.js";
import { escapeHTML, toggleEdit, removeById } from "./utils.js";

export function importanceRank(value) {
  return { High: 0, Medium: 1, Low: 2 }[value] ?? 3;
}

export function importanceClass(value) {
  if (value === "High") return "importance-high";
  if (value === "Medium") return "importance-medium";
  return "importance-low";
}

export function renderGoals() {
  const data = getData();
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

export function updateGoal(id) {
  const data = getData();
  const goal = data.goals.find(g => g.id === id);
  goal.text = document.getElementById(`goal-text-${id}`).value;
  goal.dueDate = document.getElementById(`goal-date-${id}`).value;
  goal.category = document.getElementById(`goal-category-${id}`).value;
  goal.importance = document.getElementById(`goal-importance-${id}`).value;
  save();
}

export function toggleGoal(id) {
  const data = getData();
  const goal = data.goals.find(g => g.id === id);
  goal.done = !goal.done;
  save();
}
