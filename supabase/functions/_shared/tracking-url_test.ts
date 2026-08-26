import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { getTrackingUrl } from "./tracking-url.ts";

Deno.test("creates direct carrier tracking URLs", () => {
  assertEquals(
    getTrackingUrl("Stallion Express", "AB 12/34"),
    "https://www.stallionexpress.ca/tracking?tracking_number=AB%2012%2F34",
  );
  assertEquals(
    getTrackingUrl("Chit Chats", "CC123"),
    "https://chitchats.com/tracking?shipment_id=CC123",
  );
  assertEquals(
    getTrackingUrl("Canada Post", "CP123"),
    "https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=CP123",
  );
  assertEquals(getTrackingUrl("UPS", "1Z123"), "https://www.ups.com/track?tracknum=1Z123");
  assertEquals(
    getTrackingUrl("FedEx", "FDX123"),
    "https://www.fedex.com/fedextrack/?tracknumbers=FDX123",
  );
});

Deno.test("uses an encoded fallback for unknown carriers", () => {
  assertEquals(
    getTrackingUrl("Other", "ABC 123"),
    "https://www.google.com/search?q=ABC%20123%20tracking",
  );
});