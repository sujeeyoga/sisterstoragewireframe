# Email Templates page redesign

Rebuild the look and layout of `/admin/email-templates` to the supplied specification: white-first surfaces, blush pink accents, bright pink reserved for actions, and a balanced three-column workspace. This is a presentation-only change — sending, preview rendering, saving, and test sends keep their current behaviour.

## What changes

### 1. Page shell and header
- Almost-white warm page background (`#FFF9FC`), 28/32px padding, content capped at 1500px.
- Header row: rounded soft-pink icon tile (54px) + 38px/700 title "Email Templates" with a secondary description line, actions on the right.

### 2. Three-column workspace
- Grid: sidebar / editor / preview at `minmax(300px,0.9fr) minmax(390px,1fr) minmax(430px,1.1fr)`, 22px gap, stacking on smaller screens.
- All three columns share one `panel` treatment: white surface, 1px `#E7E7EB` border, 14px radius, very subtle shadow.

### 3. Sidebar
- Uppercase 12px section label header with divider.
- Each template becomes a card-like row (72px min height): coloured icon tile, sentence-case name (15px/600), short description (13px, secondary grey, not uppercase), chevron on the right.
- States: white default, `#FAFAFC` hover, `#FFF1F7` + `#FFD1E4` border when selected (no solid pink block).
- Per-template icon colours: order (pink), shipping (indigo), tracking (violet), announcement (green), promotional (amber), admin (violet).
- "Edited" badge stays, restyled as a small neutral pill.

### 4. Editor panel
- Title row: 24px/700 name + pill-style "Customer"/"Internal" badge in soft pink.
- Metadata hierarchy: one-line trigger sentence, then a small "Recipient" label with its value below.
- Warning card compacted to a 13px two-line note ("Saving temporarily unavailable / You can continue editing, previewing and sending test emails.") in the amber palette.
- Form fields: 14px/600 labels, 48px inputs with 9px radius and pink focus ring, textareas 110px min, 12px helper text, `{{orderNumber}}`-style variables rendered as monospace chips.
- Sticky footer inside the panel: "Reset to default" (secondary) left, "Save copy" (primary pink) right, always visible while scrolling.
- "Send a test" stays below the editor as its own bordered block with input + pink button.

### 5. Preview panel
- Header row with title and a segmented desktop/mobile toggle (pill container, pink active segment).
- Grey canvas (`#F7F7F9`, 12px radius, 650px min height) with the email centred at max 620px, white, bordered, soft drop shadow — so it reads as a real email, not another dashboard card.
- The panel is never visually empty: skeleton while rendering, last successful preview kept on screen during re-renders, and a friendly inline error card (with retry) instead of the bare "No preview returned" text.

### 6. Bottom status strip
- Move backend-status messaging out of the editor into a full-width white strip below the workspace: "Saving unavailable — email copy storage is temporarily unavailable. Editing and previewing still work."

## Technical notes

- Add the spec's colour, radius, and spacing values as semantic tokens in `src/index.css` (scoped `admin-email-*` tokens) and map them in `tailwind.config.ts`, so components use tokens rather than hex literals.
- Files touched: `src/pages/AdminEmailTemplates.tsx` (shell, header, grid, status strip), a new `EmailTemplateList.tsx` for the sidebar rows and icon map, `EmailTemplateEditor.tsx` (layout, sticky footer, compact warning, variable chips), `EmailTemplatePreview.tsx` (canvas, toggle, skeleton/last-good/error states).
- Preview state handling: keep the previously rendered HTML in state so a failed re-render shows the stale preview plus a small inline notice, instead of blanking the panel.
- No changes to `send-email`, the template catalog data, override save/reset logic, or test-send behaviour.
