# SERA Design Language & Aesthetic Guidelines

This document outlines the core design language, aesthetic principles, and styling rules for the SERA application. It serves as a reference for autonomous agents when creating or modifying UI components.

---

## 1. Core Aesthetic Philosophy

SERA employs a **premium, Armory-inspired, glassmorphic design language**. The design prioritizes:
- **Minimalism & Focus**: A clutter-free environment that emphasizes content.
- **Tactile Feedback**: Interfaces that feel physically grounded through subtle textures and shadows.
- **Cinematic & Editorial**: Large display typography and structured "research paper" layouts.
- **Fluid Motion**: Spring-based transitions and continuous organic ambient animations.

---

## 2. Color System (HSL-based)

The application relies strictly on CSS Variables defined in HSL format inside `src/index.css` to enable smooth theming (light/dark modes).

### Dark Mode (Primary Focus)
- **Background**: Pitch black (`hsl(0 0% 0%)`)
- **Foreground (Text)**: Floral White (`hsl(40 100% 98%)`)
- **Card Surfaces**: Raised dark gray (`hsl(0 0% 4%)` to `hsl(0 0% 9%)`)
- **Primary Elements**: Inverse (White fill `hsl(0 0% 100%)`)
- **Accents**: Desaturated Olive (`hsl(46 8% 32%)`) for badges/tags.
- **Borders**: Hairline dark gray (`hsl(0 0% 22%)`)

### Light Mode (Vercel-inspired)
- **Background**: Pure white (`hsl(0 0% 100%)`)
- **Foreground (Text)**: Pitch black (`hsl(0 0% 0%)`)
- **Primary Elements**: Near-black (`hsl(0 0% 9%)`)
- **Accents**: Acid Lime (`hsl(75 100% 62%)`) for signature highlights.

---

## 3. Typography

Typography is a critical structural element in SERA, heavily utilizing standard scales and specialized classes.

- **Primary Font**: `Inter` (sans-serif) for body text and standard UI elements.
- **Monospace Font**: `JetBrains Mono` or `Fira Code` for eyebrows, meta-data, and technical labels.
- **Editorial Display**: `.display-xl`, `.display-lg`, `.display-md` classes create massive, tightly-tracked headings (tracking: `-0.03em`, line-height: `0.98`) to evoke a cinematic or high-end editorial feel.
- **Research Paper Style**:
  - `.paper-heading`, `.paper-subheading`, `.paper-body` for highly readable long-form content.
  - `.paper-section-number` and `.eyebrow` for small, uppercase, widely-spaced labels above sections.

---

## 4. Textures, Glass, and Materials

SERA steps away from flat design by incorporating subtle physical properties:

- **Glassmorphism**: 
  - `.glass` and `.glass-strong` classes apply `backdrop-filter: blur() saturate()` along with complex, multi-layered box-shadows to simulate physical frosted glass.
- **The "Armory" Card**: 
  - `.armory-card` provides a subtle raised surface on pitch black with sharp editorial corners, utilizing pseudo-element gradient masks for inner glow effects.
- **Film Grain Overlay**: 
  - `.page-grain` injects a fixed, pointer-events-none SVG fractal noise layer (`mix-blend-mode: overlay`, `opacity: 0.055`) across the entire app to give a premium, tactile, analog feel.

---

## 5. Buttons and Call-To-Actions (CTAs)

- **Solid Action (The "Acid" Button)**: `.btn-acid` is a highly visible, inverse-colored button (white in dark mode) with a subtle drop shadow and a micro-interaction that presses down (`translateY(-1px)`) on hover.
- **Ghost Outline (Armory CTA)**: `.btn-ghost-outline` is a transparent button with a subtle border and background color shift on hover, typically containing a contrasting square icon box.

---

## 6. Animation and Motion

SERA utilizes organic, continuous animations as well as snappy, spring-based transitions:

- **Base Transitions**: `.transition-smooth` (cubic-bezier) and `.transition-spring` for state changes.
- **Ambient Floating**: `.animate-float`, `.animate-float-delay-1` (up to delay 3) provide extremely slow, organic, drifting movements (20s-28s duration) used for background elements and glowing orbs.
- **Micro-interactions**: 
  - `button:active` scales down to `0.98` for a native-feeling press.
  - Hover states utilize `transform` scaling and subtle glow injections (`.glow-soft`, `.glow-accent`).

---

## 7. Layout and Grid

- **CSS Grid**: Heavy reliance on 12-column (`.grid-12`) and 4-column (`.grid-4`) grid structures for rigid, editorial alignments.
- **Container**: Max-width is generally clamped (e.g., `1240px` for armory containers) to maintain readable line lengths.
- **Responsive Handling**: The application handles iOS safe areas (`env(safe-area-inset)`) and prevents horizontal overflow clipping (`overflow-x: clip`).

---

## AI Agent Directives for UI Modification

When an AI agent modifies the UI, it MUST:
1. **Use Existing Primitives**: Do not invent new colors or shadows; use the defined HSL variables and utility classes.
2. **Preserve the Grain**: Ensure the `.page-grain` is never obscured by opaque solid backgrounds layered incorrectly.
3. **Maintain Contrast**: Check that text on glass elements remains readable.
4. **Animate Deliberately**: Apply `.transition-smooth` to interactive elements and avoid jerky, linear transitions.
5. **Respect Typography**: Use `.eyebrow` for section prefixes and `.display-*` for hero elements. Do not mix font families arbitrarily.
