# Adaptive Video Loading for Slow Mobile Connections

The Culture Bag teaser video is a 13 MB MP4 served to everyone. Plan: create a lightweight compressed version and serve it only to visitors on slow mobile connections, while keeping full quality for everyone else.

## What gets built

1. **Compressed variant of the teaser**
   - Encode `culture-bag-teaser.mp4` into a low-bandwidth version (roughly 480p, lower bitrate, target ~1-1.5 MB) saved alongside the original as `culture-bag-teaser-lite.mp4`.
   - Original 13 MB file stays untouched for fast connections.

2. **Connection-aware hook** (`src/hooks/use-connection-quality.tsx`)
   - Reads the browser Network Information API (`navigator.connection`): `effectiveType` (`slow-2g`/`2g`/`3g`), `saveData`, and `downlink`.
   - Combines with the existing mobile check so "slow" only applies on phones.
   - Falls back to "fast" when the API is unavailable (Safari/iOS), so no one gets a downgraded experience by accident.

3. **Wire it into the teaser**
   - `src/components/shop/CultureBagPromo.tsx` picks the lite source when the hook reports a slow mobile connection, otherwise the original.
   - Keep `preload="metadata"` and lazy behaviour already in place.

## Notes

- Only the Culture Bag teaser is covered here. The three Sister Story videos (12-18 MB each) can get the same treatment in a follow-up if you want.
- iOS Safari does not expose connection info, so those users get the full-quality file unless they have Data Saver signals.
