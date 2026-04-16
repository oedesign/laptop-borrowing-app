# 💻 LaptopTrack — Laptop Borrowing Management App

> **WDD330 Final Project** · Oluwaseyi Elujoba  
> A responsive, modular JavaScript web application for managing campus laptop lending.

---

## 📁 Project Structure

```
laptop-borrowing-app/
├── index.html              # Smart entry point (auto-redirects)
├── login.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # Student dashboard
├── laptop-details.html     # Single laptop detail + countdown timer
├── history.html            # Student borrowing history
├── admin.html              # Admin dashboard (all tabs)
│
├── css/
│   ├── styles.css          # Global design system, layout, components
│   ├── auth.css            # Login & register page styles
│   └── dashboard.css       # Dashboard-specific styles
│
├── js/
│   ├── firebaseConfig.js   # ⚠️ Firebase credentials + Firestore rules
│   ├── auth.js             # Auth: register, login, logout, guards
│   ├── laptops.js          # Laptop CRUD + real-time listeners
│   ├── checkout.js         # Laptop borrowing logic
│   ├── returns.js          # Laptop return logic
│   ├── history.js          # Borrowing history queries
│   ├── admin.js            # Admin operations (users, reports)
│   ├── utils.js            # Helpers: dates, filters, EmailJS
│   ├── ui.js               # DOM helpers, toast, modal, sidebar
│   └── main.js             # Student dashboard page controller
│
└── data/
    └── sampleData.js       # Firestore seed script (8 sample laptops)
```

---

## 🚀 Setup Instructions

### Step 1 — Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **Add project** and follow the prompts.
3. In your project, go to **Project Settings → General → Your apps**.
4. Click **Add app → Web**, register it, and copy the `firebaseConfig` object.
5. Open `js/firebaseConfig.js` and paste your values into the config.

### Step 2 — Enable Firebase Authentication

1. In Firebase Console → **Authentication → Sign-in method**.
2. Enable **Email/Password**.

### Step 3 — Enable Firestore

1. In Firebase Console → **Firestore Database → Create database**.
2. Start in **test mode** for development.
3. Later, copy the Security Rules from the comment block in `js/firebaseConfig.js` and paste them into Firestore → Rules.

### Step 4 — Run the App

Since the project uses ES modules, you need a local server (not just opening `index.html` directly):

**Option A — VS Code Live Server**
- Install the **Live Server** extension.
- Right-click `index.html` → **Open with Live Server**.

**Option B — Node.js**
```bash
npx serve .
```

**Option C — Python**
```bash
python -m http.server 8080
```

### Step 5 — Seed Sample Data (Optional)

To populate your database with 8 test laptops:

1. Open your app in the browser.
2. Open DevTools Console (`F12`).
3. Run:
```javascript
import('/data/sampleData.js').then(m => m.seedLaptops());
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Auth** | Email/password registration & login, role-based (student / admin) |
| **Dashboard** | Real-time laptop availability grid with search & status filter |
| **Borrow** | One-click checkout with configurable loan duration |
| **Return** | Mark returned by student or admin |
| **Due Time** | Live countdown timer on laptop details page |
| **Overdue** | Automatic overdue detection synced on page load |
| **History** | Per-user history with status filter; full admin history log |
| **Admin Panel** | Tabbed dashboard: Overview, Laptops, Active Checkouts, History, Users |
| **CRUD** | Admin can add, edit, delete laptops |
| **Role Management** | Admin can promote/demote users |
| **Notifications** | Toast notifications + optional EmailJS email on checkout |
| **Responsive** | Mobile-first: sidebar collapses to bottom nav + top bar |

---

## 📧 EmailJS Setup (Optional)

To send checkout confirmation emails:

1. Sign up at [https://www.emailjs.com/](https://www.emailjs.com/)
2. Create a service (Gmail, Outlook, etc.)
3. Create an email template with variables:
   - `{{to_name}}` — borrower's name
   - `{{to_email}}` — borrower's email
   - `{{due_time}}` — formatted due date/time
   - `{{laptop_id}}` — laptop ID
4. Add your **Service ID**, **Template ID**, and **Public Key** to `js/utils.js`.
5. Add this script to each HTML page's `<head>`:
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#1F3A5F` (dark blue) |
| Secondary | `#4DA8DA` (light blue) |
| Accent | `#F4B400` (yellow) |
| Success | `#2E8B57` |
| Danger | `#D7263D` |
| Font (headings) | Poppins |
| Font (body) | Inter |

---

## 📅 Project Timeline

| Week | Tasks |
|---|---|
| Week 5 | Proposal → setup Firebase → auth pages → base HTML |
| Week 6 | Dashboard → Firestore → checkout/return → history → search |
| Week 7 | Admin panel → overdue logic → emails → testing → final polish |

---

## 🔗 Trello Board

[View Project Board](https://trello.com/invite/b/69ce8fe4bf2295a778088281/ATTI9b6a73e6e13abc6617b789208084fad686361CCF/wdd330-final-project-laptop-borrowing-management-app)
