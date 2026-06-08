# Plan: Export Sister Storage as Shopify Liquid Theme Sections

No framework migration. This Lovable app stays exactly as it is. I'll generate a folder of **Shopify Liquid `.liquid` section + snippet files** that mirror the current site's look (brand pink `#FC0079`, Poppins, pill buttons, rounded cards), ready to drop into your existing Shopify theme.

## What you get (delivered as downloadable files in `/mnt/documents/shopify-theme/`)

### 1. Foundation
- `snippets/ss-design-tokens.liquid` — CSS variables for brand colors, fonts, radii, shadows. Include once in `theme.liquid` `<head>`.
- `assets/ss-base.css` — Poppins import, base typography, button utility classes (`.ss-btn-primary`, `.ss-btn-outline`, pill variants), animation keyframes (`ss-fade-in`, `ss-slide-in`).

### 2. Sections (each = one Shopify section with schema)
- `sections/ss-header.liquid` — Sticky white floating navbar with pink banner strip behind it, logo + nav links + account/cart icons. Schema lets merchant edit links & logo.
- `sections/ss-hero.liquid` — Mobile stacked / desktop two-column hero. Headline, subhead, image, two CTAs — all schema-editable.
- `sections/ss-promo-banner.liquid` — Centered pink "CULTURE WITHOUT CLUTTER." banner.
- `sections/ss-best-sellers.liquid` — Product carousel bound to a Shopify collection (merchant picks collection in theme editor).
- `sections/ss-featured-grid.liquid` — Image grid / bento layout for editorial blocks.
- `sections/ss-testimonials.liquid` — Sister Stories style testimonial cards.
- `sections/ss-newsletter.liquid` — Email signup wired to Shopify's customer form.
- `sections/ss-footer.liquid` — Footer with link columns + copyright.

### 3. Snippets (reusable)
- `snippets/ss-product-card.liquid` — Product card matching current shop grid (image, title, price, sale badge).
- `snippets/ss-button.liquid` — Button partial with `variant` param (primary / outline / pill-pink).

### 4. README
- `README.md` with: how to install (drop into theme via Shopify CLI or Online Store → Themes → Edit code), which file to include in `theme.liquid`, how each section maps to the Lovable component it came from, and known differences (parallax, video carousels, and Lovable Cloud-backed features like flash sales / discount banner are **not** ported — those are app/server features that need Shopify apps or metafields).

## What is intentionally NOT exported

These rely on Lovable Cloud (Supabase) backend logic and can't be 1:1 Liquid:
- Flash sale countdowns / dynamic discount banner (would need a Shopify Scripts/Functions app or metafield-driven banner)
- Customer order tracking pages (Shopify has native order status pages)
- Admin panel, abandoned cart analytics, visitor presence
- QR code redirects, product thank-you pages
- Sister Stories video carousel (can be added as a Liquid section later if you want — needs hosted video URLs)

## Technical notes

- Liquid uses Shopify's `{{ section.settings.* }}` for editor-configurable fields and `{% schema %}` blocks for the theme editor UI.
- All colors driven by CSS variables in `ss-design-tokens.liquid` so merchant can recolor without touching markup.
- Tailwind utility classes from the React app are **converted to plain CSS** in `ss-base.css` (Shopify themes don't ship Tailwind by default — keeps install zero-config).
- Images: `{{ 'filename.jpg' | asset_url | img_url: '800x' }}` pattern for responsive Shopify CDN delivery.
- Cart/checkout uses Shopify's native cart (`/cart/add`, `/checkout`) — no Storefront API needed for a theme.

## Deliverable

A single zip at `/mnt/documents/sisterstorage-shopify-theme.zip` containing the `sections/`, `snippets/`, `assets/`, and `README.md` above. You unzip it into your theme directory (or upload via Shopify admin) and add each section through the theme editor.

Approve and I'll build the files.
