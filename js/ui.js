// ============================================================
// ui.js — Reusable DOM helpers, toast, modals, sidebar
// ============================================================

// ── Toast notifications ──
export function showToast(message, type = "default", duration = 3500) {
  const container = document.getElementById("toast-container")
    || createToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = { success: "✅", error: "❌", warning: "⚠️", default: "ℹ️" }[type] || "ℹ️";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut .3s ease forwards";
    toast.addEventListener("animationend", () => toast.remove());
  }, duration);
}

function createToastContainer() {
  const div = document.createElement("div");
  div.id = "toast-container";
  document.body.appendChild(div);
  return div;
}

// ── Modal helpers ──
export function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
}

export function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
}

export function initModals() {
  // Close modals when clicking overlay
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });
  // Close buttons
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal-overlay")?.classList.remove("open");
    });
  });
}

// ── Page loader ──
export function hideLoader() {
  const loader = document.getElementById("page-loader");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 400);
  }
}

export function showLoader() {
  const loader = document.getElementById("page-loader");
  if (loader) loader.classList.remove("hidden");
}

// ── Sidebar (mobile) ──
export function initSidebar() {
  const toggle  = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay?.classList.toggle("show");
  });

  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });
}

// ── Populate sidebar user info ──
export function setSidebarUser(profile) {
  if (!profile) return;
  const nameEl = document.querySelector(".sidebar-user .user-name");
  const roleEl = document.querySelector(".sidebar-user .user-role");
  const avatarEl = document.querySelector(".sidebar-user .avatar");
  if (nameEl) nameEl.textContent = profile.displayName || profile.firstName;
  if (roleEl) roleEl.textContent = profile.role === "admin" ? "Administrator" : "Student";
  if (avatarEl) avatarEl.textContent = getInitials(profile.displayName || profile.firstName);
}

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── Set active nav link ──
export function setActiveNav(page) {
  document.querySelectorAll(".nav-link, .bottom-nav-link").forEach(a => {
    a.classList.toggle("active", a.dataset.page === page);
  });
}

// ── Render stat cards ──
export function updateStats({ total, available, borrowed, overdue }) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set("stat-total",     total     ?? "—");
  set("stat-available", available ?? "—");
  set("stat-borrowed",  borrowed  ?? "—");
  set("stat-overdue",   overdue   ?? "—");
}

// ── Loading state on buttons ──
export function setButtonLoading(btn, loading, originalText = null) {
  if (loading) {
    btn._originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> Loading...`;
    btn.disabled = true;
  } else {
    btn.innerHTML = originalText || btn._originalText || "Submit";
    btn.disabled = false;
  }
}

// ── Confirm dialog (simple) ──
export function confirmAction(message) {
  return window.confirm(message);
}

// ── Render empty state ──
export function renderEmpty(container, { icon = "💻", title = "Nothing here", message = "" } = {}) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
}

// ── Highlight search matches ──
export function highlight(text, term) {
  if (!term) return text;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(re, "<mark>$1</mark>");
}

// ── Build a countdown display HTML ──
export function countdownHTML(countdown) {
  if (!countdown) return "";
  const { hours, minutes, seconds, isOverdue } = countdown;
  return `
    <div class="countdown-box ${isOverdue ? "overdue" : ""}">
      <div class="countdown-label">${isOverdue ? "⚠️ Overdue by" : "⏱ Due in"}</div>
      <div class="countdown-digits">
        <div class="countdown-unit">
          <span class="countdown-num" id="cd-hours">${String(hours).padStart(2,"0")}</span>
          <span class="countdown-unit-label">HRS</span>
        </div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit">
          <span class="countdown-num" id="cd-mins">${String(minutes).padStart(2,"0")}</span>
          <span class="countdown-unit-label">MIN</span>
        </div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit">
          <span class="countdown-num" id="cd-secs">${String(seconds).padStart(2,"0")}</span>
          <span class="countdown-unit-label">SEC</span>
        </div>
      </div>
    </div>
  `;
}
