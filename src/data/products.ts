
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  color: string;
  features: string[];
  material: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  stock: number;
  sku?: string;
  caption?: string;
  funnelStage?: string;
}

export const products: Product[] = [
  {
    id: "valakaapu-box",
    name: "The Valakaapu Box",
    description: "BLESS. BEGIN. BLOOM.",
    caption: "For traditions that deserve a loving touch.",
    price: 12.00,
    originalPrice: 15.00,
    category: "Bridal & Ceremonial",
    color: "#e90064",
    features: ["Traditional ceremonies", "Protective lining", "Compact design"],
    material: "Premium velvet with protective lining",
    stock: 25,
    sku: "VAL-001",
    funnelStage: "Small & Travel – No rods"
  },
  {
    id: "jewelry-bag-organizer",
    name: "Jewelry Bag Organizer (7 Removable Jewelry Pouches)",
    description: "HOLD. LOVE. KEEP.",
    caption: "All your pieces, organized and loved.",
    price: 20.00,
    originalPrice: 25.00,
    category: "Organizers",
    color: "#c80056",
    features: ["7 removable pouches", "Versatile organization", "Travel-friendly"],
    material: "Durable fabric with soft pouches",
    stock: 30,
    sku: "JEW-ORG-001",
    funnelStage: "Everyday Sister Staples – No rods"
  },
  {
    id: "travel-size-bangle-box",
    name: "Travel Size Bangle Box (1 Rod)",
    description: "TRAVEL. LIGHT. BEAUTIFUL.",
    caption: "Pack light, keep your beauty with you.",
    price: 12.00,
    originalPrice: 15.00,
    category: "Bangle Boxes",
    color: "#ff4d8d",
    features: ["1 rod capacity", "Lightweight design", "Travel-optimized"],
    material: "Durable composite with velvet lining",
    stock: 45,
    sku: "travel",
    funnelStage: "Small & Travel – 1 rod each"
  },
  {
    id: "bridal-box-travel",
    name: "The Bridal Box – Travel Size (1-Rod)",
    description: "BRIDE. SAFE. BEAUTIFUL.",
    caption: "Every bride deserves sparkle on the go.",
    price: 12.00,
    originalPrice: 15.00,
    category: "Bridal & Ceremonial",
    color: "#e90064",
    features: ["Bridal-specific design", "1 rod capacity", "Elegant finish"],
    material: "Premium materials with bridal accents",
    stock: 35,
    sku: "BRI-TRV-001",
    funnelStage: "Small & Travel – 1 rod each"
  },
  {
    id: "props-box-travel",
    name: "The Props Box – Travel Size (1-Rod)",
    description: "POSE. LOVE. REMEMBER.",
    caption: "Ready for every picture-perfect sister moment.",
    price: 12.00,
    originalPrice: 15.00,
    category: "Bridal & Ceremonial",
    color: "#a60048",
    features: ["Photography props", "1 rod capacity", "Picture-perfect storage"],
    material: "Photo-safe materials with protective lining",
    stock: 28,
    sku: "PRO-TRV-001",
    funnelStage: "Small & Travel – 1 rod each"
  },
  {
    id: "bridesmaid-travel-bundle-8",
    name: "Bridesmaid Travel Bangle Box – Bundle of 8",
    description: "TRAVEL. TOGETHER. TREASURE.",
    caption: "For every sister who travels with love.",
    price: 102.00,
    originalPrice: 120.00,
    category: "Bundles",
    color: "#e90064",
    features: ["8-piece bundle", "Travel-optimized", "Bridesmaid-ready"],
    material: "Premium materials with gift packaging",
    stock: 15,
    sku: "BRI-BUN-8",
    funnelStage: "Forever Sister Collection – Travel (1 rod each × 8)"
  },
  {
    id: "props-travel-bundle-8",
    name: "Props Travel Bangle Box (Bundle of 8)",
    description: "PACK. SHARE. SHINE.",
    caption: "Share the sparkle with your whole crew.",
    price: 102.00,
    originalPrice: 120.00,
    category: "Bundles",
    color: "#a60048",
    features: ["8-piece bundle", "Props-ready", "Share with friends"],
    material: "Photo-safe materials in gift packaging",
    stock: 12,
    sku: "PRO-BUN-8",
    funnelStage: "Forever Sister Collection – Travel (1 rod each × 8)"
  },
  {
    id: "medium-bangle-box",
    name: "Medium Bangle Box (2 Rod)",
    description: "MIDDLE. PERFECT. READY.",
    caption: "Just the right size for your day.",
    price: 20.00,
    originalPrice: 25.00,
    category: "Bangle Boxes",
    color: "#c80056",
    features: ["2 rod capacity", "Daily use perfect", "Compact yet spacious"],
    material: "Premium velvet with durable construction",
    stock: 40,
    sku: "medium",
    funnelStage: "Everyday Sister Staples – Medium (2 rods)"
  },
  {
    id: "bundle-1",
    name: "Bundle1: 2 Large, 1 Medium, 1 Travel",
    description: "START. SAFE. STYLE.",
    caption: "Your first set, ready for everything.",
    price: 90.00,
    category: "Bundles",
    color: "#ff4d8d",
    features: ["Starter collection", "Mix of sizes", "Complete set"],
    material: "Premium velvet and durable materials",
    stock: 20,
    sku: "bundle1",
    funnelStage: "First Sister Set – 1 Medium (2 rods) part of bundle"
  },
  {
    id: "bundle-2",
    name: "Bundle 2: 3 Large, 2 Medium, 1 Travel",
    description: "SMART. SET. READY.",
    caption: "Your smart set for every special occasion.",
    price: 137.00,
    category: "Bundles",
    color: "#e90064",
    features: ["6-piece collection", "Smart sizing", "Special occasions"],
    material: "Premium velvet and durable materials",
    stock: 15,
    sku: "bundle2",
    funnelStage: "Forever Sister Collection – 2 Medium (2 rods each) part of bundle"
  },
  {
    id: "bundle-3",
    name: "Bundle 3: 4 Large, 2 Medium, 2 Travel",
    description: "BIG. BUNDLE. LOVE.",
    caption: "The ultimate set for you and yours.",
    price: 174.00,
    category: "Bundles",
    color: "#c80056",
    features: ["8-piece ultimate set", "Complete collection", "Share with loved ones"],
    material: "Premium velvet and durable materials",
    stock: 10,
    sku: "bundle3",
    funnelStage: "Forever Sister Collection – 2 Medium (2 rods each) part of bundle"
  },
  {
    id: "multipurpose-box",
    name: "Multipurpose Box – 1 Large box",
    description: "ONE. BOX. ENDLESS.",
    caption: "One box, endless ways to care.",
    price: 12.00,
    category: "Organizers",
    color: "#ff4d8d",
    features: ["Versatile use", "Large capacity", "Multi-purpose design"],
    material: "Durable composite with elegant finish",
    stock: 50,
    sku: "multi1",
    funnelStage: "Small & Travel – 1 Large (4 rods)"
  },
  {
    id: "large-bangle-box",
    name: "Large Bangle Box (4 Rods)",
    description: "STACK. PROTECT. CHERISH.",
    caption: "Keep every bangle safe, stylish, secure.",
    price: 24.00,
    originalPrice: 30.00,
    category: "Bangle Boxes",
    color: "#e90064",
    features: ["4 rod capacity", "Maximum protection", "Elegant storage"],
    material: "Premium velvet with reinforced construction",
    bestSeller: true,
    stock: 35,
    sku: "large-1-1",
    funnelStage: "Everyday Sister Staples – Large (4 rods)"
  },
  {
    id: "open-box-large",
    name: "OPEN BOX ITEM – Large Bangle Box (4 Rods)",
    description: "DEAL. KEEP. FOREVER.",
    caption: "Save now, love it for years.",
    price: 21.00,
    originalPrice: 30.00,
    category: "Bangle Boxes",
    color: "#a60048",
    features: ["Open box deal", "4 rod capacity", "Fully inspected"],
    material: "Premium velvet with reinforced construction",
    stock: 8,
    sku: "large-1",
    funnelStage: "Everyday Sister Staples – Large (4 rods)"
  },
  {
    id: "bundle-4-large",
    name: "Bundle : 4 (4 Large Bangle Boxes)",
    description: "MORE. LOVE. ALWAYS.",
    caption: "Four boxes for your growing collection.",
    price: 108.00,
    category: "Bundles",
    color: "#c80056",
    features: ["4 large boxes", "Growing collection", "Ultimate storage"],
    material: "Premium velvet with durable construction",
    stock: 12,
    sku: "BUN-4L",
    funnelStage: "Forever Sister Collection – 4 Large (4 rods each)"
  }
];

export const categories = [
  "all", 
  "Bangle Boxes", 
  "Bundles", 
  "Organizers", 
  "Bridal & Ceremonial", 
  "Collections", 
  "Cultural Keepsakes"
];

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
