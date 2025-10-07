// firebase.js - Cấu hình Firebase cho React/Web
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Copy config này từ Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBNLqjp5YLuHGtlGWs_0B59D_6e7hxFSfg",
  authDomain: "ecommerce-c4fc9.firebaseapp.com",
  projectId: "ecommerce-c4fc9",
  storageBucket: "ecommerce-c4fc9.firebasestorage.app",
  messagingSenderId: "331529491522",
  appId: "1:331529491522:web:34d97920434cf61b6809db",
  measurementId: "G-123PZZM9KB"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export default app
export default app;
