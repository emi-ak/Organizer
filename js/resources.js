import { getData } from "./state.js";
import { save } from "./save.js";
import { escapeHTML, toggleEdit, removeById } from "./utils.js";

export function renderResources() {
  const data = getData();
  resourceList.innerHTML = data.resources.map(r => `
    <div class="item">
      <h3>${
        r.url
          ? `<a href="${escapeHTML(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(r.title)}</a>`
          : escapeHTML(r.title)
      }</h3>
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

export function updateResource(id) {
  const data = getData();
  const resource = data.resources.find(r => r.id === id);
  resource.title = document.getElementById(`resource-title-${id}`).value;
  resource.url = document.getElementById(`resource-url-${id}`).value;
  resource.notes = document.getElementById(`resource-notes-${id}`).value;
  save();
}
