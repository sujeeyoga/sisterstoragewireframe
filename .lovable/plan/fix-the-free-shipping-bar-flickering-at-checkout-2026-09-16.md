# Fix the free-shipping bar flickering at checkout

## What's happening

In your video the "Spend $15.00 more for FREE SHIPPING" bar at the top of the Order Summary appears, disappears, and reappears repeatedly. It is not a display glitch — the bar is being torn down and rebuilt in a loop.

Confirmed cause, from the code:

1. The bar asks the shipping service for the threshold every time something changes.
2. Right before each request it blanks the threshold, and a blank threshold means "hide the bar completely".
3. The trigger list for that request includes two values that are rebuilt on every single render (the shipping-calculation function and the cart item list). So finishing one request causes a re-render, which starts another request, which blanks the bar again — an endless in/out cycle.

The same pattern exists in the small free-shipping counter in the cart header, so it flickers too.

## The fix

- Make the shipping-calculation function stable so it stops re-triggering itself.
- Trigger recalculation only when the address or cart contents actually change (compare the cart by a simple text signature rather than by object identity).
- Stop blanking the threshold while a new quote is in flight: keep showing the last known bar and only replace the number when the new answer arrives. The bar only disappears when the cart is empty or no free-shipping threshold applies to that destination.
- Apply the same three changes to the cart-header free-shipping counter.

No pricing rules change. Toronto/GTA stays $4.99 free over $60, and the rest of the rates are untouched.

## Technical details

- `src/hooks/useShippingZones.tsx`: wrap `calculateShipping` in `useCallback` with an empty dependency list (it only uses the module-level `functionsClient`), so consumers get a stable reference.
- `src/components/cart/FreeShippingThresholdBar.tsx`:
  - Derive `itemsKey = cartItems.map(i => `${i.id}:${i.quantity}`).join('|')` and use it in the effect deps instead of the `cartItems` array.
  - Remove `setThreshold(null)` from inside `calculate()`; only reset threshold when the cart is empty or the address is incomplete.
  - Keep the 500 ms debounce; add a cancelled flag so a late response from a superseded request can't overwrite newer state.
- `src/components/cart/FreeShippingCartIndicator.tsx`: same three changes.

## Verification

Load `/checkout` with one item, watch the Order Summary for ~15 seconds: the bar stays on screen steadily. Change the city/postal code and confirm the number updates once, without the bar vanishing.
