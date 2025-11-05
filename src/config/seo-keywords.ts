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
    'tangle-free bangle storage box',
  ],
  
  // Gift-focused keywords
  gift: [
    'gift for jewellery lover storage box',
    'women\'s jewellery organiser box luxury',
    'keepsake box',
    'stylish jewellery storage solution bangles',
    'luxury finish jewellery organiser women',
  ],
  
  // Use case keywords
  useCase: [
    'display box for bangles',
    'travel jewellery storage case for bracelets',
    'keep your bangles organised box',
    'visible/displayable bangle storage box',
  ],
  
  // Feature keywords
  features: [
    'dust-proof jewellery organiser box',
    'easy-access bangle box rods removable',
    'tangle-free bangle storage box',
  ],
  
  // Protection keywords
  protection: [
    'protect gold bangles storage box',
  ],
  
  // Space-saving keywords
  spaceSaving: [
    'space-saving bangle box for wardrobes',
  ],
  
  // Call-to-action keywords
  callToAction: [
    'upgrade your jewellery storage with bangle box',
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
    'tangle-free bangle storage box',
    'dust-proof jewellery organiser box',
    'protect gold bangles storage box',
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
    ...seoKeywords.features,
    'display box for bangles',
    'acrylic jewellery storage box bangles',
    'stylish jewellery storage solution bangles',
    'luxury finish jewellery organiser women',
    'space-saving bangle box for wardrobes',
    'upgrade your jewellery storage with bangle box',
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
    removableRods?: boolean;
    stackable?: boolean;
  }
): string => {
  const keywords = [
    ...seoKeywords.brand,
    'bangle storage box',
    'premium bangle organizer',
    'bracelet organizer box',
  ];

  // All products get tangle-free benefit
  keywords.push('tangle-free bangle storage box');
  keywords.push('keep your bangles organised box');

  // Add category-specific keywords
  if (categories?.some(cat => cat.toLowerCase().includes('bundle'))) {
    keywords.push('gift for jewellery lover storage box');
    keywords.push('women\'s jewellery organiser box luxury');
    keywords.push('luxury finish jewellery organiser women');
  }

  // Add attribute-specific keywords
  const rodCount = Array.isArray(attributes?.rodCount) 
    ? attributes.rodCount 
    : attributes?.rodCount ? [attributes.rodCount] : [];
  if (rodCount.some(r => String(r) === '4')) {
    keywords.push('4 rod bangle storage');
  }

  // Removable rods feature
  if (attributes?.removableRods || rodCount.length > 0) {
    keywords.push('easy-access bangle box rods removable');
  }

  if (attributes?.useCase?.includes('Travel')) {
    keywords.push('travel jewellery storage case for bracelets');
  }

  const size = Array.isArray(attributes?.size) 
    ? attributes.size 
    : attributes?.size ? [attributes.size] : [];
  if (size.includes('Medium') || size.includes('Large')) {
    keywords.push('display box for bangles');
    keywords.push('visible/displayable bangle storage box');
  }

  // Add material keywords if acrylic/clear
  if (productName.toLowerCase().includes('acrylic') || productName.toLowerCase().includes('clear')) {
    keywords.push('acrylic jewellery storage box bangles');
    keywords.push('clear jewellery box for bangles');
    keywords.push('dust-proof jewellery organiser box');
  }

  // Protection for gold bangles
  if (productName.toLowerCase().includes('premium') || 
      productName.toLowerCase().includes('luxury') ||
      categories?.some(cat => cat.toLowerCase().includes('premium'))) {
    keywords.push('protect gold bangles storage box');
  }

  // Space-saving for stackable products
  if (attributes?.stackable || productName.toLowerCase().includes('stackable')) {
    keywords.push('space-saving bangle box for wardrobes');
    keywords.push('stackable jewelry box');
  }

  // Add organizational keywords
  keywords.push('jewelry storage');
  
  // Add call-to-action for premium products
  if (productName.toLowerCase().includes('premium') || 
      productName.toLowerCase().includes('luxury')) {
    keywords.push('upgrade your jewellery storage with bangle box');
  }

  return [...new Set(keywords)].join(', ');
};
