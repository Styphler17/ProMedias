# Implementation Plan: Cinematic Macro Hero Upgrade

We are replacing the current Three.js background with a premium **Macro Product** vibe. This will feature a high-fidelity image with a parallax effect and CSS-driven light-sweep animations.

## 1. Asset Preparation
- [ ] Move the generated `hero_macro_vibe.png` to `c:/MAMP/htdocs/ProMedias/public/hero-bg.png`.

## 2. Design System Update (CSS)
- [ ] Update `src/index.css` with a new `animate-light-sweep` utility.
- [ ] Implement a glassmorphism overlay style for the hero content to ensure readability.

## 3. Home Component Refactoring
- [ ] Open `src/pages/Home.tsx`.
- [ ] Remove the Three.js `Canvas` and associated hooks/components.
- [ ] Implement the new `Hero` section structure:
    - **Background**: Fixed/Parallax container with `hero-bg.png`.
    - **Overlay**: A CSS-based radial gradient to create depth.
    - **Light Sweep**: A `::after` element with a diagonal shimmer animation.
    - **Content**: Framer Motion typography updates.

## 4. Verification & Polish
- [ ] Verify responsive behavior (Ensure the macro focus stays centered on mobile).
- [ ] Check performance (Verify that removing Three.js has significantly reduced the JS bundle size).

---

### Red / Green TDD Strategy
Since this is purely visual, verification will be based on **Visual Regression Check**:
1. Check that the headline is perfectly legible against the dark background.
2. Verify that the "light sweep" animation is subtle and slow (not distracting).
3. Ensure no Three.js runtime errors remain in the console.

**Ready to launch? Say "GO" and I'll start the implementation.**
