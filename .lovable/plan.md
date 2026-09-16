# Admin AI Assistant

An AI helper inside the admin area that answers "how do I do this?" questions about your back end, and can also look up live store numbers when you ask.

## What it can answer

**How-to guidance** — written from your actual setup, so answers match your buttons and rules:
- Fulfilling orders (manual tracking vs Manage Fulfillment, the "Mark as fulfilled in Shopify" checkbox)
- Shipping zones and prices (GTA $4.99 free over $60, rest of Canada $15, US off, international off)
- Products, flash sales, reviews, customers
- Pages, sections, branding, site content, QR codes
- Settings, banners, email templates and campaigns
- Order tracking and the /track page

**Live store data** — it looks things up on request:
- Find a specific order by number or customer email: status, items, total, shipping address, tracking
- Recent order counts and revenue for a period (today, 7/30/90 days)
- Product stock and price lookup
- How many orders are still awaiting fulfillment

Read-only. It never changes orders, prices or settings — it tells you where to click instead.

## Where it appears

- A floating chat bubble in the bottom-right corner of every admin page (and only admin pages)
- A full "AI Assistant" page at `/admin/assistant`, added to the sidebar under Overview

Both use the same assistant. Conversations are not saved — closing the bubble or leaving the page starts fresh.

## How it looks

Matches the admin style: white surface, brand pink accents, max-width content, no customer-facing popups. Answers stream in as they are written. When the assistant looks something up, a small collapsed row shows what it checked (for example "Looked up order SS-GR6RBI7F"), which you can expand.

## Technical notes

- New edge function `admin-assistant` (streaming) using Lovable AI. The system prompt carries a written guide to this admin, kept in a shared file so it can be extended later.
- Auth: the function requires a signed-in user and verifies the `admin` role in `user_roles` before answering; non-admins get 403. Called through `functionsClient`.
- Tools available to the model (all read-only):
  - `lookup_order` — Shopify Admin API by order name or email, reusing the existing client-credentials token helper
  - `store_metrics` — order count / revenue / awaiting-fulfillment for a date range
  - `lookup_product` — product name, price, stock
- Frontend: install AI Elements primitives (conversation, message, prompt-input, shimmer, tool) and build `AdminAssistantChat` used by both the bubble and the page; `useChat` with `DefaultChatTransport`, no persistence.
- Errors surfaced plainly: rate limit and credit-exhaustion messages shown in the chat rather than a generic failure.

## Out of scope

- Making changes on your behalf (editing orders, prices, settings)
- Saved chat history
- Customer-facing chat
