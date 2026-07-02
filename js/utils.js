export function percent(done, goal) {
  if (!goal) return 0;
  return Math.min(100, Math.round((done / goal) * 100));
}

export function totalHours(category) {
  return category.activities.reduce((sum, a) => sum + Number(a.hours || 0), 0);
}

export function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function safeConfirmDelete(message = "Are you sure you want to delete this?") {
  return confirm(message);
}

export function toggleEdit(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("open");
}

export function removeById(collection, id) {
  if (!confirm("Are you sure you want to delete this?")) return;
  data[collection] = data[collection].filter(item => item.id !== id);
  save();
}
