# Project Assumptions — Promedias

As per the requirements in `CLAUDE.md`, this file tracks architectural and business assumptions made during the build process.

## Architectural Assumptions
1. **Tech Stack**: Migrated from Vanilla HTML to **React (Vite) + Tailwind CSS + Shadcn UI**. This fulfills the request for modern component libraries and specialized iconography.
2. **Styling**: Used **Tailwind CSS** with custom HSL tokens to preserve the Promedias branding (Signature Red & Deep Teal) while leveraging Shadcn's layout system.
3. **Icons**: Replaced Material Symbols with **Lucide React** icons ("fixed the icons") to match the Shadcn ecosystem.
4. **UI Source of Truth**: Prioritized the layout and color scheme of `docs/ui/stitch_promedias_li_ge_website_ui/accueil_promedias_li_ge_1/` as the primary visual guide, now implemented as reusable React components.

## Business Assumptions
1. **Naming**: The business name is formatted as **PROMEDIAS** (Uppercase) for branding, but referred to as **Promedias Liège** in copy.
2. **Language**: Building in **French** first. Implementation of auto-translate (English/Arabic) is pending further instruction.
3. **Products**: I've assumed the featured products (MacBook Pro M1, iPhone 12, etc.) and prices in the UI export are accurate for the initial build.
4. **Contact**: Used the address `141 Rue St-Léonard, 4000 Liège` and phone `+32 (0)4 123 45 67` as the definitive NAP data.

## Missing Information / Questions
- [ ] **FAQ Content**: The UI export did not include an FAQ. I have added a section with placeholder common repair questions.
- [ ] **Real Assets**: Currently using placeholder images from the UI export. Need high-res source logos and product photography.
- [ ] **Conversion Tracking**: Need clarity on where the "Request repair quote" form should submit.
