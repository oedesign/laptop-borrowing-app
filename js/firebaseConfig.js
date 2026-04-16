// ============================================================
// firebaseConfig.js — Firebase project configuration
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_zWXuzN7b3gXfDrL_YTO3GbmT323OMYw",
  authDomain: "laptop-borrowing.firebaseapp.com",
  projectId: "laptop-borrowing",
  storageBucket: "laptop-borrowing.firebasestorage.app",
  messagingSenderId: "400366292031",
  appId: "1:400366292031:web:777a607082a1e88ca9fc8a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const COLLECTIONS = {
  USERS: "users",
  LAPTOPS: "laptops",
  CHECKOUTS: "checkouts"
};