const sidebar = document.getElementById("sidebar");
document.getElementById("mobileMenu").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

export function openPage(pageName) {
  document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  const navButton = document.querySelector(`.nav-link[data-page="${pageName}"]`);
  const page = document.getElementById(pageName);

  if (!page) return;

  if (navButton) {
  navButton.classList.add("active");
  }
  
  page.classList.add("active");
  sidebar.classList.remove("open");

  localStorage.setItem("emsPlannerCurrentPage", pageName);
}

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => {
    openPage(button.dataset.page);
  });
});

document.querySelector(".settings-button").addEventListener("click", () => {
  openPage("settings");
});
