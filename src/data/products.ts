import { Product } from "@/types/product";
import shopHeroImg from '@/assets/optimized/shop-hero.jpg';

/**
 * DEPRECATION NOTICE:
 * The static products array has been removed. Products are now fetched from the database.
 * Use the useProductsCatalog() hook instead of importing products directly.
 * 
 * This file now only contains configuration data that doesn't belong in the database.
 */

// Best Seller Hero Product - Featured product configuration
export const featuredProduct = {
  id: "bundle-3",
  title: "The Complete Family Set",
  subtitle: "The ultimate set for you and yours. Complete storage solution.",
  price: 174.00,
  compareAt: 240.00,
  ratingCount: 156,
  image: shopHeroImg,
  badge: "BEST SELLER",
  contents: [
    { qty: 4, label: "Large", rodsEach: 4, detail: "4 rods each" },
    { qty: 2, label: "Medium", rodsEach: 2, detail: "2 rods each" },
    { qty: 2, label: "Travel", rodsEach: 1, detail: "1 rod each" },
  ],
};

// Shop category filters
export const categories = [
  "all", 
  "Bangle Boxes", 
  "Bundles", 
  "Organizers"
];

// Benefits section content
export const benefits = [
  {
    title: "Thoughtful Design",
    description: "Every piece is designed with intention, considering the unique needs of cultural items."
  },
  {
    title: "Quality Materials",
    description: "We use premium, sustainable materials that protect your treasured possessions."
  },
  {
    title: "Cultural Significance",
    description: "Our products honor and celebrate cultural heritage through mindful storage solutions."
  }
];

// Legacy export for backwards compatibility - DO NOT USE
// Use useProductsCatalog() hook instead
export const products: Product[] = [];
