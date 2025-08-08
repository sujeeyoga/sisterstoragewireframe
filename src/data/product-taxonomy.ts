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
      useCase: ["Home", "Travel", "Bundle"],
      bundleSize: "4-piece",
    },
    tags: ["bundle", "entry"],
  },
  "8": {
    categorySlugs: ["organizers", "multipurpose-boxes"],
    attributes: { size: "Travel", useCase: ["Travel"] },
    tags: ["travel", "jewelry", "box"],
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
};
