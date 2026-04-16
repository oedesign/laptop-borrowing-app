// ============================================================
// admin.js — Admin-specific operations
// ============================================================

import {
  collection, doc, query,
  getDocs, updateDoc, deleteDoc,
  orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db, COLLECTIONS } from "./firebaseConfig.js";
import { addLaptop, updateLaptop, deleteLaptop, getLaptopStats } from "./laptops.js";
import { returnLaptop } from "./returns.js";

export { addLaptop, updateLaptop, deleteLaptop, getLaptopStats, returnLaptop };

// ── Fetch all user profiles ──
export async function getAllUsers() {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.USERS), orderBy("firstName"))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Real-time listener: all users ──
export function onUsersChange(callback) {
  return onSnapshot(
    query(collection(db, COLLECTIONS.USERS), orderBy("firstName")),
    (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}

// ── Change a user's role ──
export async function setUserRole(userId, role) {
  await updateDoc(doc(db, COLLECTIONS.USERS, userId), { role });
}

// ── Delete a user profile from Firestore (does NOT delete Firebase Auth account) ──
export async function deleteUserProfile(userId) {
  await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
}

// ── Admin dashboard summary ──
export async function getAdminSummary() {
  const stats = await getLaptopStats();
  const usersSnap = await getDocs(collection(db, COLLECTIONS.USERS));
  const totalUsers = usersSnap.size;
  return { ...stats, totalUsers };
}
