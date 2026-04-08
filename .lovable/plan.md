

## Problem

The global `overflow-x: hidden` on `html` and `body` (added to fix horizontal elastic scrolling) is hiding elements in the admin dashboard. This is too aggressive — it clips the sidebar, popovers, and any content that relies on overflow being visible.

## Solution

Remove the global `overflow-x: hidden` from `html, body` and instead apply it only to the main content area of the admin dashboard, or scope it to non-admin pages.

### Changes

**1. `src/index.css`** — Remove the blanket `overflow-x: hidden` from `html, body`

Remove lines 17-19:
```css
html, body {
  overflow-x: hidden;
}
```

**2. `src/components/admin/AdminDashboard.tsx`** — Add `overflow-x-hidden` to the dashboard's root container div (line 353) so only the dashboard content prevents horizontal scroll, not the entire page.

Change the container div to:
```tsx
<div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-[1600px] overflow-x-hidden">
```

**3. `src/components/admin/AdminLayout.tsx`** — Add `overflow-x-hidden` to the `<main>` element to prevent horizontal scroll within the admin content area without affecting the sidebar or global layout.

This approach scopes the overflow restriction to the content area only, preserving sidebar visibility and popover rendering.

