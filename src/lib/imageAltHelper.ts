/**
 * Generate SEO-optimized alt text for images
 * Ensures "Sister Storage" brand appears in all image alt text for Google Image search
 */

export const brandImageAlt = (description: string, category?: string): string => {
  const base = `Sister Storage ${description}`;
  return category ? `${base} - ${category}` : base;
};

export const productImageAlt = (productName: string, category?: string): string => {
  return brandImageAlt(productName, category || 'Premium Bangle Storage');
};

export const galleryImageAlt = (title: string): string => {
  return brandImageAlt(title, 'Jewelry Organization Canada');
};
