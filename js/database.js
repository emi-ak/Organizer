import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  enableNetwork,
  disableNetwork
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user;
}

export async function loadPlanner(defaultData) {
  if (!currentUser) return defaultData;

  const ref = doc(db, "users", currentUser.uid, "planner", "data");
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data().plannerData || defaultData;
  }

  const starterData = defaultData;

  await setDoc(ref, {
    plannerData: starterData,
    updatedAt: new Date().toISOString()
  });

  return starterData;
}

export async function savePlanner(data) {
  if (!currentUser) return;

  const ref = doc(db, "users", currentUser.uid, "planner", "data");

  await setDoc(ref, {
    plannerData: data,
    updatedAt: new Date().toISOString()
  });
}
