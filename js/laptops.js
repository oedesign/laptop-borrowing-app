// ============================================================
// laptops.js — Laptop CRUD + real-time listeners
// ============================================================

import {
  collection, doc,
  addDoc, setDoc, updateDoc, deleteDoc,
  getDoc, getDocs, query, where, orderBy,
  onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db, COLLECTIONS } from "./firebaseConfig.js";

export const STATUS = {
  AVAILABLE: "available",
  BORROWED:  "borrowed",
  OVERDUE:   "overdue"
};

// ── Add a new laptop (admin) ──
export async function addLaptop({ laptopName, brand, model, serialNumber = "", notes = "" }) {
  return await addDoc(collection(db, COLLECTIONS.LAPTOPS), {
    laptopName,
    brand,
    model,
    serialNumber,
    notes,
    status: STATUS.AVAILABLE,
    borrowerName:  null,
    borrowerId:    null,
    checkoutTime:  null,
    dueTime:       null,
    returnTime:    null,
    activeCheckoutId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

// ── Update laptop details (admin) ──
export async function updateLaptop(laptopId, data) {
  await updateDoc(doc(db, COLLECTIONS.LAPTOPS, laptopId), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

// ── Delete a laptop (admin) ──
export async function deleteLaptop(laptopId) {
  await deleteDoc(doc(db, COLLECTIONS.LAPTOPS, laptopId));
}

// ── Fetch single laptop ──
export async function getLaptop(laptopId) {
  const snap = await getDoc(doc(db, COLLECTIONS.LAPTOPS, laptopId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── Fetch all laptops (one-time) ──
export async function getAllLaptops() {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.LAPTOPS), orderBy("laptopName"))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Fetch laptops by status ──
export async function getLaptopsByStatus(status) {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.LAPTOPS), where("status", "==", status))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Real-time listener: all laptops ──
export function onLaptopsChange(callback) {
  return onSnapshot(
    query(collection(db, COLLECTIONS.LAPTOPS), orderBy("laptopName")),
    (snap) => {
      const laptops = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(laptops);
    }
  );
}

// ── Real-time listener: single laptop ──
export function onLaptopChange(laptopId, callback) {
  return onSnapshot(doc(db, COLLECTIONS.LAPTOPS, laptopId), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

// ── Mark overdue laptops (run periodically) ──
export async function syncOverdueStatus() {
  const now = new Date();
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.LAPTOPS),
      where("status", "==", STATUS.BORROWED)
    )
  );

  const updates = [];
  snap.docs.forEach(d => {
    const data = d.data();
    if (data.dueTime && data.dueTime.toDate() < now) {
      updates.push(
        updateDoc(doc(db, COLLECTIONS.LAPTOPS, d.id), { status: STATUS.OVERDUE, updatedAt: serverTimestamp() })
      );
    }
  });
  await Promise.all(updates);
  return updates.length; // number of laptops marked overdue
}

// ── Get stats counts ──
export async function getLaptopStats() {
  const all = await getAllLaptops();
  return {
    total:     all.length,
    available: all.filter(l => l.status === STATUS.AVAILABLE).length,
    borrowed:  all.filter(l => l.status === STATUS.BORROWED).length,
    overdue:   all.filter(l => l.status === STATUS.OVERDUE).length
  };
}
