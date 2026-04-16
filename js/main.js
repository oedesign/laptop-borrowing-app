// ============================================================
// main.js — Student Dashboard (with localStorage integration)
// ============================================================

import { requireAuth, logoutUser }   from "./auth.js";
import { onLaptopsChange }           from "./laptops.js";
import { checkoutLaptop }            from "./checkout.js";
import { returnLaptop }              from "./returns.js";
import { syncOverdueStatus }         from "./laptops.js";
import {
  showToast, hideLoader, initSidebar, initModals,
  setSidebarUser, setActiveNav, updateStats,
  setButtonLoading, renderEmpty, highlight
} from "./ui.js";
import {
  statusBadge, formatTime,
  filterLaptops, debounce
} from "./utils.js";
import {
  initTheme, saveSearchState, restoreSearchInputs,
  saveLoanHours, restoreLoanHours, loadLoanHours,
  saveUserPrefs, loadUserPrefs, clearUserPrefs,
  saveLastPage, applyTheme, loadTheme
} from "./storage.js";

// ── State ──
let allLaptops  = [];
let currentUser = null;
let currentProfile = null;

// ── Boot ──
requireAuth((user, profile) => {
  currentUser    = user;
  currentProfile = profile;

  // 1. Cache user prefs in localStorage for instant sidebar render
  saveUserPrefs(profile);
  // 2. Track last visited page
  saveLastPage("dashboard");

  if (profile?.role === "admin") {
    window.location.href = "/admin.html";
    return;
  }
  initUI();
});

function initUI() {
  // Apply saved theme immediately (localStorage → data-theme attribute)
  initTheme();

  initSidebar();
  initModals();
  setActiveNav("dashboard");
  setSidebarUser(currentProfile);
  hideLoader();

  const nameEl = document.getElementById("welcome-name");
  if (nameEl) nameEl.textContent = currentProfile?.firstName || currentUser.displayName;

  syncOverdueStatus();

  // ── Restore last search + filter state from localStorage ──
  restoreSearchInputs("search-input", "status-filter");

  // ── Real-time Firestore listener (Firebase REST/SDK = third-party API) ──
  onLaptopsChange((laptops) => {
    allLaptops = laptops;
    const searchEl = document.getElementById("search-input");
    const filterEl = document.getElementById("status-filter");
    const filtered = filterLaptops(laptops, {
      search: searchEl?.value || "",
      status: filterEl?.value || ""
    });
    renderLaptops(filtered, searchEl?.value || "");
    updateStats({
      total:     laptops.length,
      available: laptops.filter(l => l.status === "available").length,
      borrowed:  laptops.filter(l => l.status === "borrowed").length,
      overdue:   laptops.filter(l => l.status === "overdue").length
    });
  });

  // ── Search & filter → persist to localStorage on every keystroke ──
  const searchInput  = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");

  const applyFilter = debounce(() => {
    const term   = searchInput?.value  || "";
    const status = statusFilter?.value || "";
    saveSearchState({ searchTerm: term, statusFilter: status }); // localStorage write
    renderLaptops(filterLaptops(allLaptops, { search: term, status }), term);
  }, 250);

  searchInput?.addEventListener("input",   applyFilter);
  statusFilter?.addEventListener("change", applyFilter);

  // ── Theme toggle (localStorage: lt_theme) ──
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.textContent = loadTheme() === "dark" ? "☀️" : "🌙";
    themeToggle.addEventListener("click", () => {
      const next = loadTheme() === "dark" ? "light" : "dark";
      applyTheme(next);                         // saves to localStorage + applies
      themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
      showToast(`Switched to ${next} mode`, "default");
    });
  }

  // ── Logout → clear user prefs from localStorage ──
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    clearUserPrefs();
    logoutUser();
  });

  // ── Loan hours preference (localStorage: lt_loan_hours) ──
  document.getElementById("loan-hours")?.addEventListener("change", (e) => {
    saveLoanHours(parseInt(e.target.value)); // persist preference
  });

  // ── Confirm borrow ──
  document.getElementById("confirm-borrow-btn")?.addEventListener("click", async (e) => {
    const btn      = e.currentTarget;
    const laptopId = btn.getAttribute("data-laptop-id");
    const hoursEl  = document.getElementById("loan-hours");
    const hours    = parseInt(hoursEl?.value || loadLoanHours());

    saveLoanHours(hours); // remember this preference

    setButtonLoading(btn, true);
    try {
      const { dueTime } = await checkoutLaptop(laptopId, {
        uid:         currentUser.uid,
        displayName: currentUser.displayName,
        email:       currentUser.email
      }, hours);
      document.getElementById("borrow-modal")?.classList.remove("open");
      showToast(`Borrowed! Due: ${dueTime.toLocaleTimeString("en-NG", { hour:"2-digit", minute:"2-digit" })}`, "success");
    } catch (err) {
      showToast("Checkout failed: " + err.message, "error");
    } finally {
      setButtonLoading(btn, false);
    }
  });
}

// ── Render laptop grid ──
function renderLaptops(laptops, searchTerm = "") {
  const grid = document.getElementById("laptop-grid");
  if (!grid) return;

  if (!laptops.length) {
    renderEmpty(grid, { icon: "💻", title: "No laptops found", message: "Try adjusting your search or filter." });
    return;
  }

  grid.innerHTML = laptops.map(laptop => `
    <div class="laptop-card" data-id="${laptop.id}">
      <div class="laptop-card-top">
        <div class="laptop-card-icon">💻</div>
        ${statusBadge(laptop.status)}
      </div>
      <div>
        <div class="laptop-name">${highlight(laptop.laptopName, searchTerm)}</div>
        <div class="laptop-meta">${laptop.brand} · ${laptop.model}</div>
        ${laptop.status !== "available"
          ? `<div class="laptop-meta mt-1" style="font-size:.78rem">Due: ${formatTime(laptop.dueTime)}</div>`
          : ""}
      </div>
      <div class="laptop-card-footer">
        <a href="laptop-details.html?id=${laptop.id}" class="btn btn-outline btn-sm">View</a>
        ${laptop.status === "available"
          ? `<button class="btn btn-primary btn-sm" onclick="borrowLaptop('${laptop.id}','${laptop.laptopName}')">Borrow</button>`
          : laptop.borrowerId === currentUser?.uid
          ? `<button class="btn btn-success btn-sm" onclick="confirmReturn('${laptop.id}','${laptop.activeCheckoutId}')">Return</button>`
          : ""}
      </div>
    </div>
  `).join("");
}

// ── Borrow modal ──
window.borrowLaptop = function(laptopId, laptopName) {
  document.getElementById("modal-laptop-name").textContent = laptopName;
  document.getElementById("confirm-borrow-btn")?.setAttribute("data-laptop-id", laptopId);
  restoreLoanHours("loan-hours"); // restore saved preference from localStorage
  document.getElementById("borrow-modal")?.classList.add("open");
};

// ── Return ──
window.confirmReturn = async function(laptopId, checkoutId) {
  if (!confirm("Confirm laptop return?")) return;
  try {
    await returnLaptop(laptopId, checkoutId);
    showToast("Laptop returned successfully!", "success");
  } catch (err) {
    showToast("Return failed: " + err.message, "error");
  }
};
