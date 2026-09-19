# Store Assistant redesign

Restyle the admin assistant to match the uploaded mockup, and let its answers come back as clean cards instead of plain paragraphs. Applies to both the corner bubble and the full assistant page.

## Look

- Header bar: pink rounded logo tile, "Store Assistant" title, green dot + "Online" status, and a "..." menu on the right (expand to full page, clear conversation).
- Your messages: pink bubble, white text, right aligned, with a small time under it.
- Assistant replies: white card on the page, small pink logo beside it, time underneath.
- Quick-reply chips sit just above the typing box (currently they only show on the empty screen). They stay visible and change to sensible follow-ups once a conversation starts.
- Typing box: rounded pill, placeholder "Ask about an order or store setting...", round pink send button on the right.
- Overall page tint: soft pink, matching the mockup.

## Answer cards

When the assistant does something more than chat, its reply renders as a structured card with any of these sections:

- Title + one-line summary
- A stats strip (e.g. "Last 3 days — 0 orders", "No errors detected")
- A "Checks completed" list with green ticks, status pills and expandable detail
- Numbered "how to" steps
- A yellow caution note when relevant (e.g. "A live checkout may charge your card")
- Action buttons at the bottom — filled pink for the main one, outlined for the rest

Buttons keep the existing rule: only links to approved admin pages, plus "Open storefront". The assistant stays read-only — it never changes orders, prices or settings.

## Technical notes

- New `src/components/admin/assistant/` pieces: `AssistantHeader`, `AssistantAnswerCard` (stats / checks / steps / caution / actions sub-parts), `QuickReplies`, `MessageMeta` (timestamp).
- The assistant gets one new read-only tool, `answer_card`, whose arguments are the card contents (title, summary, stats[], checks[], steps[], caution, actions[]). When a message contains an `answer_card` part it renders as the card and the plain text reply is suppressed for that part; otherwise messages render as today. Card action hrefs are still filtered through `isApprovedAdminRoute`.
- System prompt in `supabase/functions/admin-assistant/guide.ts` gains guidance on when to answer with a card (diagnostics, how-to walkthroughs, status checks) versus plain text (short factual answers).
- Keep AI Elements primitives: `Conversation`, `Message`/`MessageResponse`, `PromptInput`, `Shimmer`, `Tool`. The card renders inside `MessageContent`; the existing collapsed tool rows stay for lookups.
- All colours come from existing design tokens (primary pink, muted, destructive) plus two new tokens for the success tick/pill and the caution banner — no hardcoded hex or `text-white`.
- Bubble grows slightly (approx. 26rem wide) so cards fit; cards stack vertically on narrow widths.
- No chat history storage — conversations still reset when closed, as today.
