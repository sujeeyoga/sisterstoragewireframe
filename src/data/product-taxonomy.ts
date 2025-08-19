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
  "valakaapu-box": {
    categorySlugs: ["bridal-ceremonial", "valakaapu"],
    attributes: { useCase: ["Valakaapu", "Bridal"] },
    tags: ["valakaapu", "ceremonial", "traditional"],
  },
  "jewelry-bag-organizer": {
    categorySlugs: ["organizers", "jewelry-bags-pouches"],
    attributes: { useCase: ["Organizer"] },
    tags: ["jewelry", "organizer", "pouches"],
  },
  "travel-size-bangle-box": {
    categorySlugs: ["bangle-boxes", "travel-1-rod"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Travel", "Home"] },
    tags: ["travel", "bangle box", "1-rod"],
  },
  "bridal-box-travel": {
    categorySlugs: ["bangle-boxes", "travel-1-rod", "bridal-ceremonial", "bridal"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Bridal", "Travel"] },
    tags: ["bridal", "travel", "1-rod"],
  },
  "props-box-travel": {
    categorySlugs: ["bangle-boxes", "travel-1-rod", "bridal-ceremonial"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Props", "Travel"] },
    tags: ["props", "travel", "1-rod"],
  },
  "bridesmaid-travel-bundle-8": {
    categorySlugs: ["bundles", "bridesmaid-packs", "bangle-boxes", "bridal-ceremonial"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Bridal", "Travel"], bundleSize: "8-pack" },
    tags: ["bridesmaid", "bundle", "8-pack", "travel"],
  },
  "props-travel-bundle-8": {
    categorySlugs: ["bundles", "props-packs", "bangle-boxes", "bridal-ceremonial"],
    attributes: { size: "Travel", rodCount: "1", useCase: ["Props", "Travel"], bundleSize: "8-pack" },
    tags: ["props", "bundle", "8-pack", "travel"],
  },
  "medium-bangle-box": {
    categorySlugs: ["bangle-boxes", "medium-2-rods"],
    attributes: { size: "Medium", rodCount: "2", useCase: ["Home"] },
    tags: ["bangle box", "2-rods", "medium"],
  },
  "bundle-1": {
    categorySlugs: ["bundles", "entry-bundles"],
    attributes: { useCase: ["Bundle", "Home"], bundleSize: "4-piece" },
    tags: ["bundle", "starter", "4-piece"],
  },
  "bundle-2": {
    categorySlugs: ["bundles", "high-value-bundles"],
    attributes: { useCase: ["Bundle", "Home"], bundleSize: "6-piece" },
    tags: ["bundle", "smart", "6-piece"],
  },
  "bundle-3": {
    categorySlugs: ["bundles", "high-value-bundles"],
    attributes: { useCase: ["Bundle", "Home"], bundleSize: "8-piece" },
    tags: ["bundle", "ultimate", "8-piece"],
  },
  "multipurpose-box": {
    categorySlugs: ["organizers", "multipurpose-boxes"],
    attributes: { useCase: ["Organizer", "Home"] },
    tags: ["multipurpose", "organizer", "versatile"],
  },
  "large-bangle-box": {
    categorySlugs: ["bangle-boxes", "large-4-rods"],
    attributes: { size: "Large", rodCount: "4", useCase: ["Home"] },
    tags: ["bangle box", "4-rods", "large"],
  },
  "open-box-large": {
    categorySlugs: ["bangle-boxes", "large-4-rods", "open-box-deals"],
    attributes: { size: "Large", rodCount: "4", useCase: ["Home", "Open-Box"] },
    tags: ["open-box", "deal", "4-rods"],
  },
  "bundle-4-large": {
    categorySlugs: ["bundles", "high-value-bundles"],
    attributes: { useCase: ["Bundle", "Home"], bundleSize: "4-piece" },
    tags: ["bundle", "large", "4-piece"],
  },
};
