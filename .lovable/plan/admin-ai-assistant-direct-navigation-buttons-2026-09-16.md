# Admin AI Assistant: direct navigation buttons

Make the assistant answer *and* hand the admin a button that opens the exact page — never a guess, never a made-up link.

## What you'll see

Ask "Where do I change the homepage banner?" and you get a short set of steps plus a button **Open Homepage Sections →** that takes you straight there.

- **Ambiguous wording** ("change the banner") shows 2-3 buttons — Homepage Sections, Announcement Bar, Promotional Banner — instead of guessing.
- **Shipping questions** state the current rules (GTA $4.99, free over $60, rest of Canada $15, US and international off) with a warning that changes affect new checkouts, then **Open Shipping Thresholds →**.
- **A specific order found by lookup** gets **Manage Tracking for SS-GR6RBI7F →**, which opens the orders page with that order's drawer already open.
- **A product found by lookup** shows current stock and price plus **Update Product Stock →** opening that product's editor.
- Every answer still says plainly that the assistant can't make the change itself.

## Route directory

A single approved list of real admin destinations, built from the existing sidebar and routes — no invented pages:

Dashboard, AI Assistant, Analytics (sales/products/customers/visitors/shipping/profit/SEO/conversion/abandoned/active carts), Orders, Email Campaigns, Email Templates, Email Testing, Products, Customers, Reviews, Flash Sales, Shipping Zones, Shipping Thresholds, Shipping Settings, Bulk Shipping Refund, Pages, Branding, Page Content, Sections, Site Content, QR Codes, Hero Images, Admin Settings (Users / Security / Integrations / System-announcement-bar tabs), Store Settings, Launch Cards, Waitlist, Uploads, Shopify Push, Sync.

## Deep linking that actually lands

Three small additions so links open the right spot, not just the right page:

- `/admin/admin-settings?tab=system` — Admin Settings reads a `tab` parameter (announcement bar lives in System).
- `/admin/orders?order=SS-XXXX` — Orders page opens that order's drawer automatically.
- `/admin/products/:id?focus=inventory` — product editor scrolls to and highlights the stock field.

Where a page has no sub-sections, the link simply opens the page.

## Technical details

**New `src/config/adminAssistantRoutes.ts`** — array of `{ id, title, description, route, keywords, requiredRole, group }` covering every destination above, plus:
- `isApprovedAdminRoute(href)`: must start with `/admin/` (or be `/admin`), must match a directory entry's path (allowing the three whitelisted query params `tab`, `order`, `focus` and a `:id` segment for `/admin/products/:id`), rejects external URLs, `javascript:`, protocol-relative `//`, and unknown paths.
- `buildOrderUrl(orderName)` and `buildProductUrl(localProductId)` helpers used by the edge function.

**`supabase/functions/admin-assistant/index.ts`**
- Import a Deno-side copy of the route directory (`supabase/functions/admin-assistant/routes.ts`, kept in sync manually) and inject the id/title/route list into the system prompt.
- New read-only tool `find_admin_page({ query })`: keyword/title match over the directory, returns up to 3 `{ id, title, description, route }`.
- `lookup_order` result gains `adminUrl: "/admin/orders?order=<name>"` per order, built from the Shopify order `name` (URL-encoded), never from free text.
- `lookup_product` additionally queries the legacy `products` table by title to resolve a local product id; when found, adds `adminUrl: "/admin/products/<id>?focus=inventory"`. When not found, returns `adminUrl: "/admin/products"`.
- `guide.ts`: add the navigation contract — explain, name the section, call the matching tool, never invent a URL, never claim to have made a change, offer 2-3 options when the request is ambiguous, and state shipping rules before linking to shipping settings.

**Rendering actions (`src/components/admin/AdminAssistantChat.tsx`)**
- After each assistant message, collect candidate hrefs from that turn's tool results (`route`, `adminUrl`) — not from the model's prose.
- Pass each through `isApprovedAdminRoute`; drop anything that fails.
- Render survivors as buttons (`<Link>` to the internal route) below the message: first one primary, rest secondary, labelled from the directory title or `Open <title> →` / `Manage Tracking for <order> →`.
- Dedupe repeated hrefs; cap at 3 buttons per message. The floating bubble navigates and closes itself on click.

**Deep-link support edits**
- `AdminSettings.tsx`: `useSearchParams` to set the initial `Tabs` value from `?tab=`, falling back to the current default.
- `OrdersList.tsx`: on load, if `?order=` matches a fetched order, open `OrderDrawer` for it.
- `ProductForm.tsx`: if `?focus=inventory`, scroll the stock/inventory field into view and ring-highlight it briefly.

**Not in scope:** any write capability. The assistant stays read-only.
