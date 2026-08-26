# Email Templates page in the admin menu

Add a dedicated **Email Templates** section to the admin sidebar where you can see every email that goes out to customers, preview exactly how it looks, edit the wording, and send yourself a test.

## What you get

1. **Template list** — every customer-facing email in one place:
   - Order confirmation
   - Shipping notification (with tracking link)
   - Delayed tracking notice
   - Announcement
   - Promotional
   - (Admin welcome / admin promotion shown separately as internal emails)

   Each row shows the display name, what triggers it, who receives it, and whether your copy has been customized.

2. **Live preview** — click a template to see the real rendered email (same code that actually sends) with realistic sample data, in a desktop/mobile toggle.

3. **Editable copy** — edit the subject line and the main editable text blocks (headline, intro/body message, CTA label and link, footer note) per template. Saved copy is used automatically on every real send; a "Reset to default" button restores the built-in wording. Order data, tracking numbers, and carrier links stay dynamic and are never editable.

4. **Send test** — enter any email address and send the currently previewed template (with your edits and sample data) so you can check it in your inbox.

## Technical notes

- New page `src/pages/AdminEmailTemplates.tsx` + components under `src/components/admin/email-templates/`, route `/admin/email-templates`, sidebar entry under the Content/Store group next to "Email Campaigns".
- New table `public.email_template_overrides` (`template_key` unique, `subject`, `blocks` jsonb, `updated_at`) with GRANTs and RLS restricted to admins via the existing `has_role` check. Public reads are not needed — only the edge function (service role) and admin UI read it.
- `supabase/functions/send-email/index.ts` gains:
  - a `preview: true` mode that returns rendered HTML instead of sending (used by the preview pane, admin-only),
  - an override lookup: before rendering, load the row for the template key and merge `subject`/`blocks` over the defaults.
- Templates in `send-email/_templates/*.tsx` get optional props for the editable blocks with the current hardcoded text as defaults, so nothing changes until you edit something.
- Test sends reuse the existing `send-email` function with sample data, so no new send path is introduced.

## Known constraint

Database migrations are currently failing on this project (the backend credential issue we hit earlier). If the migration for `email_template_overrides` still cannot run, I will ship the page with preview + test send working immediately, save the table SQL under `supabase/manual-sql/`, and have the editor fall back to read-only until the migration succeeds — then editing turns on with no further work.
