// ============================================================
// checkout.js — Handle laptop checkout (borrow)
// ============================================================

import {
  collection, doc,
  addDoc, updateDoc,
  serverTimestamp, Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db, COLLECTIONS } from "./firebaseConfig.js";
import { updateLaptop }    from "./laptops.js";
import { STATUS }          from "./laptops.js";
import { sendCheckoutEmail } from "./utils.js";

// Default loan duration in hours
export const DEFAULT_LOAN_HOURS = 3;

// ── Checkout a laptop ──
// laptopId  — Firestore document ID of the laptop
// user      — { uid, displayName, email }
// loanHours — how many hours to lend (default 3)
export async function checkoutLaptop(laptopId, user, loanHours = DEFAULT_LOAN_HOURS) {
  const now     = new Date();
  const dueDate = new Date(now.getTime() + loanHours * 60 * 60 * 1000);

  // 1. Create checkout record
  const checkoutRef = await addDoc(collection(db, COLLECTIONS.CHECKOUTS), {
    laptopId,
    userId:        user.uid,
    borrowerName:  user.displayName,
    borrowerEmail: user.email,
    checkoutTime:  serverTimestamp(),
    dueTime:       Timestamp.fromDate(dueDate),
    returnTime:    null,
    status:        "active",    // "active" | "returned" | "overdue"
    loanHours,
    createdAt:     serverTimestamp()
  });

  // 2. Update laptop document
  await updateLaptop(laptopId, {
    status:           STATUS.BORROWED,
    borrowerName:     user.displayName,
    borrowerId:       user.uid,
    checkoutTime:     serverTimestamp(),
    dueTime:          Timestamp.fromDate(dueDate),
    returnTime:       null,
    activeCheckoutId: checkoutRef.id
  });

  // 3. Optional: send confirmation email
  try {
    await sendCheckoutEmail({
      toName:   user.displayName,
      toEmail:  user.email,
      dueTime:  dueDate.toLocaleString(),
      laptopId
    });
  } catch (e) {
    // Email failure shouldn't block checkout
    console.warn("Email send failed:", e);
  }

  return { checkoutId: checkoutRef.id, dueTime: dueDate };
}
