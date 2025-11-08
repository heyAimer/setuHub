// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBp-i_4qe1X8ee6RSuUiUAolFcM5mMAswY",
  authDomain: "setuhub-fb547.firebaseapp.com",
  projectId: "setuhub-fb547",
  storageBucket: "setuhub-fb547.firebasestorage.app",
  messagingSenderId: "916653760633",
  appId: "1:916653760633:web:67579880260b0151be74a8",
  measurementId: "G-ELKWZKC2R3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };