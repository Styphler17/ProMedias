# Design System Document: PROMEDIAS — Votre Comptoir Informatique

## 1. Overview & Creative North Star: "The Precision Atelier"
This design system moves away from the generic, "cluttered" look of typical repair shops. Instead, it adopts the persona of **The Precision Atelier**. It treats tech repair as a high-end craft—combining the technical transparency of *iFixit* with the premium, editorial retail experience of *Fnac*.

The visual language is rooted in **Structural Honesty**. We do not hide behind drop shadows or decorative lines. We use intentional white space, aggressive typography scales, and tonal shifts to create a hierarchy that feels engineered rather than "decorated." The goal is to instill absolute confidence in the user through a layout that feels as organized as a professional technician’s workbench.

---

## 2. Colors: Tonal Architecture
The palette is built on high-contrast foundations, utilizing a deep charcoal for authority and a "Precision Red" for action and urgency.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. Boundary definition must be achieved through:
1.  **Background Shifts:** Placing a `surface_container_low` section against a `surface` background.
2.  **Negative Space:** Using the spacing scale to create clear mental groupings.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
- **Base Layer:** `surface` (#fcf9f8)
- **Secondary Sectioning:** `surface_container_low` (#f6f3f2)
- **Interactive/Floating Cards:** `surface_container_lowest` (#ffffff)
- **Deep Content Wells:** `surface_container_high` (#eae7e7)

### The Glass & Gradient Rule
To avoid a flat "out-of-the-box" appearance, floating elements (like sticky navigation or mobile action bars) should utilize **Glassmorphism**. Use semi-transparent `surface` colors with a `backdrop-filter: blur(20px)`. 
For primary CTAs, apply a subtle **Signature Texture**: a linear gradient (135°) from `primary` (#af101a) to `primary_container` (#d32f2f). This provides a "machined" metallic depth that flat hex codes cannot replicate.

---

## 3. Typography: Technical Authority
We pair the geometric, wide-stanced **Space Grotesk** for headlines with the highly legible, functional **Manrope** for data and body text.

*   **Display & Headlines (Space Grotesk):** These should feel "architectural." Use `display-lg` for hero statements in French (e.g., *La renaissance de vos appareils*). Tighten letter-spacing by -0.02em for a high-end editorial feel.
*   **Body & Titles (Manrope):** This is your functional workhorse. Use `body-md` for technical descriptions. 
*   **Labels (Manrope Bold):** Always uppercase with +0.05em letter-spacing. Use this for category tags (e.g., *DIAGNOSTIC*, *PIÈCES D'ORIGINE*) to mimic the look of etched technical labels.

---

## 4. Elevation & Depth: The Layering Principle
Hierarchy is conveyed through **Tonal Layering** rather than structural lines.

*   **Natural Lift:** Instead of shadows, place a `surface_container_lowest` card on a `surface_container_low` background. This creates a soft, sophisticated "lift" that feels organic.
*   **Ambient Shadows:** When a card must float (e.g., a "Book a Repair" modal), use a highly diffused shadow:
    *   `box-shadow: 0 20px 40px rgba(28, 27, 27, 0.06);` (Using the `on_surface` color as the shadow base).
*   **The Ghost Border Fallback:** If a container requires definition on a white background, use a "Ghost Border": `outline_variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Buttons (Les Actions)
*   **Primary:** Gradient from `primary` to `primary_container`. White text. Roundedness: `md` (0.375rem). No border.
*   **Secondary:** `on_surface` (#1c1b1b) background with white text. This provides a "heavy" technical contrast.
*   **Tertiary:** Transparent background, `primary` text, no border. Used for "En savoir plus."

### Cards (Les Fiches de Réparation)
*   **Rule:** Forbid divider lines. Use `surface_container_highest` for a header area and `surface_container_lowest` for the body to create a natural break. 
*   **Layout:** Use asymmetrical padding (e.g., `pl-8 pr-6`) to create an editorial flow that doesn't feel like a standard grid.

### Input Fields (Saisie de Données)
*   **Style:** Minimalist. Background `surface_container_low`. On focus, transition to a 2px bottom-border only of `primary`. Use `label-sm` for floating labels to keep the technical "schematic" look.

### Progress Trackers (Suivi de Réparation)
*   A bespoke component for PROMEDIAS. Use thick, 4px horizontal bars using `primary_fixed` for background and `primary` for the active state. Avoid "dots"—use solid bars to represent the "building" of the repair.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts in hero sections. Overlap a high-quality photo of a circuit board (with a slight blur) behind a text container.
*   **Do** use French technical terms accurately (e.g., *Comptoir Informatique* instead of *Tech Shop*).
*   **Do** leverage `tertiary` (#005f7b) for informational or "Trust" elements, like warranty badges, to separate them from the "Action" red.

### Don’t:
*   **Don’t** use pure black (#000000). Always use `on_surface` (#1c1b1b) to maintain tonal depth.
*   **Don’t** use standard 1px dividers. Use a 12px vertical gap or a background color shift.
*   **Don’t** use fully rounded (pill) buttons for primary actions. The `md` (0.375rem) corner provides a more "industrial/technical" precision.
*   **Don’t** crowd the interface. PROMEDIAS is a premium service; give the content "breathing room" (the "Oxygen Scale").

---

## 7. Spacing & Rhythm
This design system relies on a **12-column grid** with wide gutters (32px). Use the `xl` (0.75rem) spacing token for internal card padding and the `display-lg` typography scale to create "Impact Zones" where the user's eye can rest before moving to technical details.