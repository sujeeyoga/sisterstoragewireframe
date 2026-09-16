/**
 * Approved admin destinations the AI assistant is allowed to link to.
 *
 * The assistant never invents URLs: every button rendered in the chat must
 * match one of these entries (see `isApprovedAdminRoute`).
 * Keep this list in sync with supabase/functions/admin-assistant/routes.ts.
 */

export interface AdminAssistantRoute {
  id: string;
  title: string;
  description: string;
  route: string;
  keywords: string[];
  requiredRole: 'admin';
  group: string;
}

export const adminAssistantRoutes: AdminAssistantRoute[] = [
  // Overview
  { id: 'dashboard', title: 'Dashboard', description: 'Store overview: orders, revenue and orders awaiting fulfillment.', route: '/admin', keywords: ['dashboard', 'overview', 'home', 'summary', 'revenue'], requiredRole: 'admin', group: 'Overview' },
  { id: 'assistant', title: 'AI Assistant', description: 'This helper.', route: '/admin/assistant', keywords: ['assistant', 'ai', 'help'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics', title: 'Analytics', description: 'Sales and store analytics.', route: '/admin/analytics', keywords: ['analytics', 'reports', 'stats'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-sales', title: 'Sales Reports', description: 'Revenue and sales over time.', route: '/admin/analytics/sales', keywords: ['sales', 'revenue report'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-products', title: 'Product Reports', description: 'Best and worst selling products.', route: '/admin/analytics/products', keywords: ['product report', 'best sellers'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-customers', title: 'Customer Reports', description: 'Customer purchase behaviour.', route: '/admin/analytics/customers', keywords: ['customer report', 'repeat customers'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-visitors', title: 'Visitor Analytics', description: 'Live and historical site visitors.', route: '/admin/analytics/visitors', keywords: ['visitors', 'traffic', 'sessions'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-shipping', title: 'Shipping Analytics', description: 'Shipping charged versus carrier cost.', route: '/admin/analytics/shipping', keywords: ['shipping analytics', 'shipping cost', 'shipping loss'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-profit', title: 'Profit Analytics', description: 'Net profit after costs.', route: '/admin/analytics/profit', keywords: ['profit', 'margin', 'net'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-seo', title: 'SEO Analytics', description: 'Search performance and keywords.', route: '/admin/analytics/seo', keywords: ['seo', 'search', 'google'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-conversion', title: 'Conversion Analytics', description: 'Checkout conversion funnel.', route: '/admin/analytics/conversion', keywords: ['conversion', 'funnel'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-abandoned', title: 'Abandoned Checkouts', description: 'Checkouts that were started but not paid.', route: '/admin/analytics/abandoned-checkouts', keywords: ['abandoned', 'abandoned cart', 'unfinished checkout'], requiredRole: 'admin', group: 'Overview' },
  { id: 'analytics-active-carts', title: 'Active Carts', description: 'Carts shoppers have open right now.', route: '/admin/analytics/active-carts', keywords: ['active carts', 'live carts'], requiredRole: 'admin', group: 'Overview' },

  // Store
  { id: 'orders', title: 'Orders', description: 'All orders: fulfil, add tracking, refund, email customers.', route: '/admin/orders', keywords: ['order', 'orders', 'fulfil', 'fulfill', 'fulfillment', 'tracking', 'ship', 'shipment', 'refund', 'label'], requiredRole: 'admin', group: 'Store' },
  { id: 'orders-resend-emails', title: 'Resend Confirmation Emails', description: 'Resend order confirmation emails in bulk.', route: '/admin/orders/resend-emails', keywords: ['resend confirmation', 'order email'], requiredRole: 'admin', group: 'Store' },
  { id: 'orders-shipping-notifications', title: 'Bulk Shipping Notifications', description: 'Send shipping notification emails in bulk.', route: '/admin/orders/shipping-notifications', keywords: ['shipping notification', 'bulk email tracking'], requiredRole: 'admin', group: 'Store' },
  { id: 'orders-carrier-costs', title: 'Carrier Costs', description: 'Enter what the carrier actually charged per order.', route: '/admin/orders/carrier-costs', keywords: ['carrier cost', 'actual shipping cost'], requiredRole: 'admin', group: 'Store' },
  { id: 'products', title: 'Products', description: 'Product list: prices, stock, images and details.', route: '/admin/products', keywords: ['product', 'products', 'stock', 'inventory', 'price', 'sku', 'catalog'], requiredRole: 'admin', group: 'Store' },
  { id: 'customers', title: 'Customers', description: 'Customer list and their order history.', route: '/admin/customers', keywords: ['customer', 'customers', 'buyer', 'client'], requiredRole: 'admin', group: 'Store' },
  { id: 'reviews', title: 'Reviews', description: 'Approve, reply to and manage product reviews.', route: '/admin/reviews', keywords: ['review', 'reviews', 'rating', 'testimonial'], requiredRole: 'admin', group: 'Store' },
  { id: 'flash-sales', title: 'Flash Sales', description: 'Create or update flash sales and promotional discounts.', route: '/admin/flash-sales', keywords: ['flash sale', 'promotion', 'promo', 'sale', 'discount', 'offer', 'deal'], requiredRole: 'admin', group: 'Store' },
  { id: 'shipping-thresholds', title: 'Shipping Thresholds', description: 'Shipping prices and the free shipping minimum per region.', route: '/admin/shipping-thresholds', keywords: ['shipping price', 'shipping rate', 'free shipping', 'threshold', 'minimum', 'gta shipping', 'shipping cost'], requiredRole: 'admin', group: 'Store' },
  { id: 'shipping-zones', title: 'Shipping Zones', description: 'Which regions get which shipping rate.', route: '/admin/shipping-zones', keywords: ['shipping zone', 'zones', 'region', 'province', 'postal code'], requiredRole: 'admin', group: 'Store' },
  { id: 'shipping-settings', title: 'Shipping Settings', description: 'Carrier and shipping configuration.', route: '/admin/shipping-settings', keywords: ['shipping settings', 'carrier settings'], requiredRole: 'admin', group: 'Store' },
  { id: 'shipping-carriers', title: 'Carrier Shipping (Stallion)', description: 'Buy labels and manage carrier shipments.', route: '/admin/shipping', keywords: ['stallion', 'chit chats', 'label', 'carrier'], requiredRole: 'admin', group: 'Store' },
  { id: 'bulk-shipping-refund', title: 'Bulk Shipping Refund', description: 'Refund shipping charges in bulk.', route: '/admin/bulk-shipping-refund', keywords: ['refund shipping', 'bulk refund'], requiredRole: 'admin', group: 'Store' },
  { id: 'emails', title: 'Email Campaigns', description: 'Send and manage marketing email campaigns.', route: '/admin/emails', keywords: ['campaign', 'newsletter', 'marketing email', 'bulk email'], requiredRole: 'admin', group: 'Store' },
  { id: 'email-templates', title: 'Email Templates', description: 'Edit the wording of automatic customer emails.', route: '/admin/email-templates', keywords: ['email template', 'order confirmation email', 'shipping email wording'], requiredRole: 'admin', group: 'Store' },
  { id: 'email-testing', title: 'Email Testing', description: 'Send test emails to yourself.', route: '/admin/email-testing', keywords: ['test email', 'email preview'], requiredRole: 'admin', group: 'Settings' },

  // Content
  { id: 'sections', title: 'Homepage Sections', description: 'The homepage hero banner, featured blocks and section order.', route: '/admin/sections', keywords: ['homepage', 'home page', 'hero', 'hero banner', 'homepage banner', 'section', 'shop layout', 'featured'], requiredRole: 'admin', group: 'Content' },
  { id: 'hero-images', title: 'Hero Images', description: 'The large images used at the top of pages.', route: '/admin/hero-images', keywords: ['hero image', 'banner image', 'header image'], requiredRole: 'admin', group: 'Content' },
  { id: 'pages', title: 'Pages', description: 'Create and edit standalone site pages.', route: '/admin/pages', keywords: ['page', 'pages', 'about', 'faq page', 'policy'], requiredRole: 'admin', group: 'Content' },
  { id: 'page-content', title: 'Page Content', description: 'Edit the text and media blocks inside existing pages.', route: '/admin/page-content', keywords: ['page content', 'website content', 'copy', 'wording'], requiredRole: 'admin', group: 'Content' },
  { id: 'texts', title: 'Site Content', description: 'Short pieces of text used across the website.', route: '/admin/texts', keywords: ['site text', 'labels', 'wording', 'site content'], requiredRole: 'admin', group: 'Content' },
  { id: 'branding', title: 'Branding', description: 'Logo, colours and brand assets.', route: '/admin/branding', keywords: ['branding', 'logo', 'colour', 'color', 'brand'], requiredRole: 'admin', group: 'Content' },
  { id: 'qr-codes', title: 'QR Codes', description: 'Create and manage QR codes for print and packaging.', route: '/admin/qr-codes', keywords: ['qr', 'qr code', 'scan'], requiredRole: 'admin', group: 'Content' },
  { id: 'sister-stories', title: 'Sister Stories', description: 'Video testimonials shown on the site.', route: '/admin/sister-stories', keywords: ['sister story', 'testimonial video', 'stories'], requiredRole: 'admin', group: 'Content' },
  { id: 'launch-cards', title: 'Launch Cards', description: 'Launch and coming-soon cards.', route: '/admin/launch-cards', keywords: ['launch card', 'coming soon'], requiredRole: 'admin', group: 'Content' },
  { id: 'images', title: 'Image Uploads', description: 'Upload images for the site.', route: '/admin/images', keywords: ['upload image', 'photo', 'picture'], requiredRole: 'admin', group: 'Content' },
  { id: 'videos', title: 'Video Uploads', description: 'Upload videos for the site.', route: '/admin/videos', keywords: ['upload video', 'clip'], requiredRole: 'admin', group: 'Content' },

  // Settings
  { id: 'admin-settings', title: 'Admin Settings', description: 'Admin users, security, integrations and system switches.', route: '/admin/admin-settings', keywords: ['admin settings', 'settings'], requiredRole: 'admin', group: 'Settings' },
  { id: 'admin-settings-users', title: 'Admin Users', description: 'Who can sign in to the back end.', route: '/admin/admin-settings?tab=users', keywords: ['admin user', 'staff access', 'permissions'], requiredRole: 'admin', group: 'Settings' },
  { id: 'admin-settings-security', title: 'Security Settings', description: 'Security options for the admin area.', route: '/admin/admin-settings?tab=security', keywords: ['security', 'password policy'], requiredRole: 'admin', group: 'Settings' },
  { id: 'admin-settings-integrations', title: 'Integrations', description: 'Shopify and other connected services.', route: '/admin/admin-settings?tab=integrations', keywords: ['integration', 'shopify', 'connected app', 'sync'], requiredRole: 'admin', group: 'Settings' },
  { id: 'announcement-banner', title: 'Announcement Bar', description: 'The thin message bar at the very top of the website, plus US shipping and other system switches.', route: '/admin/admin-settings?tab=system', keywords: ['announcement', 'announcement bar', 'top bar', 'restock banner', 'notice', 'system settings', 'us shipping'], requiredRole: 'admin', group: 'Settings' },
  { id: 'store-settings', title: 'Store Settings', description: 'Store-wide discounts, inventory and storefront options.', route: '/admin/store-settings', keywords: ['store settings', 'store discount', 'store wide', 'inventory settings', 'promotional banner'], requiredRole: 'admin', group: 'Settings' },
  { id: 'shopify-push', title: 'Shopify Push', description: 'Push products and orders to Shopify.', route: '/admin/shopify-push', keywords: ['shopify push', 'sync shopify'], requiredRole: 'admin', group: 'Settings' },
  { id: 'sync', title: 'Sync', description: 'Sync data with connected stores.', route: '/admin/sync', keywords: ['sync', 'import'], requiredRole: 'admin', group: 'Settings' },
  { id: 'waitlist-signups', title: 'Waitlist Signups', description: 'People waiting for restocks or launches.', route: '/admin/waitlist-signups', keywords: ['waitlist', 'signup', 'restock notify'], requiredRole: 'admin', group: 'Settings' },
  { id: 'uploads', title: 'Uploads', description: 'All uploaded files.', route: '/admin/uploads', keywords: ['uploads', 'files', 'media'], requiredRole: 'admin', group: 'Settings' },
];

export const routeById = (id: string) => adminAssistantRoutes.find((r) => r.id === id);

/** Query parameters the assistant is allowed to include in a link. */
const ALLOWED_PARAMS = ['tab', 'order', 'focus'];

/** Paths that accept a record id segment, e.g. /admin/products/123 */
const RECORD_PATH_PREFIXES = ['/admin/products/'];

const approvedPaths = new Set(adminAssistantRoutes.map((r) => r.route.split('?')[0]));

/**
 * True only for internal admin links that match the approved directory.
 * Rejects external URLs, javascript:, protocol-relative links and unknown paths.
 */
export function isApprovedAdminRoute(href: unknown): href is string {
  if (typeof href !== 'string') return false;
  const value = href.trim();
  if (!value.startsWith('/admin')) return false;
  if (value.startsWith('//')) return false;
  if (/[\s<>"']/.test(value)) return false;

  const [path, query] = value.split('?');
  if (path !== '/admin' && !approvedPaths.has(path)) {
    const isRecordPath = RECORD_PATH_PREFIXES.some(
      (prefix) => path.startsWith(prefix) && /^[A-Za-z0-9._-]+$/.test(path.slice(prefix.length)),
    );
    if (!isRecordPath) return false;
  }

  if (query) {
    for (const pair of query.split('&')) {
      const key = pair.split('=')[0];
      if (!ALLOWED_PARAMS.includes(key)) return false;
    }
  }
  return true;
}

/** Friendly button label for an approved href. */
export function labelForAdminRoute(href: string): string {
  const [path, query] = href.split('?');
  const params = new URLSearchParams(query ?? '');

  const order = params.get('order');
  if (path === '/admin/orders' && order) return `Manage Tracking for ${order} →`;

  if (path.startsWith('/admin/products/')) {
    return params.get('focus') === 'inventory' ? 'Update Product Stock →' : 'Open Product →';
  }

  const exact = adminAssistantRoutes.find((r) => r.route === href);
  if (exact) return `Open ${exact.title} →`;

  const byPath = adminAssistantRoutes.find((r) => r.route.split('?')[0] === path);
  if (byPath) return `Open ${byPath.title} →`;

  return 'Open in admin →';
}
