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
