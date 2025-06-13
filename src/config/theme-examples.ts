export const buttonExamples = {
  primary: [
    {
      variant: 'default' as const,
      label: 'Primary with Icon',
      iconLeft: 'shopping-bag' as const,
    },
    {
      variant: 'primary-inverse' as const,
      label: 'Primary Inverse',
      iconRight: 'arrow-right' as const,
    },
    {
      variant: 'secondary' as const,
      label: 'Secondary Button',
    },
    {
      variant: 'outline' as const,
      label: 'Outline Button',
    },
  ],
  ghost: [
    {
      variant: 'ghost-pink' as const,
      label: 'Ghost Pink',
      iconRight: 'arrow-right' as const,
    },
    {
      variant: 'ghost-orange' as const,
      label: 'Ghost Orange',
      iconLeft: 'truck' as const,
    },
    {
      variant: 'ghost-black' as const,
      label: 'Ghost Black',
      iconLeft: 'info' as const,
    },
  ],
  brand: [
    {
      variant: 'pink' as const,
      label: 'Sister Pink',
      iconRight: 'arrow-right' as const,
    },
    {
      variant: 'orange' as const,
      label: 'Sister Orange',
      iconLeft: 'truck' as const,
    },
    {
      variant: 'gold' as const,
      label: 'Sister Gold',
    },
    {
      variant: 'peach' as const,
      label: 'Sister Peach',
    },
  ],
};

export const themeExamples = {
  promotion: [
    {
      title: "LIMITED OFFER",
      description: "Save 25% on your first Sister Storage collection.",
      buttonLabel: "SHOP NOW →",
    },
    {
      title: "CUSTOMER FAVORITE",
      description: "Our most-loved storage solution for modern homes.",
      buttonLabel: "LEARN MORE →",
    },
  ],
  action: [
    {
      title: "FREE DELIVERY",
      description: "Get your products delivered free on orders over $75.",
      buttonLabel: "DELIVERY INFO →",
    },
    {
      title: "QUICK SETUP",
      description: "Assembly-free storage solutions ready in minutes.",
      buttonLabel: "GET STARTED →",
    },
  ],
  neutral: [
    {
      title: "DESIGN PHILOSOPHY",
      description: "Culture without clutter. Modern storage with heritage.",
      buttonLabel: "OUR STORY →",
    },
    {
      title: "QUALITY ASSURED",
      description: "Premium materials and craftsmanship in every piece.",
      buttonLabel: "WARRANTY →",
    },
  ],
  testimonial: [
    {
      title: "Priya S.",
      description: "Beautiful storage that celebrates my culture while keeping my home organized.",
      buttonLabel: "",
      author: "Priya S.",
    },
    {
      title: "Zara M.",
      description: "Finally, storage solutions that understand my lifestyle and heritage.",
      buttonLabel: "",
      author: "Zara M.",
    },
  ],
  success: [
    {
      title: "ORDER CONFIRMED",
      description: "Your Sister Storage collection is on its way!",
      buttonLabel: "TRACK ORDER →",
    },
    {
      title: "REVIEW SUBMITTED",
      description: "Thank you for sharing your experience with us!",
      buttonLabel: "VIEW REVIEWS →",
    },
  ],
  info: [
    {
      title: "CARE INSTRUCTIONS",
      description: "Simple maintenance tips to keep your storage beautiful.",
      buttonLabel: "LEARN MORE →",
    },
    {
      title: "SIZE GUIDE",
      description: "Find the perfect storage size for your space.",
      buttonLabel: "SIZE GUIDE →",
    },
  ],
  white: [
    {
      title: "CLEAN DESIGN",
      description: "Minimalist storage solutions that blend seamlessly with any décor.",
      buttonLabel: "SHOP MINIMAL →",
    },
    {
      title: "PREMIUM QUALITY",
      description: "Crafted with attention to detail for lasting beauty and function.",
      buttonLabel: "LEARN MORE →",
    },
  ],
  gray: [
    {
      title: "SUPPORT CENTER",
      description: "Get help with assembly, maintenance, and product questions.",
      buttonLabel: "GET HELP →",
    },
    {
      title: "INSTALLATION GUIDE",
      description: "Step-by-step instructions for setting up your storage system.",
      buttonLabel: "VIEW GUIDE →",
    },
  ],
};

export const usageGuidelines = [
  { label: 'Primary (Black)', description: 'Main actions with optional left/right icons' },
  { label: 'Primary Inverse (White)', description: 'Use on dark backgrounds or colored sections' },
  { label: 'Ghost Variants', description: 'Subtle actions that become solid on hover' },
  { label: 'Brand Colors', description: 'Use Sister Pink/Orange for promotional content' },
  { label: 'Icons', description: 'Use arrow-right, shopping-bag, truck, or info icons' },
];
