
## Improve the "Make Space For Culture" Section on Desktop

The bottom description section currently feels narrow and text-heavy on desktop, with the video stretching full width within a narrow container. Here's the plan to make it more visually engaging and better structured:

### Changes to `src/pages/CultureBag.tsx`

**1. Wider section with two-column layout for text + video**
- Change the section from `max-w-3xl` to `max-w-6xl` to use more of the desktop screen
- Place the intro text and video side-by-side in a `grid grid-cols-1 lg:grid-cols-2` layout
- Left column: heading + intro paragraphs
- Right column: the teaser video

**2. Bold closing statements as a centered block**
- Keep the three "No more..." statements below the grid as a centered, impactful text block
- Add spacing and visual separation from the content above

**3. Better vertical rhythm**
- Add top padding/margin to separate this section from the product grid above
- Add a subtle top border or extra spacing to create a clear visual break

### Technical Details

- Wrap the heading, intro paragraphs, and video in a two-column grid (`lg:grid-cols-2 gap-12 items-center`)
- Move the video into the right column so it sits beside the text on desktop
- The remaining body text and bold statements stay below the grid, centered at `max-w-3xl`
- On mobile, everything stacks vertically as before (single column fallback)
