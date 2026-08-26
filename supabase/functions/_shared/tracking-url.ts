const encodeTrackingNumber = (trackingNumber: string) =>
  encodeURIComponent(trackingNumber.trim());

export const getTrackingUrl = (
  carrier: string | null | undefined,
  trackingNumber: string,
): string => {
  const normalizedCarrier = carrier?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
  const encoded = encodeTrackingNumber(trackingNumber);

  if (normalizedCarrier.includes("stallion")) {
    return `https://www.stallionexpress.ca/tracking?tracking_number=${encoded}`;
  }
  if (normalizedCarrier.includes("chitchat")) {
    return `https://chitchats.com/tracking?shipment_id=${encoded}`;
  }
  if (normalizedCarrier.includes("canadapost")) {
    return `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${encoded}`;
  }
  if (normalizedCarrier.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${encoded}`;
  }
  if (normalizedCarrier.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?tracknumbers=${encoded}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(`${trackingNumber.trim()} tracking`)}`;
};