
Goal
- Fix the “STYLED BY OUR SISTERS” video experience on mobile so videos reliably load and play, even when autoplay is blocked or network is slow.

What I found
- The section is powered by `src/components/community/SisterStoriesCarousel.tsx`.
- It currently tries to:
  1) fetch all stories from Supabase,
  2) burst-preload all videos in parallel (`burstPreloadVideos`),
  3) autoplay via IntersectionObserver.
- There is no user-play fallback if autoplay is blocked.  
  - The `<video>` has `pointerEvents: 'none'`, so users can’t tap the video itself to start playback.
  - “Tap to unmute” only appears when video is already playing.
- Session/network behavior shows frequent media `ERR_ABORTED` entries, which is common when many media requests are started/stopped rapidly (especially with aggressive preload + play/pause/reset loops on mobile).
- DB data contains mixed URL styles (`/lovable-uploads/...` and full Supabase URLs), so source normalization should be made explicit and robust.

Implementation plan
1) Stabilize loading strategy for mobile
- In `SisterStoriesCarousel.tsx`, remove burst preloading of all videos (`burstPreloadVideos`) for this carousel.
- Change video preload from aggressive full loading to lightweight metadata-first behavior.
- Keep only near-viewport videos eligible to load/play to avoid bandwidth contention.

2) Add reliable playback fallback (critical)
- Add explicit playback state per story: `idle | loading | playing | blocked | error`.
- On intersection:
  - Attempt `video.play()`.
  - If play promise rejects, mark state as `blocked` instead of silently ignoring.
- Render a visible “Tap to Play” overlay/button when state is `blocked` (or first-load not started), and on tap:
  - call `video.play()` from user gesture,
  - then reveal existing mute/unmute behavior.
- Remove `pointerEvents: 'none'` from `<video>` or keep it but ensure overlay button captures tap and can always start playback.

3) Make URL handling explicit and safe
- Add a small helper in `SisterStoriesCarousel.tsx`:
  - If `video_url` starts with `http`, use as-is.
  - If it starts with `/`, resolve against `window.location.origin`.
- Use normalized URL in `src` and `<source>` to avoid environment inconsistencies.

4) Reduce play/pause thrash
- Adjust IntersectionObserver behavior:
  - avoid immediate `currentTime = 0` on every out-of-view event;
  - pause only, and reset only when truly far out of view or after slide change.
- Lower sensitivity (threshold/rootMargin tuning) so minor scroll jitter doesn’t constantly stop/restart videos.

5) UX and resilience polish
- Add per-video loading/error overlays:
  - Loading spinner while metadata not ready.
  - Retry button on error.
- Keep section visible even if some videos fail; only those cards show fallback state.

Technical notes
- Primary file: `src/components/community/SisterStoriesCarousel.tsx`
- Optional cleanup: remove now-unused `burstPreloadVideos` import in this component.
- Keep existing carousel structure and “Tap to unmute” UX, but layer it after successful playback start.
- Preserve muted autoplay attempt for browsers that allow it; fallback handles browsers/devices that do not.

Validation checklist (end-to-end)
1) Mobile preview (390px) on `/`:
- Scroll to “STYLED BY OUR SISTERS”.
- Confirm first visible card either auto-plays muted or shows “Tap to Play”.
- Tap to Play starts video consistently.
- Tap to unmute works after playback starts.

2) Published URL on a real phone:
- Repeat above on iOS Safari and Android Chrome if possible.
- Confirm no “all black / never starts” cards.
- Swipe carousel; next videos start or provide playable fallback.

3) Regression checks
- Culture Bag videos still play.
- Best Seller images still load.
- No console runtime errors from carousel state handling.

Expected outcome
- Users will always have a working path to watch videos on mobile:
  - autoplay when allowed,
  - one-tap play when autoplay is blocked.
- Reduced network thrash and fewer perceived “videos not working” reports.
