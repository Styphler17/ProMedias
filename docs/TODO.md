# Project TODO List - ProMedias

This file serves as a persistent record of tasks and progress to ensure continuity across sessions.

## 1. WordPress & WooCommerce Setup
- [x] Set WordPress Permalinks to **"Post name"**.
- [x] Generate WooCommerce REST API Keys (Read/Write).
- [ ] Create/Verify Product Attributes in WordPress:
    - `Specs` (text)
    - `Condition` (Excellent, Good, etc.)
    - `Score` (Numeric value 0-100)

## 2. Infrastructure & Connectivity
- [x] Create `.env` file with API credentials.
- [x] Configure Vite Proxy in `vite.config.ts` to bypass CORS.
- [x] Update `src/lib/woocommerce.ts` to use the proxy path.

## 3. Front-end Integration
- [x] Update `src/pages/Shop.tsx` to fetch dynamic products instead of mock data.
- [x] Implement robust attribute mapping in `woocommerce.ts`.
- [x] Implement `isLoading` state handling in the UI (added high-end skeleton loaders).
- [ ] Verify category mapping ("Téléphonie", "Informatique", "Accessoires") works with WordPress categories.

## 4. Testing & Optimization
- [ ] Verify image gallery rendering in the Product Modal.
- [ ] Test search and filtering with real data.
- [ ] Benchmark performance for large product catalogs.

## Current Status
Connection is **READY**. Vite proxy is configured, API URLs are updated, and attribute mapping is robust (case-insensitive). Ready for user to test with their WordPress product.
