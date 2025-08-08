
export type CategoryNode = {
  label: string;
  slug: string;
  children?: CategoryNode[];
};

export const categoryTree: CategoryNode[] = [
  {
    label: "Bangle Boxes",
    slug: "bangle-boxes",
    children: [
      { label: "Travel – 1 Rod", slug: "travel-1-rod" },
      { label: "Medium – 2 Rods", slug: "medium-2-rods" },
      { label: "Large – 4 Rods", slug: "large-4-rods" },
      { label: "Open-Box Deals", slug: "open-box-deals" },
    ],
  },
  {
    label: "Bundles",
    slug: "bundles",
    children: [
      { label: "Entry Bundles", slug: "entry-bundles" },
      { label: "High-Value Bundles", slug: "high-value-bundles" },
      { label: "Bridesmaid Packs (8)", slug: "bridesmaid-packs" },
      { label: "Props Packs (8)", slug: "props-packs" },
    ],
  },
  {
    label: "Organizers",
    slug: "organizers",
    children: [
      { label: "Jewelry Bags & Pouches", slug: "jewelry-bags-pouches" },
      { label: "Multipurpose Boxes", slug: "multipurpose-boxes" },
    ],
  },
  {
    label: "Bridal & Ceremonial",
    slug: "bridal-ceremonial",
    children: [
      { label: "Bridal", slug: "bridal" },
      { label: "Valakaapu", slug: "valakaapu" },
    ],
  },
  {
    label: "Collections",
    slug: "collections",
    children: [
      { label: "Best Sellers", slug: "best-sellers" },
      { label: "New Arrivals", slug: "new-arrivals" },
      { label: "Gifts Under $25", slug: "gifts-under-25" },
      { label: "Gifts Under $50", slug: "gifts-under-50" },
    ],
  },
  {
    label: "Cultural Keepsakes",
    slug: "cultural-keepsakes",
  },
];

export const attributeOptions = {
  rodCount: ["1", "2", "4"],
  size: ["Travel", "Medium", "Large"],
  useCase: ["Travel", "Home", "Bridal", "Props", "Valakaapu", "Organizer", "Bundle", "Open-Box"],
  bundleSize: ["3-piece", "4-piece", "6-piece", "8-pack"],
} as const;
