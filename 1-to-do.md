### 🟢 PHASE 1: CORE INFRASTRUCTURE (IMMEDIATE)

- [ ] **[SYSTEM]** **SQL Security Audit:** Run Master Audit Snippets to verify all `Security Definer` functions and RLS on `leads` table.
- [ ] **[TITAN]** **Lead Editor UI:** Build the `LeadEditor` component for the Inspector Panel.
- [ ] **[TITAN]** **Conversion Logic:** Implement the "Convert to Profile" button to automate moving `leads` ➔ `profiles`.
- [ ] **[AUTH]** **Onboarding Hub:** Design the centralized `/onboarding` landing page for all users.
- [ ] **[AUTH]** **Success Routing:** Map redirect logic based on role (Talent ➔ Hub, Customer ➔ Shop).

---

### 🟡 PHASE 2: TERMINAL & MARKETING REFINEMENT

- [ ] **[ACADEMY]** **Login Opt-in:** Add "Subscribe to Academy Updates" checkbox to the Academy Login Modal.
- [ ] **[SHOP]** **Login Opt-in:** Add "Opt-in for Store Discounts" checkbox to the Shop Login/Sign-up Modal.
- [ ] **[MARKETING]** **Author Web Services:** Build the "Website Services for Authors" page to showcase landing page offerings.
- [ ] **[REFINEMENT]** **Newsletter Tuner:** Build the granular toggle UI at `/newsletter` (Shop vs. Academy vs. General).

---

### 🟠 PHASE 3: CREATIVE FUNNELS & POLICY SHIELDS

- [ ] **[ARTIST]** **Artist Funnel:** Build the Artist Application Form (Portfolio/Style Tags) + Newsletter Opt-in.
- [ ] **[ARTIST]** **Artist Policy:** Draft and host official Artist Collaboration & IP Policies.
- [ ] **[AUTHOR]** **Author Funnel:** Build the Author Project Form (Manuscript/Audio Rights) + Newsletter Opt-in.
- [ ] **[AUTHOR]** **Author Policy:** Draft and host official Literary Royalty & IP Policies.
- [ ] **[TITAN]** **Lead Expansion:** Update Titan OS to track "Author Lead" and "Artist Lead" status specifically.

---

### 🔴 PHASE 4: THE BIG REBUILD & VERCEL LAUNCH

- [ ] **[STAGING]** **Full App Rebuild:** Run `npm run build` to flush out all linting and type errors.
- [ ] **[TESTING]** **Form Torture Test:** Manually test Lead capture on Footer, Intake, Artist, and Author forms.
- [ ] **[DEPLOY]** **Vercel Launch:** Connect production branch, configure Env Variables (Supabase, Brevo, Stripe).
- [ ] **[DEPLOY]** **Domain Lock:** Point domain to Vercel, enable SSL, and activate the security lock.

---

### 🛰️ PHASE 5: MASTER SYSTEM TEST (PRE-SUMMER 2026)

- [ ] **[TESTING]** **End-to-End Simulation:** From "Public Lead Entry" ➔ "Titan Approval" ➔ "Authorized User Access."
- [ ] **[ACADEMY]** **Dashboard Placeholder:** Create the `/academy/dashboard` route and student profile settings.
- [ ] **[SHOP]** **Navbar Switch:** Implement role-detection to swap "Login" for the "Member Group" UI (`[Cart] | [Avatar]`).
- [ ] **[SHOP]** **Cart Infrastructure:** Build `CartModal.js` and implement LocalStorage sync.

---

### 🛠️ ARCHIVED (MISSION COMPLETE)

- [x] **[TITAN]** Titan OS V5.2 (Integrated Leads & Virtual Roles).
- [x] **[UI]** Terminal UI Transplant (Academy/Shop Modals updated to Keycard aesthetic).
- [x] **[SYSTEM]** Master SQL Audit Snippets (RLS, Functions, Triggers).

---
