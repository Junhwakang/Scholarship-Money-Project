// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);