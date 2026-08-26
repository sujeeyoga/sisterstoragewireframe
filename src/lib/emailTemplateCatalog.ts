export interface EditableBlock {
  key: string;
  label: string;
  helpText?: string;
  multiline?: boolean;
  defaultValue: string;
}

export interface EmailTemplateDefinition {
  key: string;
  name: string;
  audience: "customer" | "internal";
  trigger: string;
  recipient: string;
  defaultSubject: string;
  subjectHelp?: string;
  blocks: EditableBlock[];
  sampleData: Record<string, any>;
}

const sampleAddress = {
  name: "Amara Singh",
  address: "314 Velmar Drive",
  city: "Vaughan",
  state: "ON",
  postal_code: "L4L 8J7",
  country: "CA",
};

const sampleItems = [
  { name: "Sister Storage Bangle Box - 6 Rod", quantity: 1, price: 89 },
  { name: "Culture Bag", quantity: 2, price: 45 },
];

export const EMAIL_TEMPLATES: EmailTemplateDefinition[] = [
  {
    key: "order_confirmation",
    name: "Order Confirmation",
    audience: "customer",
    trigger: "Sent automatically right after a customer completes checkout.",
    recipient: "The customer who placed the order",
    defaultSubject: "Your Sister Storage Order #{{orderNumber}}",
    subjectHelp: "Use {{orderNumber}} and {{customerName}} to insert live order details.",
    blocks: [
      {
        key: "headline",
        label: "Headline",
        defaultValue: "Thank You for Your Order!",
      },
      {
        key: "bodyText",
        label: "Intro message",
        multiline: true,
        defaultValue:
          "We've received your order and we're getting it ready. We'll send you a shipping confirmation email as soon as your order ships.",
      },
      {
        key: "footerText",
        label: "Footer",
        multiline: true,
        helpText: "Each new line becomes a new line in the email.",
        defaultValue:
          "If you have any questions, please contact us at sisterstorageinc@gmail.com\nThank you for shopping with Sister Storage!",
      },
    ],
    sampleData: {
      customerName: "Amara",
      orderNumber: "SS-10428",
      orderDate: "August 26, 2026",
      items: sampleItems,
      subtotal: 179,
      shipping: 0,
      tax: 23.27,
      total: 202.27,
      shippingAddress: sampleAddress,
    },
  },
  {
    key: "shipping_notification",
    name: "Shipping Notification",
    audience: "customer",
    trigger: "Sent when an order is fulfilled and a tracking number is available.",
    recipient: "The customer whose order shipped",
    defaultSubject: "Your Order Has Shipped - Order #{{orderNumber}}",
    blocks: [
      { key: "headline", label: "Headline", defaultValue: "Your Order Has Shipped! 📦" },
      {
        key: "bodyText",
        label: "Intro message",
        multiline: true,
        defaultValue: "Great news! Your order has been shipped and is on its way to you.",
      },
      { key: "ctaText", label: "Tracking button label", defaultValue: "Track Your Package" },
      {
        key: "footerText",
        label: "Footer",
        multiline: true,
        defaultValue:
          "If you have any questions about your shipment, please contact us at sisterstorageinc@gmail.com\nThank you for shopping with Sister Storage!",
      },
    ],
    sampleData: {
      customerName: "Amara",
      orderNumber: "SS-10428",
      trackingNumber: "TRK123456789",
      carrier: "Stallion Express",
      estimatedDelivery: "August 29, 2026",
      items: sampleItems.map(({ name, quantity }) => ({ name, quantity })),
      shippingAddress: sampleAddress,
    },
  },
  {
    key: "delayed_tracking",
    name: "Delayed Tracking Notice",
    audience: "customer",
    trigger: "Sent manually from the tracking backfill tool when tracking went out late.",
    recipient: "Customers whose tracking was missed",
    defaultSubject: "Tracking Information - Order #{{orderNumber}}",
    blocks: [
      { key: "headline", label: "Headline", defaultValue: "Your Package is On The Way! 📦" },
      {
        key: "apologyMessage",
        label: "Apology message",
        multiline: true,
        defaultValue:
          "We sincerely apologize for not sending you tracking information sooner. Your order has been on its way, and we want to make sure you can track it now.",
      },
      {
        key: "bodyText",
        label: "Message after the order number",
        multiline: true,
        helpText: "Appears directly after \"Your order #12345\".",
        defaultValue: "has been shipped and may already be close to delivery! Here's your tracking information:",
      },
      { key: "ctaText", label: "Tracking button label", defaultValue: "Track Your Package" },
    ],
    sampleData: {
      customerName: "Amara",
      orderNumber: "SS-10391",
      trackingNumber: "TRK987654321",
      carrier: "Chit Chats",
      items: sampleItems.map(({ name, quantity }) => ({ name, quantity })),
      shippingAddress: sampleAddress,
    },
  },
  {
    key: "announcement",
    name: "Announcement",
    audience: "customer",
    trigger: "Sent from Email Campaigns when you publish an announcement.",
    recipient: "Selected customers",
    defaultSubject: "A note from Sister Storage",
    blocks: [
      { key: "headline", label: "Headline", defaultValue: "Something new from Sister Storage" },
      {
        key: "bodyText",
        label: "Body",
        multiline: true,
        defaultValue: "We have something to share with you.",
      },
      { key: "ctaText", label: "Button label", defaultValue: "Shop Now" },
      { key: "ctaLink", label: "Button link", defaultValue: "https://sisterstorage.com/shop" },
      { key: "footerText", label: "Footer", multiline: true, defaultValue: "Thank you for being part of Sister Storage." },
    ],
    sampleData: {
      customerName: "Amara",
      subject: "A note from Sister Storage",
      previewText: "A note from Sister Storage",
      headline: "Something new from Sister Storage",
      bodyText: "We have something to share with you.",
      ctaText: "Shop Now",
      ctaLink: "https://sisterstorage.com/shop",
    },
  },
  {
    key: "promotional",
    name: "Promotional",
    audience: "customer",
    trigger: "Sent from Email Campaigns for a promotion or sale.",
    recipient: "Selected customers",
    defaultSubject: "Sister Storage Offer",
    blocks: [
      { key: "headline", label: "Headline", defaultValue: "A special offer for you" },
      { key: "subheadline", label: "Subheadline", defaultValue: "" },
      { key: "bodyText", label: "Body", multiline: true, defaultValue: "Shop our latest pieces." },
      { key: "ctaText", label: "Button label", defaultValue: "Shop Now" },
      { key: "ctaLink", label: "Button link", defaultValue: "https://sisterstorage.com/shop" },
      { key: "footerText", label: "Footer", multiline: true, defaultValue: "Thank you for shopping with Sister Storage." },
    ],
    sampleData: {
      customerName: "Amara",
      subject: "Sister Storage Offer",
      previewText: "A special offer inside",
      headline: "A special offer for you",
      bodyText: "Shop our latest pieces.",
      ctaText: "Shop Now",
      ctaLink: "https://sisterstorage.com/shop",
    },
  },
  {
    key: "admin_welcome",
    name: "Admin Welcome",
    audience: "internal",
    trigger: "Sent when a new admin account is created.",
    recipient: "New admin user",
    defaultSubject: "Welcome to Sister Storage Admin Panel",
    blocks: [],
    sampleData: {
      email: "newadmin@sisterstorage.com",
      temporaryPassword: "TempPass123!",
      loginUrl: "https://sisterstorage.com/admin",
    },
  },
  {
    key: "admin_promotion",
    name: "Admin Access Granted",
    audience: "internal",
    trigger: "Sent when an existing user is promoted to admin.",
    recipient: "The promoted user",
    defaultSubject: "Admin Access Granted - Sister Storage",
    blocks: [],
    sampleData: {
      email: "teammate@sisterstorage.com",
      loginUrl: "https://sisterstorage.com/admin",
    },
  },
];

export const getTemplate = (key: string) =>
  EMAIL_TEMPLATES.find((t) => t.key === key) ?? EMAIL_TEMPLATES[0];
