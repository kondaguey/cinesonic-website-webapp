Based on your current SQL schema and file structure, here is the definitive **Backend Manifest**.

I have updated the "Next Steps" and "Schema" sections to exactly match the SQL you just provided (e.g., ensuring `active_productions` and `leads` match reality).

### Instructions

1. Create a new file in your root directory named: **`BACKEND_ARCHITECTURE.md`**
2. Paste the content below into it.
3. Add a link to this file in your main `README.md`.

---

# 🏛️ CINESONIC BACKEND MANIFEST: THE VAULT (V2.1)

**Version:** 2.1
**Date:** December 2025
**Core Philosophy:** "Vertical Security Partitioning" (Silos over Monoliths)
**Lead Engine:** "Universal Dual-Write" (Supabase + Brevo)

---

## 1. EXECUTIVE TECHNICAL SUMMARY

Cinesonic is a high-end audio/visual production house. The backend is built on **Supabase (PostgreSQL)** with a **Next.js** frontend.

**The Golden Rule:** Data is strictly separated into **Public Showrooms** (Read-Heavy) and **Private Vaults** (Secure/Write-Heavy). There is NO single "User" table containing sensitive data. We use a **"Zipper Architecture"** where `public.profiles` acts as the central hub, and role-specific tables (Actor, Artist, Author) extend off it sharing the same UUID.

---

## 2. THE LEAD CAPTURE ENGINE (Marketing Logic)

- **Architecture:** "Source-Tagged Routing."
- **Primary Table:** `public.leads`
- **Constraint:** `UNIQUE (email, source)` — Allows the same email to exist in multiple lists.
- **The "Dual-Write" Protocol:**

1. **Vault (Supabase):** Action saves the lead to `public.leads` for permanent ownership.
2. **Megaphone (Brevo):** Action syncs the email + `SOURCE` tag to Brevo via API.

- **Code Location:** `src/actions/subscribeActions.js`

### Active Lead Sources

| Source Tag           | Component / Location                  | Status            |
| -------------------- | ------------------------------------- | ----------------- |
| `footer_newsletter`  | Footer Component                      | ✅ Active         |
| `shop_waitlist`      | Shop Page ("Notify Me")               | ✅ Active         |
| `academy_waitlist`   | Academy Page ("Enrollment")           | ✅ Active         |
| `client_intake`      | Project Intake Form (Opt-in Checkbox) | ✅ Active         |
| `talent_application` | Roster Page                           | ⚠️ Pending Wiring |

---

## 3. DATABASE SCHEMA & ARCHITECTURE

### A. The Identity Hub (The Spine)

- **`auth.users`**: Managed by Supabase (Login credentials).
- **`public.profiles`**: The master directory.
- `id` (UUID): Matches `auth.users`.
- `role` (Enum): `actor`, `artist`, `author`, `crew`, `admin`, `ownership`, `customer`.
- `clearance` (Int): 1 (Talent) to 5 (Owner).
- `status`: `active`, `suspended`, etc.

### B. The Talent Silos (Vertical Partitioning)

Each role has a "Public Face" (for the website) and a "Private Vault" (for admin/contracts).

#### 🎭 Actors

- **Public (`actor_roster_public`):** `voice_types`, `accents`, `genres` (Arrays), `demo_reel_url`.
- **Private (`actor_private`):** `legal_name`, `union_status`, `pfh_rate`, `payroll_vendor_id`, `bookouts` (JSONB).

#### 🎨 Artists

- **Public (`artist_roster_public`):** `style_tags`, `portfolio_url`.
- **Private (`artist_private`):** `commission_rates` (JSONB), `payment_method_preference`.

#### ✍️ Authors

- **Public (`author_roster_public`):** `published_works` (JSONB).
- **Private (`author_private`):** `royalty_agreement_url`, `agent_contact_info`.

### C. The Production Engine

This is the core business logic handling the transition from "Lead" to "Project".

1. **The Mailbox (`project_intake`)**

- **Function:** Public "One-Way Slot" for submissions.
- **Security:** Public `INSERT` only. Admin `SELECT`.
- **Key Data:** `character_details` (JSONB), `timeline_prefs`, `word_count`, `price_tier`.
- **Frontend:** `src/components/marketing/ProjectIntakeForm.js`

2. **The Master Hub (`active_productions`)**

- **Function:** The "Active State" of a project post-greenlight.
- **Link:** Foreign Key `intake_id` links back to original request.
- **Key Data:**
- `casting_manifest` (JSONB): Final cast list.
- `financial_ledger` (JSONB): Budget tracking.
- `production_schedule` (JSONB): Milestones.

---

## 4. UTILITIES & CONTENT

- **`blog_posts`**: Headless CMS content (`slug`, `seo_meta`, `content` JSONB).
- **`lists`**: Global Key-Value store for dropdowns (Accents, Genres) to allow easy frontend updates without code changes.
- **`site_keys`**: Access control system. Stores unique codes (`key_code`) assigned to specific roles to allow secure onboarding.
- **`site_settings`**: Global toggles (`is_enabled`, `meta_value`).

---

## 5. FILE STRUCTURE MAPPING

Where the database meets the codebase:

- **Authentication & Profiles:** `src/app/onboarding/page.js` (Pending)
- **Lead Capture:** `src/actions/subscribeActions.js`
- **Project Submission:** `src/components/marketing/ProjectIntakeForm.js` -> `project_intake` table.
- **Roster Display:** `src/components/marketing/MainRoster.js` -> `actor_roster_public` table.
- **Admin Dashboard:** `src/app/(dashboard)/...` -> Reads `active_productions` and `_private` tables.

---

## 6. SECURITY PROTOCOLS

1. **RLS (Row Level Security):** All tables have RLS enabled.

- _Public Tables:_ `SELECT` allowed for `anon`.
- _Private Tables:_ `SELECT` allowed only for `service_role` or matching `auth.uid()`.

2. **Compliance:** No banking info stored. `payroll_vendor_id` links to external processors (Wrapbook/Gusto).
3. **The Unsubscribe RPC:** A secure database function `unsubscribe_lead` allows public users to update their status without full write access.

---

**END OF MANIFEST**
