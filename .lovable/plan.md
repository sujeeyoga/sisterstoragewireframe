

## Plan: Add Rod Count & Size as Subheading on Thank You Page

### Problem
The `useProductsCatalog` hook hardcodes `attributes: {}`, discarding rod count and size data from the database. The thank-you page has no subheading showing these details.

### Changes

**1. `src/hooks/useProductsCatalog.tsx` — Parse attributes from DB**
- Add attribute parsing logic (same normalization as `transformProduct`) to populate `attributes` with `rodcount`, `size`, etc.

**2. `src/pages/ProductThankYou.tsx` — Show rod count & size as subheading**
- Below the product name `<h2>`, add a subtitle line showing rod count and size extracted from `product.attributes` (e.g., "4 Rods · Large").
- Display conditionally — only when values exist.

### Result
Every product's thank-you page will show relevant rod count and size info directly under the product name as a clean subtitle.

