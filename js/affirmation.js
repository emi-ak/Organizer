import { getData } from "./state.js";
import { save } from "./save.js";
import { escapeHTML, toggleEdit, removeById } from "./utils.js";

export function renderRandomAffirmation() {
  const data = getData();
  const random = data.affirmations[Math.floor(Math.random() * data.affirmations.length)];
  affirmationText.textContent = random ? random.text : "Add your first affirmation.";
}

export function renderAffirmations() {
  const data = getData();
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

export function updateAffirmation(id) {
  const data = getData();
  const affirmation = data.affirmations.find(a => a.id === id);
  affirmation.date = document.getElementById(`affirmation-date-${id}`).value;
  affirmation.text = document.getElementById(`affirmation-text-${id}`).value;
  save();
}

document
  .getElementById("shuffleAffirmation")
  ?.addEventListener("click", renderRandomAffirmation);
