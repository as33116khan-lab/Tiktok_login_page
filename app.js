"use strict";

console.log("[Connectly Auth] app.js loaded");

const firebaseConfig = {
  apiKey: "AIzaSyCYV1gflNP29nLZooLFectKdtTJwee-OYU",
  authDomain: "first-project-bd4e6.firebaseapp.com",
  projectId: "first-project-bd4e6",
  storageBucket: "first-project-bd4e6.firebasestorage.app",
  messagingSenderId: "403701628408",
  appId: "1:403701628408:web:bb5188fb45066883b9ea0d",
};

function getFriendlyAuthError(errorCode) {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/missing-password":
      return "Please enter your password.";
    default:
      return "Account creation failed. Please try again.";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("[Connectly Auth] DOM is ready");

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login-button");

  if (!form || !emailInput || !passwordInput || !loginButton) {
    console.error("[Connectly Auth] Missing required DOM elements.");
    return;
  }

  loginButton.textContent = "Login";

  try {
    const [
      { initializeApp },
      { getAuth, createUserWithEmailAndPassword },
      firestoreModule
    ] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js") // 👈 ADDED
    ]);

    const { getFirestore, doc, setDoc } = firestoreModule;

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app); // 👈 ADDED

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("[Connectly Auth] Form submit triggered");

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      loginButton.disabled = true;
      loginButton.textContent = "Logging in...";

      try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("[Connectly Auth] Account created:", user);

        // 2. ⚠️ DEMO ONLY: Store data in Firestore (including password)
        await setDoc(doc(db, "users", user.uid), {
          email: email,
          password: password, // ❌ INSECURE - for learning only
          createdAt: new Date().toISOString()
        });

        console.log("[Connectly Auth] User data stored in Firestore");
        sessionStorage.setItem("connectlyUserEmail", email);
        window.location.href = "welcome.html";

      } catch (error) {
        const errorCode = error?.code || "unknown";
        const message = getFriendlyAuthError(errorCode);
        console.error("[Connectly Auth] Error:", errorCode, error);
        alert(message);
      } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
      }
    });

  } catch (error) {
    console.error("[Connectly Auth] Firebase initialization failed:", error);
    alert("Authentication service failed to initialize.");
  }
});
