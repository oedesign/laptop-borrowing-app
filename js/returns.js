// ============================================================
// returns.js — Handle laptop returns
// ============================================================

import {
  doc, updateDoc, serverTimestamp, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db, COLLECTIONS } from "./firebaseConfig.js";
import { updateLaptop }    from "./laptops.js";
import { STATUS }          from "./laptops.js";

// ── Return a laptop ──
// laptopId  — Firestore document ID
// checkoutId — active checkout record ID (stored on laptop doc)
export async function returnLaptop(laptopId, checkoutId) {
  const now = serverTimestamp();

  // 1. Update the checkout record
  if (checkoutId) {
    await updateDoc(doc(db, COLLECTIONS.CHECKOUTS, checkoutId), {
      status:     "returned",
      returnTime: now
    });
  }

  // 2. Reset the laptop document
  await updateLaptop(laptopId, {
    status:           STATUS.AVAILABLE,
    borrowerName:     null,
    borrowerId:       null,
    checkoutTime:     null,
    dueTime:          null,
    returnTime:       now,
    activeCheckoutId: null
  });
}

// ── Fetch checkout record for a specific laptop (active) ──
export async function getActiveCheckout(checkoutId) {
  if (!checkoutId) return null;
  const snap = await getDoc(doc(db, COLLECTIONS.CHECKOUTS, checkoutId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
