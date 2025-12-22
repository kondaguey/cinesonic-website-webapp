# 🎬 CINESONIC FRONTEND MANIFEST: THE SHOWROOM (V5.1)

**Version:** 5.1 (The "Titan & Terminal" Update)
**Date:** December 2025
**Core Philosophy:** "The Living UI" (Reactive, Cinematic, Immersive)
**Framework:** Next.js 15 (App Router) + Tailwind + Framer Motion

---

## 1. STUDIO IDENTITY & UX PHILOSOPHY

- **Mission:** "Filmmakers for the Ears." We produce **Auditory Cinema**.
- **The Ecosystem:**

1. **The Showroom (Public):** Marketing, Intake, and Storefront.
2. **The Academy (Education):** Gated student portal (Launch: Summer 2026).
3. **The Engine (Titan OS):** Internal Command Center for Lead & Profile management.

---

## 2. THE "LIVING UI" ENGINE

### A. Extended Color Palette (Role & Service Mapping)

- **`gold`** (`#d4af37`) → **Solo Production** / **Crew Portal**
- **`blue`** (`#60a5fa`) → **Academy** / **Students** (Portal Accent)
- **`violet`** (`#a78bfa`) → **Shop** / **Customers** (Portal Accent)
- **`orange`** (`#f97316`) → **Leads** (Non-converted track)
- **`red`** (`#ef4444`) → **Command** (Admin Override)

---

## 3. KEY COMPONENT ARCHITECTURE

### 🧬 UI ATOMS (`src/components/ui/`)

1. **`KeycardModal.js`:** **[NEW]** The universal auth interface.

- _Design:_ Thin colored top-border stripe, Framer Motion spring physics, blurred backdrop.
- _Variants:_ `AcademyLogin`, `ShopLogin`, `HubLogin`.

2. **`ThemeWrapper.js`:** Injects role-based CSS variables.

### 📣 TITAN OS COMPONENTS (`src/components/dashboard/`)

3. **`MasterControllerTitan.js`:** The Database Inspector.

- **Tab: Profiles:** Manages converted users (Actors, Artists, Authors, Crew).
- **Tab: Customers:** Split-view for **Shop Members** vs. **Academy Students**.
- **Tab: Leads:** **[NEW]** Manages raw email captures from the `leads` table before account creation.

### 📄 PAGE LOGIC (`src/app/`)

4. **`/academy/login`:** High-security gate. Performs **Role Validation** before entry.
5. **`/shop`:** Retail interface. Uses `router.refresh()` for non-disruptive state updates.

---

## 4. DATA FLOW: THE CONVERSION FUNNEL

The system distinguishes between **Leads** (Anonymous) and **Profiles** (Authenticated).

### A. The Lead Track (Source: `leads` table)

- **Capture Points:** Footer, Intake Form, "Coming Soon" splash pages.
- **Types:** Newsletter, Shop Lead, Academy Lead.
- **Status:** `active` → `converted` (once a Profile is created).

### B. The Profile Track (Source: `profiles` table)

- **Creation:** Handled via `ShopLoginModal` (Sign-up state) or Admin manual entry.
- **Role Gating:** \* **Academy:** Strict `role === 'student'` check.
- **Shop:** `role === 'customer'` (Clearance Level 0).
- **Titan OS:** `clearance >= 3` check.

---

## 5. TERMINAL ACCESS LOGIC

| Portal      | Modal Style      | Access Logic                    | Destination                       |
| ----------- | ---------------- | ------------------------------- | --------------------------------- |
| **Academy** | Keycard (Blue)   | Auth + Role Check (`student`)   | `/academy/dashboard`              |
| **Shop**    | Keycard (Violet) | Login OR Sign-up                | `router.refresh()` (Stay on page) |
| **Command** | Keycard (Red)    | Auth + Clearance Check (Lvl 3+) | `/admin/master-controller`        |

---

## 6. DEVELOPMENT ROADMAP

### ✅ COMPLETED

- **Titan OS V2:** Integrated Leads and Customer tab management.
- **Keycard Transplant:** Academy and Shop login modals now share the Hub's cinematic design language.
- **Role Logic:** Profiles/Leads distinction fully wired to Supabase.

### 🚧 UPCOMING (SUMMER 2026)

- **Academy Dashboard:** High-performance student learning grid.
- **Shop Cart Logic:** Placeholder cart modal and "Member-only" pricing tiers.
- **Lead-to-Profile Automations:** Triggering welcome emails when a Lead converts.

---

**END OF MANIFEST**

---
