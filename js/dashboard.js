import { percent, totalHours } from "./utils.js";
import { getData, getClassificationVisible } from "./state.js";
import { averageOfModuleTotals, classifyUK } from "./coursework.js";

export function ringHTML(name, done, goal) {
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

export function renderDashboard() {
  const data = getData();
  const completedHours = data.categories.reduce((sum, c) => sum + totalHours(c), 0);
  const goalHours = data.categories.reduce((sum, c) => sum + Number(c.goal || 0), 0);
  const moduleAverage = averageOfModuleTotals();

  dashTotalHours.textContent = completedHours;
  dashActivityProgress.textContent = `${percent(completedHours, goalHours)}%`;
  dashModules.textContent = data.modules.length;
  
  const classification = moduleAverage ? classifyUK(Number(moduleAverage)) : "—";
  
  dashClassification.textContent =
    getClassificationVisible() ? classification : "";

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
