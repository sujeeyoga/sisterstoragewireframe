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
  visible: boolean;
  weight: number | null;  // in grams
  length: number | null;  // in cm
  width: number | null;   // in cm
  height: number | null;  // in cm
  package_value: number | null;  // for customs (USD)
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
  stripePriceId?: string;
  category: string;
  categories: string[];
  color: string;
  features: string[];
  material: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  stock: number;
  stockQuantity?: number;
  inStock: boolean;
  visible?: boolean;
  sku?: string;
  slug: string;
  images: string[];
  attributes: Record<string, string[]>;
  caption?: string;
  funnelStage?: string;
  bundleContents?: string;
  // Shipping dimensions for ChitChats
  weight?: number;  // in grams
  length?: number;  // in cm
  width?: number;   // in cm
  height?: number;  // in cm
  packageValue?: number;  // for customs (USD)
}

// Transform database product to frontend product
export function transformProduct(dbProduct: any): Product {
  const images = Array.isArray(dbProduct.images) ? dbProduct.images : [];
  const categories = Array.isArray(dbProduct.categories) ? dbProduct.categories : [];
  const attributes = Array.isArray(dbProduct.attributes) ? dbProduct.attributes : [];
  
  const primaryImage = images[0]?.src || '';
  const category = categories[0]?.slug || 'uncategorized';
  
  // Extract attributes
  const attributesMap: Record<string, string[]> = {};
  attributes.forEach((attr: any) => {
    attributesMap[attr.name.toLowerCase()] = attr.options;
  });

  // Get features from attributes or meta_data
  const metaData = dbProduct.meta_data || {};
  const features = metaData.features || 
    attributes.map((attr: any) => `${attr.name}: ${attr.options.join(', ')}`);

  return {
    id: dbProduct.id.toString(),
    name: dbProduct.name,
    description: dbProduct.description || dbProduct.short_description || '',
    shortDescription: dbProduct.short_description || undefined,
    price: dbProduct.sale_price || dbProduct.price || dbProduct.regular_price || 0,
    originalPrice: dbProduct.regular_price || undefined,
    salePrice: dbProduct.sale_price || undefined,
    category,
    categories: categories.map((cat: any) => cat.slug),
    color: metaData.color || '#e90064',
    features: Array.isArray(features) ? features : [],
    material: metaData.material || 'Premium materials',
    bestSeller: metaData.bestSeller || false,
    newArrival: metaData.newArrival || false,
    limitedEdition: metaData.limitedEdition || false,
    stock: dbProduct.stock_quantity || 0,
    stockQuantity: dbProduct.stock_quantity || undefined,
    inStock: dbProduct.in_stock,
    visible: dbProduct.visible !== false,
    sku: metaData.sku,
    slug: dbProduct.slug,
    images: images.map((img: any) => img.src),
    attributes: attributesMap,
    caption: metaData.caption,
    funnelStage: metaData.funnelStage,
    bundleContents: dbProduct.short_description || undefined,
    // Shipping dimensions for ChitChats
    weight: dbProduct.weight || undefined,
    length: dbProduct.length || undefined,
    width: dbProduct.width || undefined,
    height: dbProduct.height || undefined,
    packageValue: dbProduct.package_value || undefined,
  };
}
