import { auth, provider } from "./firebase.js";
import { loadPlanner } from "./database.js";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

export function startAuth(onLogin) {
  const authScreen = document.getElementById("authScreen");
  const loginBtn = document.getElementById("loginButton");
  const logoutBtn = document.getElementById("logoutButton");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");

  loginBtn.onclick = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert(err.message);
    }
  };

  logoutBtn.onclick = () => signOut(auth);

  onAuthStateChanged(auth, user => {
    if (user) {
      authScreen.classList.add("hidden");

      userName.textContent = user.displayName || "Welcome back";
      userEmail.textContent = user.email || "";

      onLogin(user);
    } else {
      authScreen.classList.remove("hidden");
    }
  });
}

startAuth(async (user) => {
  console.log("Signed in as:", user.email);

  setCurrentUser(user);
  data = await loadPlanner(defaultData);

  data.modules = (data.modules || []).map(module => ({
    ...module,
    year: module.year || "Year 1"
  }));

  renderAll();
  openPage(localStorage.getItem("emsPlannerCurrentPage") || "dashboard");
});
