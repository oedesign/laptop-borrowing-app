// ============================================================
// history.js — Borrowing history queries
// ============================================================

import {
  collection, query,
  where, orderBy, limit,
  getDocs, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db, COLLECTIONS } from "./firebaseConfig.js";

// ── Fetch history for a specific user ──
export async function getUserHistory(userId, maxRecords = 50) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.CHECKOUTS),
      where("userId", "==", userId),
      orderBy("checkoutTime", "desc"),
      limit(maxRecords)
    )
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Fetch ALL checkouts (admin) ──
export async function getAllHistory(maxRecords = 100) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.CHECKOUTS),
      orderBy("checkoutTime", "desc"),
      limit(maxRecords)
    )
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Real-time listener: user history ──
export function onUserHistoryChange(userId, callback) {
  return onSnapshot(
    query(
      collection(db, COLLECTIONS.CHECKOUTS),
      where("userId", "==", userId),
      orderBy("checkoutTime", "desc"),
      limit(50)
    ),
    (snap) => {
      const records = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(records);
    }
  );
}

// ── Real-time listener: all checkouts (admin) ──
export function onAllHistoryChange(callback) {
  return onSnapshot(
    query(
      collection(db, COLLECTIONS.CHECKOUTS),
      orderBy("checkoutTime", "desc"),
      limit(100)
    ),
    (snap) => {
      const records = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(records);
    }
  );
}

// ── Get active (non-returned) checkouts ──
export async function getActiveCheckouts() {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.CHECKOUTS),
      where("status", "==", "active"),
      orderBy("checkoutTime", "desc")
    )
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
