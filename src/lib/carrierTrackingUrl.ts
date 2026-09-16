/**
 * Returns a customer-facing tracking URL for a carrier and tracking number.
 * Falls back to a Google search if the carrier is unknown.
 */
export function getCarrierTrackingUrl(carrier: string | null | undefined, trackingNumber: string): string | null {
  if (!carrier || !trackingNumber.trim()) return null;
  const c = carrier.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (c.includes('stallion')) {
    return `https://my.stallionexpress.com/shipments/${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('chitchat')) {
    return `https://chitchats.com/shipments/${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('canadapost')) {
    return `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('fedex')) {
    return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('usps')) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('purolator')) {
    return `https://www.purolator.com/en/shipping/tracker?pin=${encodeURIComponent(trackingNumber)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(trackingNumber + ' tracking')}`;
}
