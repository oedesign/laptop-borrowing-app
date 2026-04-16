// ============================================================
// firebaseConfig.js — Firebase project configuration
// ============================================================
// SETUP INSTRUCTIONS:
//  1. Go to https://console.firebase.google.com/
//  2. Create a new project (or use existing).
//  3. Register a Web App under Project Settings → General.
//  4. Copy the firebaseConfig object values into the fields below.
//  5. Enable Authentication → Email/Password in Firebase console.
//  6. Enable Firestore Database and set rules (see bottom of file).
//  7. (Optional) Set up EmailJS at https://www.emailjs.com/
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⚠️  REPLACE these values with your own Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyA_zWXuzN7b3gXfDrL_YTO3GbmT323OMYw",
  authDomain: "laptop-borrowing.firebaseapp.com",
  projectId: "laptop-borrowing",
  storageBucket: "laptop-borrowing.firebasestorage.app",
  messagingSenderId: "400366292031",
  appId: "1:400366292031:web:777a607082a1e88ca9fc8a",
  // measurementId: "G-F9T2BBWV4L"
};


const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ============================================================
// Firestore Collection Names (centralised — change once here)
// ============================================================
export const COLLECTIONS = {
  USERS:     "users",
  LAPTOPS:   "laptops",
  CHECKOUTS: "checkouts"
};

// ============================================================
// Firestore Security Rules (paste into Firebase console)
// ============================================================
/*

*/
