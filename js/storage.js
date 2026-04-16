// ============================================================
// storage.js — localStorage helpers
// ============================================================

const KEYS = {
  THEME: "lt_theme",
  SEARCH_TERM: "lt_search_term",
  STATUS_FILTER: "lt_status_filter",
  LOAN_HOURS: "lt_loan_hours",
  USER_PREFS: "lt_user_prefs",
  LAST_PAGE: "lt_last_page"
};

// ── Theme ──
export function loadTheme() {
  return localStorage.getItem(KEYS.THEME) || "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(KEYS.THEME, theme);
}

export function initTheme() {
  applyTheme(loadTheme());
}

// ── Search state ──
export function saveSearchState({ searchTerm = "", statusFilter = "" }) {
  localStorage.setItem(KEYS.SEARCH_TERM, searchTerm);
  localStorage.setItem(KEYS.STATUS_FILTER, statusFilter);
}

export function restoreSearchInputs(searchInputId, statusFilterId) {
  const searchInput = document.getElementById(searchInputId);
  const statusFilter = document.getElementById(statusFilterId);

  if (searchInput) {
    searchInput.value = localStorage.getItem(KEYS.SEARCH_TERM) || "";
  }

  if (statusFilter) {
    statusFilter.value = localStorage.getItem(KEYS.STATUS_FILTER) || "";
  }
}

// ── Loan hours ──
export function saveLoanHours(hours) {
  localStorage.setItem(KEYS.LOAN_HOURS, String(hours));
}

export function loadLoanHours() {
  return parseInt(localStorage.getItem(KEYS.LOAN_HOURS) || "3", 10);
}

export function restoreLoanHours(selectId) {
  const el = document.getElementById(selectId);
  if (el) {
    el.value = String(loadLoanHours());
  }
}

// ── User prefs ──
export function saveUserPrefs(profile) {
  localStorage.setItem(KEYS.USER_PREFS, JSON.stringify(profile || {}));
}

export function loadUserPrefs() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USER_PREFS) || "{}");
  } catch {
    return {};
  }
}

export function clearUserPrefs() {
  localStorage.removeItem(KEYS.USER_PREFS);
}

// ── Last page ──
export function saveLastPage(page) {
  localStorage.setItem(KEYS.LAST_PAGE, page);
}

export function loadLastPage() {
  return localStorage.getItem(KEYS.LAST_PAGE) || "dashboard";
}