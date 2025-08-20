// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbw9WbD_gD2yN8gJWHSBf70CLPqIMngfM",
  authDomain: "biolift-c37b6.firebaseapp.com",
  projectId: "biolift-c37b6",
  storageBucket: "biolift-c37b6.firebasestorage.app",
  messagingSenderId: "443785476619",
  appId: "1:443785476619:web:a3eea7773557c5ee72e50e",
  measurementId: "G-CCJ064E8MH",
  databaseURL: "https://biolift-c37b6-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
