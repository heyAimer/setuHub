// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from '@react-native-firebase/app';
console.log('Firebase module loading…');
const firebaseConfig = {
  apiKey: "AIzaSyBp-i_4qe1X8ee6RSuUiUAolFcM5mMAswY",
  authDomain: "setuhub-fb547.firebaseapp.com",
  databaseURL: "https://setuhub-fb547-default-rtdb.firebaseio.com",
  projectId: "setuhub-fb547",
  storageBucket: "setuhub-fb547.firebasestorage.app",
  messagingSenderId: "916653760633",
  appId: "1:916653760633:web:67579880260b0151be74a8",
  measurementId: "G-ELKWZKC2R3"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  const err = e && typeof e === 'object' ? e : { message: String(e) };

  if (err.message?.includes('already exists') || err.code === 'app/duplicate-app') {
    app = getApp();
    console.log('firebase already exist ')
  } else {
    console.error('Firebase initialization error:', err);
    throw err;
  }
}

export default app;