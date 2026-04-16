// ============================================================
// utils.js — Shared helper functions
// ============================================================

// ── Date formatting ──
export function formatDate(timestamp) {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric"
  });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export function formatTime(timestamp) {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
}

// ── Time-ago label ──
export function timeAgo(timestamp) {
  if (!timestamp) return "";
  const date  = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff  = (Date.now() - date.getTime()) / 1000; // seconds
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Countdown until due (returns { hours, minutes, seconds, isOverdue }) ──
export function getCountdown(dueTimestamp) {
  if (!dueTimestamp) return null;
  const due   = dueTimestamp.toDate ? dueTimestamp.toDate() : new Date(dueTimestamp);
  const diffMs = due.getTime() - Date.now();
  const isOverdue = diffMs < 0;
  const abs   = Math.abs(diffMs);
  const hours   = Math.floor(abs / 3600000);
  const minutes = Math.floor((abs % 3600000) / 60000);
  const seconds = Math.floor((abs % 60000) / 1000);
  return { hours, minutes, seconds, isOverdue };
}

// ── Status badge HTML ──
export function statusBadge(status) {
  const map = {
    available: "badge-available",
    borrowed:  "badge-borrowed",
    overdue:   "badge-overdue"
  };
  const cls = map[status] || "badge-available";
  return `<span class="badge ${cls}">${capitalize(status)}</span>`;
}

// ── Checkout status badge ──
export function checkoutBadge(status) {
  const map = {
    active:   "badge-borrowed",
    returned: "badge-available",
    overdue:  "badge-overdue"
  };
  const cls = map[status] || "badge-borrowed";
  return `<span class="badge ${cls}">${capitalize(status)}</span>`;
}

// ── Capitalize first letter ──
export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Get initials from full name ──
export function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── Sanitize plain-text input ──
export function sanitize(str = "") {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

// ── Generate simple unique ID ──
export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── EmailJS integration ──
// Setup: https://www.emailjs.com/
// Replace SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY with your own.
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

export async function sendCheckoutEmail({ toName, toEmail, dueTime, laptopId }) {
  // EmailJS must be loaded as a script tag in the HTML page
  if (typeof emailjs === "undefined") return;
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    { to_name: toName, to_email: toEmail, due_time: dueTime, laptop_id: laptopId },
    EMAILJS_PUBLIC_KEY
  );
}

// ── Debounce ──
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── Filter laptops by search term + status ──
export function filterLaptops(laptops, { search = "", status = "" }) {
  return laptops.filter(l => {
    const matchSearch = !search ||
      l.laptopName?.toLowerCase().includes(search.toLowerCase()) ||
      l.brand?.toLowerCase().includes(search.toLowerCase()) ||
      l.model?.toLowerCase().includes(search.toLowerCase()) ||
      l.serialNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || l.status === status;
    return matchSearch && matchStatus;
  });
}
