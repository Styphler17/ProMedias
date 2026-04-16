# CLAUDE.md — Promedias eCommerce Build Guide

## Project goal
Build a modern bilingual-ready eCommerce website for **Promedias Liège**, a local electronics and repair shop in Liège, Belgium. The site should support selling phones, accessories, computer products, and refurbished devices while also promoting repair services and in-store trust signals. Base business details already confirmed: Promedias / PRO MEDIAS is located at Rue Saint-Léonard 141, 4000 Liège, Belgium, and operates as a phone/computer repair and electronics retailer with a strong Google rating and a Facebook-led online presence.[page:0]

## Mandatory working rules
- Read all files inside the local `docs/` directory before making architectural decisions.
- Treat `docs/` as a source of truth for brand assets, product categories, pricing notes, shipping rules, policies, screenshots, and copy.
- If documents conflict, prefer the most specific and newest file.
- Keep a running assumptions list in `docs/ASSUMPTIONS.md` if something is missing.
- Do not ignore local files in favor of generic assumptions.

## Business context
Promedias appears to be a local electronics shop centered on device repair, accessory sales, used/refurbished devices, and general support for phones, tablets, PCs, and Mac/Microsoft hardware.[page:0] The business currently relies heavily on Facebook and local directory presence rather than a polished standalone eCommerce experience, which makes a conversion-focused catalog site especially valuable.[page:0]

## Primary objectives
1. Sell in-stock products online.
2. Showcase repair services clearly.
3. Build trust with local customers.
4. Make WhatsApp / phone / in-store pickup obvious.
5. Support local SEO for Liège and nearby areas.
6. Allow easy future expansion into more categories.

## Site type
This is a **web app / eCommerce storefront** with strong informational sections. Follow high-quality web app standards: functional layout, clear product discovery, restrained design, and no generic AI-styled landing-page patterns.

## Suggested tech stack
Choose based on project constraints found in `docs/`, but default to:
- Frontend: Next.js or Nuxt with SSR/SSG for SEO.
- Styling: Tailwind or clean modular CSS.
- Commerce: WooCommerce if the client prefers WordPress; otherwise Medusa, Shopify headless, or a simple custom cart.
- CMS/content: WordPress, Sanity, or direct MD/JSON seed data depending on maintenance needs.
- Search/filter: category, price, brand, condition, stock, repair-vs-product separation.
- Payments: Bancontact, card, PayPal, cash on pickup, subject to local business preference in docs.
- Languages: French first; architecture ready for Dutch and English.

## Information architecture
Minimum sections/pages:
- Home
- Shop / category listing
- Product detail page
- Repair services
- Refurbished devices
- Accessories
- About / trust page
- Contact / store info
- FAQ
- Cart / checkout
- Policy pages: shipping, returns, privacy, terms

## Home page priorities
- Clear hero: electronics shop + repair service in Liège.
- Service shortcuts: phone repair, laptop repair, accessories, refurbished deals.
- Trust band: address, phone, review proof, years in business, pickup options.
- Featured products.
- Featured repair offers.
- Why buy locally.
- FAQ preview.
- Footer with structured contact and local SEO signals.

## Design direction
- Tone: trustworthy, local, modern, practical.
- Avoid flashy startup gradients and generic AI SaaS layouts.
- Use a restrained neutral palette with one strong accent.
- Prioritize readable typography and dense-but-clean shopping UI.
- Mobile-first because many buyers will come from Facebook/mobile traffic.
- Dark mode optional for admin/dev previews, but customer storefront should prioritize clarity and retail conversion.

## UX rules
- One primary CTA per section.
- Repair booking and product purchase must not compete visually.
- Store pickup should be prominent.
- WhatsApp/contact shortcuts can be sticky on mobile.
- Use badges for condition: New, Refurbished, Used, In repair, Out of stock.
- Show warranty/condition clearly on refurbished products.

## Content model
Create structured content types:
- Product
- Category
- Brand
- Repair service
- Testimonial/review
- FAQ item
- Policy page
- Store settings

Suggested product schema:
- name
- slug
- sku
- brand
- short_description
- full_description
- category
- subcategory
- condition
- price
- sale_price
- currency
- stock_status
- quantity
- images
- specs
- warranty
- delivery_options
- pickup_available
- featured
- seo_title
- seo_description

Suggested repair service schema:
- service_name
- device_type
- issue_type
- starting_price
- estimated_time
- walk_in_available
- appointment_required
- warranty_info
- seo_title
- seo_description

## SEO requirements
- Optimize for local-intent terms around Liège.
- Build landing content for repair services and product categories.
- Add Organization, LocalBusiness, Product, FAQ, and Breadcrumb schema.
- Include crawlable text content on category pages.
- Generate unique titles/meta for products and services.
- Build internal links between repairs, products, brands, and FAQs.
- Make NAP consistent with verified business details.[page:0]

## Local trust elements
Always surface:
- Promedias name
- Rue Saint-Léonard 141, 4000 Liège
- Phone number
- Store hours if available in docs
- Facebook presence if still important
- Review snippets/testimonials where legally and factually allowed

## Deliverables Claude should produce
1. A project plan
2. Sitemap
3. Content model/schema
4. Design system proposal
5. Wireframe notes per page
6. Component inventory
7. Build-ready folder structure
8. Seed data format
9. SEO checklist
10. Launch checklist

## Build sequence
1. Read `docs/`
2. Summarize business facts from `docs/`
3. List unknowns
4. Propose stack
5. Create IA and schema
6. Define design system
7. Build reusable components
8. Implement pages
9. Add SEO/schema markup
10. QA for mobile, speed, and conversions

## Important behavior
If the project docs include logos, screenshots, exports, or product spreadsheets, use them before inventing placeholders. If docs are sparse, create a clean starter architecture with explicit TODO markers.
