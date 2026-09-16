# Fix the mismatched "30d" label on the dashboard

## What's actually happening

The numbers are not mixing periods. Every card on the dashboard (revenue, orders, average order value, awaiting fulfillment) is calculated from one single query that uses whichever range button is selected — Today, 7 Days, 30 Days, 90 Days, or a custom range.

The only thing wrong is the small grey line under Total Orders: it always says "All orders (30d)" because that text was typed in by hand and never updated with the selected range. With 90 Days selected, those 129 orders are 90-day orders labelled incorrectly.

## The fix

Make that line describe the range that is actually selected:

- Today -> "All orders (today)"
- 7 Days -> "All orders (last 7 days)"
- 30 Days -> "All orders (last 30 days)"
- 90 Days -> "All orders (last 90 days)"
- Custom -> "All orders (Sep 1 - Sep 16)" using the chosen dates

Also add the same range wording under Net Revenue and Awaiting Fulfillment so it's obvious at a glance that all cards cover the same period.

## Technical detail

In `src/components/admin/AdminDashboard.tsx`, add a small `rangeLabel` derived from the existing `dateRange` state (and `customStartDate`/`customEndDate`, formatted with `date-fns`). Replace the hardcoded string on line 620 and append the label to the Net Revenue and Awaiting Fulfillment subtitles. No query or calculation changes — `getDateRangeStart` / `getDateRangeEnd` already drive the stats query correctly and the query key already includes the range.
