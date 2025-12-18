import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlTJbhXjKY6fNut9F5IQCP1KZga0oipPQ",
  authDomain: "scholarship-d07ce.firebaseapp.com",
  projectId: "scholarship-d07ce",
  storageBucket: "scholarship-d07ce.firebasestorage.app",
  messagingSenderId: "148935177422",
  appId: "1:148935177422:web:92b36b8d57c492e3080c9f",
  measurementId: "G-MFQP0735FY"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
