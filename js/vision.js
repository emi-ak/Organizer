export function renderVision() {
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

export function enableVisionDragDrop() {
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
