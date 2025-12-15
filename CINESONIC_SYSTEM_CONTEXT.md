Here is the updated System Context & Design Rules document.

I have updated **Section 3 (Component Architecture)** to include the new global and functional components we’ve discussed (Navbar, Footer, Estimator, Booking), added the missing **Dual** mode to **Section 4 (3D Backgrounds)**, and refined the **Typography** and **Button** definitions in **Section 2**.

---

# 🎬 PROJECT CINESONIC: SYSTEM CONTEXT & DESIGN RULES (V2.0)

## 1. PROJECT IDENTITY

- **Name:** CineSonic
- **Mission:** High-end audiobook production treated as cinema. "Filmmakers for the Ears."
- **Vibe:** Premium, Cinematic, Dark Mode, Industrial Luxury, Sci-Fi edge.
- **Core Metaphor:** The "Sonic Cathedral" / "The Furnace" / "The Void."

## 2. DESIGN SYSTEM (THE "VIBE CHECK")

All new components must adhere to these strict visual rules:

### 🎨 Color Palette

- **Void Black (Background):** `#050505` (Never pure `#000000`, add depth).
- **Cinema Gold (Primary):** `#d4af37` (Used for text highlights, borders, glows).
- **Glass White (Text/Borders):** `white/10` to `white/5` for borders. `white/60` for body text.
- **Service Accents (The "Modes"):**
  - **Solo:** Gold (`#d4af37`) -> "The Standard"
  - **Dual:** Neon Pink (`#ff3399`) -> "Romance/Perspective"
  - **Duet:** Magma Orange (`#ff4500`) -> "Heat/Chemistry"
  - **Multi-Cast:** Cyan/Violet (`#00f0ff`) -> "Sci-Fi/Ensemble"

### 📐 UI Physics & Textures

- **Glassmorphism:** Heavy use of `backdrop-blur-md` or `xl` with `bg-white/5`.
- **Noise Texture:** Use subtle grain overlays (`mix-blend-overlay`) to avoid "flat" blacks.
- **Glows:** Components should emit light. Use `shadow-[0_0_30px_COLOR]` or absolute positioned blur divs.
- **Typography:**
  - **Headings (Serif):** _Cinzel_ or _Playfair Display_. Elegant, high-contrast.
  - **Body/UI (Sans):** _Manrope_ or _Inter_. Clean, tech-forward, readable.
  - **Badges:** Uppercase, tracking `[0.2em]`, tiny font size (`text-[10px]`).
- **Interactive Elements (Buttons):**
  - **Primary:** Solid Gold background, Black text, heavy glow on hover.
  - **Secondary:** Glass border, White text, Gold border on hover.

## 3. COMPONENT ARCHITECTURE (THE "LEGO SET")

We have built the following high-value assets. DO NOT rebuild them; import and reuse.

### 🧩 Layout & Global (`src/components/layout/`)

1.  **`Navbar.js`:**
    - _Function:_ Sticky top navigation.
    - _Design:_ Glassmorphic pill shape, shrinks on scroll, gold glow on active links.
2.  **`Footer.js`:**
    - _Function:_ "The Credits Roll."
    - _Design:_ Massive typography, multi-column links, newsletter input with gold arrow.
3.  **`ServiceHero.js`:**
    - _Function:_ Reusable header for individual service pages.
    - _Props:_ `title`, `subtitle`, `badgeText`, `accentColor` (determines the glow).

### 🧩 Marketing & Feature Components (`src/components/marketing/`)

4.  **`CostEstimator.js` (NEW):**
    - _Function:_ Interactive calculator for project pricing.
    - _Interaction:_ Sliders for word count, toggles for "Sound FX" and "Music." Updates price in real-time.
5.  **`BookingForm.js` (NEW):**
    - _Function:_ The conversion engine.
    - _Design:_ Multi-step wizard or single column with floating labels. Gold focus states.
6.  **`RosterPreview.js`:**
    - _Function:_ Displays 4 random actor cards.
    - _Props:_ `accentColor` (Hex code) for dynamic theming.
7.  **`ServiceComparisonMatrix.js`:**
    - _Function:_ 4-column feature grid with animated backgrounds.
    - _Special:_ Particle animations (Embers, Hearts, Stars).
8.  **`TestimonialsFeed.js`:**
    - _Function:_ A feed of author reviews.
    - _Design:_ Glass cards with Gold stars.
9.  **`FAQSection.js`:**
    - _Function:_ Accordion Q&A.
    - _Interaction:_ "Focus Mode" (dims non-active items, glows active item).
10. **`SonicVisualizer.js`:**
    - _Function:_ Mock audio player with animated bars.
    - _Design:_ "Midnight Glass" gradient.
11. **`ProductionPipeline.js`:**
    - _Function:_ Vertical timeline of the 5-step process.
    - _Design:_ Center gold line with connecting nodes.

## 4. 3D BACKGROUNDS (THREE.JS / R3F)

Each service page has a unique "world" rendered in WebGL.

- **Solo Page:** Abstract Microphone / Gold Particles.
- **Dual Page ("The Heartbeat"):** Neon Pink/Magenta slow-pulsing geometric shapes or fluid smoke.
- **Duet Page ("The Furnace"):** Rising realistic fire embers (Magma Orange).
- **Multi-Cast Page ("The Warp"):** Vertical "Zoomies" starfield (Cyan, high speed).
- **About Us Page ("The Frequency"):** Liquid gold sine wave.

## 5. CODING RULES

- **Framework:** Next.js 14 (App Router) + Tailwind CSS.
- **Icons:** Lucide-React.
- **Images:** Unsplash (Cinematic/Dark).
- **Animation:**
  - **Micro:** Tailwind `transition-all duration-500 ease-out`.
  - **Macro:** Framer Motion (for enter/exit).
  - **Backgrounds:** React-Three-Fiber / Drei.
- **Mobile First:** Always ensure grids collapse to `grid-cols-1` on mobile.

---

**INSTRUCTION TO AI:**
When generating new code, strictly adhere to the **Void Black** background and **Cinema Gold** accent. Do not use default Tailwind blues or grays. Every interaction should feel "heavy" and "expensive" (smooth transitions, glow effects on hover). Check against the **Component Architecture** list before building new UI—reuse existing components if possible.

**Would you like me to generate code for any of the newly listed components (like the `CostEstimator` or `ServiceHero`)?**
