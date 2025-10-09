import { Product } from "@/types/product";

// Best Seller Hero Product
export const featuredProduct = {
  id: "bundle-3",
  title: "FULL LUXE COLLECTION",
  subtitle: "The ultimate set for you and yours. Complete storage solution.",
  price: 174.00,
  compareAt: 240.00,
  ratingCount: 156,
  image: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/HERO%20IMAGE%20REPLACEMENT/1759979141544-6zp7u6.jpg",
  badge: "BEST SELLER",
  contents: [
    { qty: 4, label: "Large", rodsEach: 4, detail: "4 rods each" },
    { qty: 2, label: "Medium", rodsEach: 2, detail: "2 rods each" },
    { qty: 2, label: "Small", rodsEach: 1, detail: "1 rod each" },
  ],
};

// Updated product catalog matching the new specification
export const products: Product[] = [
  // ============= BUNDLES (TOP SELLERS FIRST) =============
  {
    id: "bundle-3",
    name: "The Complete Family Set",
    description: "BIG. BUNDLE. LOVE.",
    shortDescription: "4 Large Boxes, 2 Medium Boxes, 2 Small Boxes",
    bundleContents: "4 Large Boxes, 2 Medium Boxes, 2 Small Boxes",
    price: 174.00,
    category: "bundles",
    categories: ["bundles", "high-value-bundles"],
    color: "#c80056",
    features: ["8-piece ultimate set", "Complete collection", "Share with loved ones"],
    material: "Premium velvet and durable materials",
    bestSeller: true,
    stock: 10,
    inStock: true,
    sku: "bundle3",
    slug: "bundle-3",
    images: ["https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/The-Complete-Family-Set-4-Large-2-Medium-2-Travel/1759980920453-ezsfq.jpg"],
    attributes: {},
    caption: "The ultimate set for you and yours.",
    funnelStage: "Forever Sister Collection – 2 Medium (2 rods each) part of bundle"
  },
  {
    id: "bundle-2",
    name: "Together Bundle",
    description: "SMART. SET. READY.",
    shortDescription: "3 Large Boxes, 2 Medium Boxes, 1 Small Box",
    bundleContents: "3 Large Boxes, 2 Medium Boxes, 1 Small Box",
    price: 137.00,
    category: "bundles",
    categories: ["bundles", "high-value-bundles"],
    color: "#e90064",
    features: ["6-piece collection", "Smart sizing", "Special occasions"],
    material: "Premium velvet and durable materials",
    stock: 15,
    inStock: true,
    sku: "bundle2",
    slug: "bundle-2",
    images: ["https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Together%20Bundle-%203%20Large%202%20Medium%201%20Travel/1759979157485-d2rva.jpg"],
    attributes: {},
    caption: "Your smart set for every special occasion.",
    funnelStage: "Forever Sister Collection – 2 Medium (2 rods each) part of bundle"
  },
  {
    id: "bundle-1",
    name: "Starter Set",
    description: "START. SAFE. STYLE.",
    shortDescription: "2 Large Boxes, 1 Medium Box, 1 Small Box",
    bundleContents: "2 Large Boxes, 1 Medium Box, 1 Small Box",
    price: 90.00,
    category: "bundles",
    categories: ["bundles", "entry-bundles"],
    color: "#ff4d8d",
    features: ["Starter collection", "Mix of sizes", "Complete set"],
    material: "Premium velvet and durable materials",
    stock: 20,
    inStock: true,
    sku: "bundle1",
    slug: "bundle-1",
    images: ["https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Starter-Set-2x-Large-1x-Medium-Box-1x-Small-Box/1759980850863-5xgr2a.jpg"],
    attributes: {},
    caption: "Your first set, ready for everything.",
    funnelStage: "First Sister Set – 1 Medium (2 rods) part of bundle"
  },

  // ============= INDIVIDUAL PRODUCTS =============
  {
    id: "large-bangle-box",
    name: "Large Bangle Box",
    description: "STACK. PROTECT. CHERISH.",
    shortDescription: "Large capacity bangle box with 4 rods",
    price: 30.00,
    category: "bangle-boxes",
    categories: ["bangle-boxes", "large-4-rods"],
    color: "#e90064",
    features: ["4 rod capacity", "Maximum protection", "Elegant storage"],
    material: "Premium velvet with reinforced construction",
    bestSeller: true,
    stock: 35,
    inStock: true,
    sku: "large-1-1",
    slug: "large-bangle-box",
    images: [
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Large%20bangle%20box/1759979146338-cqpngb.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Large%20bangle%20box/1759979145474-zyaeti.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Large%20bangle%20box/1759979144578-clou37.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Large%20bangle%20box/1759979143880-l187qg.jpg"
    ],
    attributes: { size: ["Large"], rodCount: ["4"] },
    caption: "Keep every bangle safe, stylish, secure.",
    funnelStage: "Everyday Sister Staples – Large (4 rods)"
  },
  {
    id: "medium-bangle-box",
    name: "Medium Bangle Box",
    description: "MIDDLE. PERFECT. READY.",
    shortDescription: "Medium bangle box with 2 rods",
    price: 25.00,
    category: "bangle-boxes",
    categories: ["bangle-boxes", "medium-2-rods"],
    color: "#c80056",
    features: ["2 rod capacity", "Daily use perfect", "Compact yet spacious"],
    material: "Premium velvet with durable construction",
    stock: 40,
    inStock: true,
    sku: "medium",
    slug: "medium-bangle-box",
    images: ["/lovable-uploads/c80056-placeholder.png"],
    attributes: { size: ["Medium"], rodCount: ["2"] },
    caption: "Just the right size for your day.",
    funnelStage: "Everyday Sister Staples – Medium (2 rods)"
  },
  {
    id: "travel-size-bangle-box",
    name: "Small Travel Bangle Box",
    description: "TRAVEL. LIGHT. BEAUTIFUL.",
    shortDescription: "Compact travel bangle box with 1 rod",
    price: 15.00,
    category: "bangle-boxes",
    categories: ["bangle-boxes", "travel-1-rod"],
    color: "#ff4d8d",
    features: ["1 rod capacity", "Lightweight design", "Travel-optimized"],
    material: "Durable composite with velvet lining",
    stock: 45,
    inStock: true,
    sku: "travel",
    slug: "travel-size-bangle-box",
    images: [
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/travel%20size/1759979156639-wffbli.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/travel%20size/1759979155834-hrflz.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/travel%20size/1759979155051-i3xg07.jpg"
    ],
    attributes: { size: ["Small", "Travel"], rodCount: ["1"] },
    caption: "Pack light, keep your beauty with you.",
    funnelStage: "Small & Travel – 1 rod each"
  },
  {
    id: "open-box-deals",
    name: "Open Box Bangle Boxes",
    description: "SAVE. SMART. BEAUTIFUL.",
    shortDescription: "Like-new condition boxes at reduced prices",
    price: 8.00,
    originalPrice: 15.00,
    category: "open-box",
    categories: ["open-box", "open-box-deals"],
    color: "#ff6b35",
    features: ["Tested condition", "Significant savings", "Same quality guarantee", "Limited availability"],
    material: "Premium materials, like-new condition",
    stock: 12,
    inStock: true,
    limitedEdition: true,
    sku: "openbox-mix",
    slug: "open-box-deals",
    images: ["/lovable-uploads/ff6b35-placeholder.png"],
    attributes: {},
    caption: "Smart savings on quality boxes.",
    funnelStage: "Open Box – Various sizes while supplies last"
  },
  {
    id: "jewelry-bag-organizer",
    name: "Jewelry Bag Organizer",
    description: "HOLD. LOVE. KEEP.",
    shortDescription: "Jewelry organizer with 7 removable pouches",
    price: 20.00,
    category: "organizers",
    categories: ["organizers", "jewelry-bags-pouches"],
    color: "#c80056",
    features: ["7 removable pouches", "Versatile organization", "Travel-friendly"],
    material: "Durable fabric with soft pouches",
    stock: 30,
    inStock: true,
    sku: "JEW-ORG-001",
    slug: "jewelry-bag-organizer",
    images: [
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979983043-ydw0xu.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979982197-8onior.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979981266-gqug88.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979980195-rry2kt.jpg",
      "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979979119-8rc2tl.jpg"
    ],
    attributes: {},
    caption: "All your pieces, organized and loved.",
    funnelStage: "Everyday Sister Staples – No rods"
  }
];

export const categories = [
  "all", 
  "Bangle Boxes", 
  "Bundles", 
  "Organizers"
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
