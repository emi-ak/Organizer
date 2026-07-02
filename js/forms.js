import { getData } from "./state.js";

const data = getData();

document.getElementById("categoryForm").addEventListener("submit", e => {
  e.preventDefault();
  data.categories.push({
    id: crypto.randomUUID(),
    name: categoryName.value,
    goal: Number(categoryGoal.value),
    activities: []
  });
  e.target.reset();
  e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
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
  e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
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
  e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
  save();
});

document.getElementById("moduleForm").addEventListener("submit", e => {
  e.preventDefault();
  data.modules.push({
    id: crypto.randomUUID(),
    name: moduleName.value,
    term: moduleTerm.value,
    year: moduleYear.value,
    assignments: []
  });
  e.target.reset();
  e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
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
  e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
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
    e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
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
  e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
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
  e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
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
  e.target.querySelectorAll("input, textarea, select").forEach(field => {
  localStorage.removeItem(`draft-${field.id}`);
});
  save();
});

const draftFields = document.querySelectorAll("input, textarea, select");

draftFields.forEach(field => {
  if (!field.id) return;

  const savedValue = localStorage.getItem(`draft-${field.id}`);
  if (savedValue !== null) field.value = savedValue;

  field.addEventListener("input", () => {
    localStorage.setItem(`draft-${field.id}`, field.value);
  });

  field.addEventListener("change", () => {
    localStorage.setItem(`draft-${field.id}`, field.value);
  });
});
