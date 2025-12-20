Here is the updated and definitive **Frontend Manifest (v5.0)**.

This document integrates your new **Intake Matchmaker**, **Newsletter Tuner**, and **Unsubscribe Logic** into the master plan.

Create a new file in your root directory named: **`FRONTEND_ARCHITECTURE.md`**.

---

# 🎬 CINESONIC FRONTEND MANIFEST: THE SHOWROOM (V5.0)

**Version:** 5.0
**Date:** December 2025
**Core Philosophy:** "The Living UI" (Reactive, Cinematic, Immersive)
**Framework:** Next.js 15 (App Router) + Tailwind + Framer Motion

---

## 1. STUDIO IDENTITY & UX PHILOSOPHY

- **Mission:** "Filmmakers for the Ears." We produce **Auditory Cinema**.
- **Core Metaphor:** **The Cinema.**
- _Visuals:_ Dark mode, letterboxing, lens flares, film grain, deep immersion.
- _Vibe:_ High-stakes, premium, professional but artistic.

- **The Ecosystem:**

1. **The Showroom (Public):** High-performance marketing site (`(marketing)` group).
2. **The Engine (Private):** Production OS for crew/talent (`(dashboard)` group).

---

## 2. THE "LIVING UI" ENGINE

**Architecture:** Hybrid System (CSS Variables + React Context).

### A. The Brain (`ThemeContext.js`)

- **Role:** Holds Global State.
- **State 1: `theme` (Color):** Dynamic palette based on service selection.
- **State 2: `isCinematic` (Mode):** Boolean toggle for "Audio Drama Mode."

### B. The Modes

- **Sonic Mode (Standard):** Clean, crisp, professional.
- **CineSonic Mode (Cinematic):**
- **Trigger:** User clicks the `CineSonicToggle` switch.
- **Visuals:** 10vh Letterbox bars slide in (CSS Class `.cinesonic-active`). Violet (`#7c3aed`) bleeds into the theme.
- **Behavior:** Pricing matrix upgrades to "Audio Drama" tiers.

### C. The Color Palette (Service Mapping)

- **`gold`** (`#d4af37`) → **Solo Production** (The Classic)
- **`pink`** (`#ff3399`) → **Dual Production** (Romance/POV)
- **`fire`** (`#ff4500`) → **Duet Production** (Thriller/High-Heat)
- **`cyan`** (`#00f0ff`) → **Multi-Cast** (Sci-Fi/Epic)
- **`silver`** (`#c0c0c0`) → **Technical Specs** (The Machine)
- **`system`** (`#3b82f6`) → **Dashboard** (Mission Control)

---

## 3. KEY COMPONENT ARCHITECTURE

### 🧬 UI ATOMS (`src/components/ui/`)

1. **`ThemeWrapper.js`:** The Body. Injects CSS variables and handles "Letterbox" classes.
2. **`CineSonicToggle.js`:** The Switch. Triggers the cinematic state.
3. **`PopupSelection.js`:** **[NEW]** Reusable modal for multi-select inputs (Genres, Accents).
4. **`ParticleFx.js`:** HTML5 Canvas backgrounds (Starfields, Embers).

### 📣 MARKETING SUITE (`src/components/marketing/`)

5. **`ProjectIntakeForm.js`:** **[GOD-TIER]**

- _Logic:_ Contains internal `runCreativeMatch` algorithm.
- _Features:_ Calendar blockers, Pricing Calculator, Lead Opt-in Checkbox.

6. **`Footer.js`:** Reactive state. Captures "General" newsletter leads.
7. **`Navbar.js`:** Listens directly to Context. Border/Text colors react instantly.

### 📄 PAGE LOGIC (`src/app/`)

8. **`/unsubscribe`:** **[NEW]** The "Clean Exit." Client-side logic fetches email param and calls server blacklist.
9. **`/newsletter`:** **[NEW]** The "Frequency Tuner." Allows granular subscription (Shop vs. Academy vs. General).
10. **`/onboarding`:** **[NEW]** Pure Auth flow (Supabase Login/Signup). No marketing logic here.

---

## 4. DATA FLOW & SERVER ACTIONS

The frontend never speaks to the database directly. It uses **Server Actions** as a bridge.

- **Lead Capture:** `subscribeToWaitlist(formData)`
- _Used in:_ Footer, Shop, Academy, Project Intake.
- _Effect:_ Dual-write to Supabase `leads` and Brevo.

- **Unsubscribe:** `unsubscribeUser(formData)`
- _Used in:_ Unsubscribe Page.
- _Effect:_ RPC call to clean DB + Brevo Blacklist API.

---

## 5. GLOBAL EXPANSION STRATEGY (FUTURE)

- **Routing:** Sub-path strategy for SEO authority.
- 🇺🇸 `cinesonicproductions.com` (Global)
- 🇮🇹 `cinesonicproductions.com/it` (Italy - EUTM Protected)
- 🇰🇷 `cinesonicproductions.com/kr` (Korea - First-to-File Protected)

- **Implementation:** Next.js Middleware to detect IP/Language and rewrite paths.

---

## 6. CODING STANDARDS

1. **Language:** JavaScript (`.js`) only.
2. **Styling:**

- **Tailwind:** Layout & Spacing.
- **Inline Styles:** Dynamic Theme Colors (e.g., `style={{ borderColor: activeColor }}`).
- **Framer Motion:** Enter/Exit animations.

3. **Imports:** Use absolute paths (`@/components/...`) or clean relative (`../../`).
4. **Theme Access:** Always destructure from `useTheme()`:

```javascript
const { activeColor, isCinematic, theme } = useTheme();
```

---

## 7. DEVELOPMENT STATUS

### ✅ COMPLETED

- **Theme Engine:** Fully operational (Context + Wrapper).
- **Lead Capture UI:** Footer, Shop, Academy, and Intake Form wired to Server Actions.
- **Intake Logic:** Matchmaking algorithm and Calendar UI implemented.
- **Unsubscribe Flow:** Dedicated page + logic active.

### 🚧 IN PROGRESS

- **Dashboard UI:** Applying "System Blue" theme to the Admin Panel.
- **Onboarding:** Building the Auth/Signup screens at `/onboarding`.

---

**END OF MANIFEST**
