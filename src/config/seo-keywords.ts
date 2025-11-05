/**
 * Centralized SEO Keywords Configuration
 * Organized by category for better maintainability and targeted SEO
 */

export const seoKeywords = {
  // Brand keywords
  brand: [
    'sister storage',
    'sisterstorage',
  ],
  
  // Core product keywords
  product: [
    'bangle organizer',
    'bangle storage box',
    'bracelet organizer box',
    'premium bangle organizer',
    'jewelry storage',
    'jewellery storage',
    'clear jewellery box for bangles',
    'acrylic jewellery storage box bangles',
    '4 rod bangle storage',
    'stackable jewelry box',
    'dust free organizer',
  ],
  
  // Gift-focused keywords
  gift: [
    'gift for jewellery lover storage box',
    'women\'s jewellery organiser box luxury',
    'keepsake box',
  ],
  
  // Use case keywords
  useCase: [
    'display box for bangles',
    'travel jewellery storage case for bracelets',
    'keep your bangles organised box',
  ],
  
  // Cultural/regional keywords
  cultural: [
    'south asian jewelry storage',
    'canadian jewelry organizer',
  ],
};

/**
 * Get keywords for homepage/global SEO
 */
export const getGlobalKeywords = (): string => {
  return [
    ...seoKeywords.brand,
    'bangle storage box',
    'premium bangle organizer',
    'bracelet organizer box',
    'clear jewellery box for bangles',
    'jewelry storage',
    '4 rod bangle storage',
    'stackable jewelry box',
    'dust free organizer',
    'south asian jewelry storage',
    'canadian jewelry organizer',
  ].join(', ');
};

/**
 * Get keywords for shop page
 */
export const getShopKeywords = (): string => {
  return [
    ...seoKeywords.brand,
    ...seoKeywords.product,
    'display box for bangles',
    'acrylic jewellery storage box bangles',
  ].join(', ');
};

/**
 * Get keywords for product pages based on product attributes
 */
export const getProductKeywords = (
  productName: string,
  categories?: string[],
  attributes?: {
    rodCount?: string | string[];
    size?: string | string[];
    useCase?: string[];
    bundleSize?: string;
  }
): string => {
  const keywords = [
    ...seoKeywords.brand,
    'bangle storage box',
    'premium bangle organizer',
    'bracelet organizer box',
  ];

  // Add category-specific keywords
  if (categories?.some(cat => cat.toLowerCase().includes('bundle'))) {
    keywords.push('gift for jewellery lover storage box');
    keywords.push('women\'s jewellery organiser box luxury');
  }

  // Add attribute-specific keywords
  const rodCount = Array.isArray(attributes?.rodCount) 
    ? attributes.rodCount 
    : attributes?.rodCount ? [attributes.rodCount] : [];
  if (rodCount.some(r => String(r) === '4')) {
    keywords.push('4 rod bangle storage');
  }

  if (attributes?.useCase?.includes('Travel')) {
    keywords.push('travel jewellery storage case for bracelets');
  }

  const size = Array.isArray(attributes?.size) 
    ? attributes.size 
    : attributes?.size ? [attributes.size] : [];
  if (size.includes('Medium') || size.includes('Large')) {
    keywords.push('display box for bangles');
  }

  // Add material keywords if acrylic
  if (productName.toLowerCase().includes('acrylic') || productName.toLowerCase().includes('clear')) {
    keywords.push('acrylic jewellery storage box bangles');
    keywords.push('clear jewellery box for bangles');
  }

  // Add organizational keywords
  keywords.push('keep your bangles organised box');
  keywords.push('jewelry storage');
  keywords.push('stackable jewelry box');

  return [...new Set(keywords)].join(', ');
};
