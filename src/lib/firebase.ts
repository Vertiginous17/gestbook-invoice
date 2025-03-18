// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration (replace with your Firebase project's config)
const firebaseConfig = {
    apiKey: "AIzaSyA-vitwmV4jbSCn04R1UxYzfy_7Xymcwl8",
    authDomain: "gestbook-6efa0.firebaseapp.com",
    projectId: "gestbook-6efa0",
    storageBucket: "gestbook-6efa0.firebasestorage.app",
    messagingSenderId: "418715375433",
    appId: "1:418715375433:web:dd7da4373b7a1b88daec98",
    measurementId: "G-1X510LNE0J"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export { signInWithEmailAndPassword };
