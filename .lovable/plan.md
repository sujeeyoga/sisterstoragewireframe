

## Plan: Enhanced Sections Manager

### Overview
Add 7 features to the Sections Manager: drag-and-drop reordering, add/delete sections, background color picker, duplicate section, product count badge, bulk visibility toggle, and link to shop page.

### Technical Details

**1. Install @dnd-kit (drag-and-drop)**
- Add `@dnd-kit/core` and `@dnd-kit/sortable` + `@dnd-kit/utilities`
- Wrap sections list in `DndContext` + `SortableContext`
- Each card becomes a sortable item; on `dragEnd`, recompute `display_order` values and batch-update all changed rows in `shop_sections`
- Remove the manual "Display Order" number input field

**2. Add/Delete sections**
- Header toolbar: "Add Section" button opens a dialog with fields for `name`, `title`, `subtitle`, `category_filter`, `layout_columns`
- Insert into `shop_sections` with `display_order` set to max+1
- Each card gets a "Delete" button (with confirmation dialog) that deletes from `shop_sections`

**3. Background color picker**
- Replace the raw text input with a popover containing preset Tailwind bg color swatches (e.g. `bg-background`, `bg-white`, `bg-gray-50`, `bg-stone-100`, `bg-pink-50`, `bg-orange-50`) plus a custom hex input
- Show a small color swatch preview next to the label

**4. Duplicate section**
- "Duplicate" button on each card
- Inserts a copy with `name` appended with " (copy)", `display_order` = max+1, same field values

**5. Product count badge**
- In `SectionPreview`, use the already-fetched `products` array length to render a `Badge` next to the section title showing e.g. "4 products"
- For `styled-by-sisters`, show story count instead

**6. Bulk visibility toggle**
- Add "Hide All" / "Show All" buttons in the page header
- Batch-update all `shop_sections` rows' `visible` field

**7. Link to shop page**
- Add an "View on Shop" button/link on each card
- Links to `/shop#section-{name}` (using the section `name` as an anchor)

### Files Modified
- `package.json` — add `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- `src/components/admin/SectionsManager.tsx` — major rewrite: DnD wrapper, add/delete/duplicate mutations, bulk toggle, header toolbar, color picker, view-on-shop link, product count badge
- `src/components/admin/SectionPreview.tsx` — expose product/story count for badge display

### No database changes needed — all features use the existing `shop_sections` table schema.

