import { auth, provider } from "./firebase.js";

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

export function startAuth(onLogin) {

    const loginBtn = document.getElementById("loginButton");
    const logoutBtn = document.getElementById("logoutButton");

    loginBtn.onclick = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            alert(err.message);
        }
    };

    logoutBtn.onclick = () => signOut(auth);

    onAuthStateChanged(auth, user => {

        if(user){

            loginBtn.style.display="none";
            logoutBtn.style.display="block";

            onLogin(user);

        }else{

            loginBtn.style.display="block";
            logoutBtn.style.display="none";

        }

    });

}
