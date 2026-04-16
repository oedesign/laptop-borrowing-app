// ============================================================
// auth.js — Authentication: register, login, logout, guards
// ============================================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { auth, db, COLLECTIONS } from "./firebaseConfig.js";
import { showToast } from "./ui.js";

// ── Current user cache (populated by onAuthStateChanged) ──
let currentUser = null;
let currentProfile = null;

// ── Observer: fires whenever auth state changes ──
export function initAuthObserver(callback) {
  return onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      currentProfile = await getUserProfile(user.uid);
    } else {
      currentProfile = null;
    }
    if (callback) callback(user, currentProfile);
  });
}

// ── Register a new user ──
export async function registerUser({ firstName, lastName, email, password, role = "student" }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: `${firstName} ${lastName}` });

  await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
    uid: user.uid,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    email,
    role,
    createdAt: serverTimestamp(),
    borrowingCount: 0
  });

  return user;
}

// ── Login ──
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// ── Logout ──
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "./login.html";
}

// ── Fetch user profile from Firestore ──
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? snap.data() : null;
}

// ── Get cached current user & profile ──
export function getCurrentUser() {
  return currentUser;
}

export function getCurrentProfile() {
  return currentProfile;
}

// ── Route guards ──
export function requireAuth(onReady) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "./login.html";
      return;
    }
    const profile = await getUserProfile(user.uid);
    currentUser = user;
    currentProfile = profile;
    if (onReady) onReady(user, profile);
  });
}

// Call on admin-only pages
export function requireAdmin(onReady) {
  requireAuth(async (user, profile) => {
    if (profile?.role !== "admin") {
      showToast("Access denied: Admin only.", "error");
      window.location.href = "./dashboard.html";
      return;
    }
    if (onReady) onReady(user, profile);
  });
}

// Redirect already-logged-in users away from login/register
export function redirectIfAuthed(redirectTo = "./dashboard.html") {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = redirectTo;
  });
}