// Database product type matching woocommerce_products table
export interface DatabaseProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  stock_quantity: number | null;
  manage_stock: boolean;
  in_stock: boolean;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  meta_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  synced_at: string;
}

// Transformed product type for frontend use
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  category: string;
  categories: string[];
  color: string;
  features: string[];
  material: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  stock: number;
  inStock: boolean;
  sku?: string;
  slug: string;
  images: string[];
  attributes: Record<string, string[]>;
  caption?: string;
  funnelStage?: string;
}

// Transform database product to frontend product
export function transformProduct(dbProduct: DatabaseProduct): Product {
  const primaryImage = dbProduct.images[0]?.src || '';
  const category = dbProduct.categories[0]?.slug || 'uncategorized';
  
  // Extract attributes
  const attributes: Record<string, string[]> = {};
  dbProduct.attributes.forEach(attr => {
    attributes[attr.name.toLowerCase()] = attr.options;
  });

  // Get features from attributes or meta_data
  const features = dbProduct.meta_data?.features || 
    dbProduct.attributes.map(attr => `${attr.name}: ${attr.options.join(', ')}`);

  return {
    id: dbProduct.id.toString(),
    name: dbProduct.name,
    description: dbProduct.description || dbProduct.short_description || '',
    shortDescription: dbProduct.short_description || undefined,
    price: dbProduct.sale_price || dbProduct.price || dbProduct.regular_price || 0,
    originalPrice: dbProduct.regular_price || undefined,
    salePrice: dbProduct.sale_price || undefined,
    category,
    categories: dbProduct.categories.map(cat => cat.slug),
    color: dbProduct.meta_data?.color || '#e90064',
    features: Array.isArray(features) ? features : [],
    material: dbProduct.meta_data?.material || 'Premium materials',
    bestSeller: dbProduct.meta_data?.bestSeller || false,
    newArrival: dbProduct.meta_data?.newArrival || false,
    limitedEdition: dbProduct.meta_data?.limitedEdition || false,
    stock: dbProduct.stock_quantity || 0,
    inStock: dbProduct.in_stock,
    sku: dbProduct.meta_data?.sku,
    slug: dbProduct.slug,
    images: dbProduct.images.map(img => img.src),
    attributes,
    caption: dbProduct.meta_data?.caption,
    funnelStage: dbProduct.meta_data?.funnelStage,
  };
}
