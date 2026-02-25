

## Remove Fade-In Effects from Culture Bag Page

Remove all opacity transition effects on images and videos so they appear instantly when loaded, while keeping the gray loading skeletons.

### Changes to `src/pages/CultureBag.tsx`

1. **Main image**: Remove `transition-opacity duration-300` and the conditional `opacity-0`/`opacity-100` classes. Always show `opacity-100`.

2. **Thumbnail images**: Same — remove the opacity transition classes.

3. **Video 1 (Lose the Mess)**: Remove `transition-opacity duration-300` and conditional opacity classes.

4. **Video 2 (Culture Bag teaser)**: Same treatment.

5. **Keep loading skeletons**: The gray pulsing placeholders remain so there's no layout shift, but the media just pops in instantly instead of fading.

### Technical Detail

For each media element, change classes like:
```
className={`... transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
```
to:
```
className={`... ${loaded ? 'opacity-100' : 'opacity-0'}`}
```

Or simply always render at full opacity and rely on the skeleton underneath disappearing naturally. The loading state tracking and skeletons stay intact.

