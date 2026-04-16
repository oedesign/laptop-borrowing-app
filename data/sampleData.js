// ============================================================
// data/sampleData.js — Sample Firestore seed data
// ============================================================
// Run this script ONCE to populate your Firestore database
// with sample laptops for testing.
//
// HOW TO USE:
//   1. Make sure firebaseConfig.js has your real credentials.
//   2. Open your app in a browser and open DevTools console.
//   3. Import and call: seedLaptops()
//   OR temporarily add a "Seed DB" button that calls this.
// ============================================================

import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db, COLLECTIONS } from "../js/firebaseConfig.js";

export const SAMPLE_LAPTOPS = [
  { laptopName: "Laptop 01", brand: "Dell",    model: "Inspiron 15",    serialNumber: "DL-001-2024", notes: "Charger included.", status: "available" },
  { laptopName: "Laptop 02", brand: "HP",      model: "Pavilion 14",    serialNumber: "HP-002-2024", notes: "Screen has minor scratch.", status: "available" },
  { laptopName: "Laptop 03", brand: "Lenovo",  model: "ThinkPad E14",   serialNumber: "LV-003-2024", notes: "", status: "available" },
  { laptopName: "Laptop 04", brand: "Acer",    model: "Aspire 5",       serialNumber: "AC-004-2024", notes: "No USB-C port.", status: "available" },
  { laptopName: "Laptop 05", brand: "Apple",   model: "MacBook Air M1", serialNumber: "AP-005-2024", notes: "Students love this one.", status: "available" },
  { laptopName: "Laptop 06", brand: "Dell",    model: "Latitude 5520",  serialNumber: "DL-006-2024", notes: "Admin laptop — for demo.", status: "available" },
  { laptopName: "Laptop 07", brand: "Asus",    model: "VivoBook 15",    serialNumber: "AS-007-2024", notes: "", status: "available" },
  { laptopName: "Laptop 08", brand: "Samsung", model: "Galaxy Book 2",  serialNumber: "SM-008-2024", notes: "Touchscreen enabled.", status: "available" },
];

export async function seedLaptops() {
  console.log("🌱 Seeding laptops into Firestore…");
  for (const laptop of SAMPLE_LAPTOPS) {
    await addDoc(collection(db, COLLECTIONS.LAPTOPS), {
      ...laptop,
      borrowerName:     null,
      borrowerId:       null,
      checkoutTime:     null,
      dueTime:          null,
      returnTime:       null,
      activeCheckoutId: null,
      createdAt:        serverTimestamp(),
      updatedAt:        serverTimestamp()
    });
    console.log(`  ✅ Added: ${laptop.laptopName}`);
  }
  console.log("🎉 Seeding complete! Refresh your dashboard.");
}
