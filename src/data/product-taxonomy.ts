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

// Map product.id -> taxonomy (Updated for new 8-product catalog)
export const productTaxonomyMap: Record<string, ProductTaxonomy> = {
  // BUNDLES
  "bundle-3": {
    categorySlugs: ["bundles", "high-value-bundles"],
    attributes: { useCase: ["Bundle", "Home"], bundleSize: "8-piece" },
    tags: ["bundle", "ultimate", "8-piece", "full-luxe"],
  },
  "bundle-2": {
    categorySlugs: ["bundles", "high-value-bundles"],
    attributes: { useCase: ["Bundle", "Home"], bundleSize: "6-piece" },
    tags: ["bundle", "smart", "6-piece", "home-away"],
  },
  "bundle-1": {
    categorySlugs: ["bundles", "entry-bundles"],
    attributes: { useCase: ["Bundle", "Home"], bundleSize: "4-piece" },
    tags: ["bundle", "starter", "4-piece", "everyday"],
  },

  // INDIVIDUAL BANGLE BOXES
  "large-bangle-box": {
    categorySlugs: ["bangle-boxes", "large-4-rods"],
    attributes: { size: "Large", rodCount: "4", useCase: ["Home"] },
    tags: ["bangle box", "4-rods", "large"],
  },
  "medium-bangle-box": {
    categorySlugs: ["bangle-boxes", "medium-2-rods"],
    attributes: { size: "Medium", rodCount: "2", useCase: ["Home"] },
    tags: ["bangle box", "2-rods", "medium"],
  },
  "travel-size-bangle-box": {
    categorySlugs: ["bangle-boxes", "travel-1-rod"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Travel", "Home"] },
    tags: ["travel", "bangle box", "1-rod", "small"],
  },

  // ORGANIZERS
  "multipurpose-box": {
    categorySlugs: ["organizers", "multipurpose-boxes"],
    attributes: { useCase: ["Organizer", "Home"] },
    tags: ["multipurpose", "organizer", "versatile"],
  },
  "jewelry-bag-organizer": {
    categorySlugs: ["organizers", "jewelry-bags-pouches"],
    attributes: { useCase: ["Organizer"] },
    tags: ["jewelry", "organizer", "pouches", "7-pouches"],
  },
};
