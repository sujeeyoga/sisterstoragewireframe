export type ProductTaxonomy = {
  categorySlugs: string[];
  attributes?: {
    rodCount?: string | string[];
    size?: string | string[];
    useCase?: string[];
    bundleSize?: string;
  };
  tags?: string[];
};

// Map product.id -> taxonomy
export const productTaxonomyMap: Record<string, ProductTaxonomy> = {
  // Existing products (approximate mapping)
  "1": {
    categorySlugs: ["organizers", "multipurpose-boxes"],
    tags: ["organizer", "multipurpose", "box"],
  },
  "2": {
    categorySlugs: ["organizers", "multipurpose-boxes"],
    tags: ["organizer", "box", "glass"],
  },
  "3": {
    categorySlugs: ["cultural-keepsakes"],
    tags: ["keepsake", "cultural"],
  },
  "4": {
    categorySlugs: ["organizers", "multipurpose-boxes"],
    tags: ["organizer", "tray"],
  },
  "5": {
    categorySlugs: ["organizers", "multipurpose-boxes"],
    tags: ["organizer", "rings"],
  },
  "6": {
    categorySlugs: ["cultural-keepsakes"],
    tags: ["memory", "case"],
  },

  // Bundles and new items
  "7": {
    categorySlugs: ["bundles", "entry-bundles"],
    attributes: {
      useCase: ["Home", "Bundle"],
      bundleSize: "4-piece",
    },
    tags: ["bundle", "entry"],
  },
  // Updated: 8 is Travel Bangle Box
  "8": {
    categorySlugs: ["bangle-boxes", "travel-1-rod", "collections", "gifts-under-25"].filter(Boolean) as string[],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Travel", "Home"] },
    tags: ["travel", "bangle box", "1-rod"],
  },
  "9": {
    categorySlugs: ["bangle-boxes", "large-4-rods"],
    attributes: { rodCount: "4", size: "Large", useCase: ["Home"] },
    tags: ["bangle box", "large", "4-rods"],
  },
  "10": {
    categorySlugs: ["bundles", "high-value-bundles"],
    attributes: { useCase: ["Home", "Bundle"], bundleSize: "6-piece" },
    tags: ["bundle", "organizer"],
  },

  // New products from CSV (ids 11-25)
  "11": { // bundle1: 2 Large, 1 Medium, 1 Travel
    categorySlugs: ["bundles", "entry-bundles", "bangle-boxes"],
    attributes: { useCase: ["Home", "Bundle"], bundleSize: "4-piece" },
    tags: ["bundle", "entry", "4-piece"],
  },
  "12": { // travel size bangle box (1 rod)
    categorySlugs: ["bangle-boxes", "travel-1-rod", "gifts-under-25"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Travel", "Home"] },
    tags: ["travel", "bangle box", "1-rod"],
  },
  "13": { // bridal travel (1-rod)
    categorySlugs: ["bangle-boxes", "travel-1-rod", "bridal-ceremonial", "bridal"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Bridal", "Travel", "Home"] },
    tags: ["bridal", "travel"],
  },
  "14": { // props travel (1-rod)
    categorySlugs: ["bangle-boxes", "travel-1-rod", "bridal-ceremonial", "props"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Props", "Travel", "Home"] },
    tags: ["props", "travel"],
  },
  "15": { // valakaapu
    categorySlugs: ["bridal-ceremonial", "valakaapu", "bangle-boxes", "travel-1-rod"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Valakaapu", "Travel", "Home"] },
    tags: ["valakaapu", "ceremonial"],
  },
  // multipurpose box – 1 large box
  "16": {
    categorySlugs: ["organizers", "multipurpose-boxes"],
    attributes: { useCase: ["Home"] },
    tags: ["organizer", "box"],
  },
  // large bangle box (4 rods)
  "17": {
    categorySlugs: ["bangle-boxes", "large-4-rods"],
    attributes: { size: "Large", rodCount: "4", useCase: ["Home"] },
    tags: ["bangle box", "4-rods"],
  },
  // medium bangle box (2 rods)
  "18": {
    categorySlugs: ["bangle-boxes", "medium-2-rods"],
    attributes: { size: "Medium", rodCount: "2", useCase: ["Home"] },
    tags: ["bangle box", "2-rods"],
  },
  // open box item – large bangle box (4 rods)
  "19": {
    categorySlugs: ["bangle-boxes", "large-4-rods", "open-box-deals"],
    attributes: { size: "Large", rodCount: "4", useCase: ["Home", "Open-Box"] },
    tags: ["open-box", "deal"],
  },
  // jewelry bag organizer (7 removable pouches)
  "20": {
    categorySlugs: ["organizers", "jewelry-bags-pouches"],
    attributes: { useCase: ["Home"] },
    tags: ["jewelry", "bags", "pouches"],
  },
  // bundle : 4 (4 large bangle boxes)
  "21": {
    categorySlugs: ["bundles", "high-value-bundles", "bangle-boxes"],
    attributes: { useCase: ["Home", "Bundle"], bundleSize: "4-piece" },
    tags: ["bundle", "4-piece"],
  },
  // Bridesmaid travel bangle box – bundle of 8
  "22": {
    categorySlugs: ["bundles", "bridesmaid-packs", "bangle-boxes", "travel-1-rod"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Bridal", "Travel", "Home"], bundleSize: "8-pack" },
    tags: ["bridesmaid", "bundle", "8-pack"],
  },
  // Props travel bangle box – bundle of 8
  "23": {
    categorySlugs: ["bundles", "props-packs", "bangle-boxes", "travel-1-rod"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Props", "Travel", "Home"], bundleSize: "8-pack" },
    tags: ["props", "bundle", "8-pack"],
  },
  // bundle 2: 3 large, 2 medium, 1 travel (6-piece)
  "24": {
    categorySlugs: ["bundles", "high-value-bundles", "bangle-boxes"],
    attributes: { useCase: ["Home", "Bundle"], bundleSize: "6-piece" },
    tags: ["bundle", "6-piece"],
  },
  // bundle 3: 4 large, 2 medium, 2 travel (8-piece)
  "25": {
    categorySlugs: ["bundles", "high-value-bundles", "bangle-boxes"],
    attributes: { useCase: ["Home", "Bundle"], bundleSize: "8-piece" },
    tags: ["bundle", "8-piece"],
  },
};
