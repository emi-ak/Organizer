import { startAuth } from "./auth.js";
import { setCurrentUser, loadPlanner } from "./database.js";
import { defaultData } from "./data.js";
import { setData } from "./state.js";

import { renderAll } from "./renderall.js?v=3";
import { openPage } from "./navigation.js";

import { toggleEdit, removeById } from "./utils.js";
import { updateActivity, updateCategory, deleteCategory, deleteActivity } from "./activities.js";
import { updateTimeline } from "./timeline.js";
import { updateModule, updateAssignment, deleteAssignment } from "./coursework.js";
import { updateAffirmation } from "./affirmation.js";
import { updateResource } from "./resources.js";
import { updateGoal, toggleGoal } from "./todo.js";

import "./theme.js";
import "./forms.js";
import "./dashboard.js?v=3";
import "./vision.js";

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

  const loadedData = await loadPlanner(defaultData);

  loadedData.modules = (loadedData.modules || []).map(module => ({
    ...module,
    year: module.year || "Year 1"
  }));

  setData(loadedData);

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