// Utilities to export Sister Storage customers and orders into Shopify-compatible CSVs.
// Customer CSV → Shopify Admin → Customers → Import.
// Order CSV → install the "Matrixify" app on Shopify and import orders (Shopify's native
// importer does NOT support orders, but Matrixify accepts this exact column layout).

type Row = Record<string, string | number | null | undefined>;

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: Row[], columns: string[]): string {
  const header = columns.map(csvEscape).join(',');
  const body = rows
    .map((r) => columns.map((c) => csvEscape(r[c])).join(','))
    .join('\n');
  return `${header}\n${body}\n`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------- CUSTOMERS ----------

export interface ExportCustomer {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  billing?: any;
  shipping?: any;
  phone?: string | null;
  total_spent?: number | string | null;
  orders_count?: number | null;
  created_at?: string | null;
}

const CUSTOMER_COLUMNS = [
  'First Name',
  'Last Name',
  'Email',
  'Accepts Email Marketing',
  'Default Address Company',
  'Default Address Address1',
  'Default Address Address2',
  'Default Address City',
  'Default Address Province Code',
  'Default Address Country Code',
  'Default Address Zip',
  'Default Address Phone',
  'Phone',
  'Accepts SMS Marketing',
  'Tags',
  'Note',
  'Tax Exempt',
  'Total Spent',
  'Total Orders',
];

export function customersToShopifyCsv(customers: ExportCustomer[]): string {
  const rows: Row[] = customers
    .filter((c) => !!c.email)
    .map((c) => {
      const addr = c.billing || c.shipping || {};
      return {
        'First Name': c.first_name || addr.first_name || '',
        'Last Name': c.last_name || addr.last_name || '',
        'Email': c.email || '',
        'Accepts Email Marketing': 'no',
        'Default Address Company': addr.company || '',
        'Default Address Address1': addr.address_1 || addr.address1 || addr.line1 || '',
        'Default Address Address2': addr.address_2 || addr.address2 || addr.line2 || '',
        'Default Address City': addr.city || '',
        'Default Address Province Code': addr.state || addr.province || '',
        'Default Address Country Code': addr.country || 'CA',
        'Default Address Zip': addr.postcode || addr.zip || addr.postal_code || '',
        'Default Address Phone': addr.phone || c.phone || '',
        'Phone': c.phone || addr.phone || '',
        'Accepts SMS Marketing': 'no',
        'Tags': 'imported-from-sisterstorage',
        'Note': '',
        'Tax Exempt': 'no',
        'Total Spent': c.total_spent ?? '',
        'Total Orders': c.orders_count ?? '',
      };
    });
  return toCsv(rows, CUSTOMER_COLUMNS);
}

// ---------- ORDERS ----------

export interface ExportOrder {
  // identifiers
  id?: string | number;
  order_number?: string | number | null;
  source?: 'woocommerce' | 'stripe' | string;
  // money
  currency?: string | null;
  total?: number | string | null;
  subtotal?: number | string | null;
  shipping_cost?: number | string | null;
  tax?: number | string | null;
  discount_total?: number | string | null;
  // status
  status?: string | null;
  // dates
  date_created?: string | null;
  date_paid?: string | null;
  date_completed?: string | null;
  // people
  customer_email?: string | null;
  billing?: any;
  shipping?: any;
  shipping_address?: any;
  // items
  line_items?: any[];
  // meta
  payment_method?: string | null;
  customer_note?: string | null;
}

const ORDER_COLUMNS = [
  'Name',
  'Email',
  'Financial Status',
  'Paid at',
  'Fulfillment Status',
  'Fulfilled at',
  'Accepts Marketing',
  'Currency',
  'Subtotal',
  'Shipping',
  'Taxes',
  'Total',
  'Discount Code',
  'Discount Amount',
  'Shipping Method',
  'Created at',
  'Lineitem quantity',
  'Lineitem name',
  'Lineitem price',
  'Lineitem compare at price',
  'Lineitem sku',
  'Lineitem requires shipping',
  'Lineitem taxable',
  'Lineitem fulfillment status',
  'Billing Name',
  'Billing Street',
  'Billing Address1',
  'Billing Address2',
  'Billing Company',
  'Billing City',
  'Billing Zip',
  'Billing Province',
  'Billing Country',
  'Billing Phone',
  'Shipping Name',
  'Shipping Street',
  'Shipping Address1',
  'Shipping Address2',
  'Shipping Company',
  'Shipping City',
  'Shipping Zip',
  'Shipping Province',
  'Shipping Country',
  'Shipping Phone',
  'Notes',
  'Note Attributes',
  'Cancelled at',
  'Payment Method',
  'Payment Reference',
  'Refunded Amount',
  'Vendor',
  'Tags',
  'Source',
  'Phone',
];

function mapWooStatusToFinancial(status?: string | null): string {
  switch (status) {
    case 'completed':
    case 'processing':
      return 'paid';
    case 'pending':
    case 'on-hold':
      return 'pending';
    case 'refunded':
      return 'refunded';
    case 'cancelled':
    case 'failed':
      return 'voided';
    default:
      return 'pending';
  }
}

function mapWooStatusToFulfillment(status?: string | null): string {
  switch (status) {
    case 'completed':
      return 'fulfilled';
    default:
      return '';
  }
}

function fullName(addr: any): string {
  if (!addr) return '';
  const f = addr.first_name || '';
  const l = addr.last_name || '';
  return `${f} ${l}`.trim();
}

export function ordersToShopifyCsv(orders: ExportOrder[]): string {
  const rows: Row[] = [];

  for (const o of orders) {
    const billing = o.billing || {};
    const shipping = o.shipping || o.shipping_address || billing || {};
    const items = (o.line_items && o.line_items.length > 0) ? o.line_items : [null];

    const orderName = o.order_number ? `#${o.order_number}` : `#${o.id ?? ''}`;
    const financial = mapWooStatusToFinancial(o.status);
    const fulfillment = mapWooStatusToFulfillment(o.status);

    items.forEach((item, index) => {
      const isFirst = index === 0;
      const qty = item?.quantity ?? item?.qty ?? 1;
      const price =
        item?.price ??
        item?.unit_price ??
        (item?.total && qty ? Number(item.total) / Number(qty) : '');
      const name = item?.name || item?.title || item?.product_name || (isFirst ? 'Order item' : '');

      rows.push({
        'Name': orderName,
        'Email': isFirst ? (o.customer_email || billing.email || '') : '',
        'Financial Status': isFirst ? financial : '',
        'Paid at': isFirst ? (o.date_paid || '') : '',
        'Fulfillment Status': isFirst ? fulfillment : '',
        'Fulfilled at': isFirst ? (o.date_completed || '') : '',
        'Accepts Marketing': isFirst ? 'no' : '',
        'Currency': isFirst ? (o.currency || 'CAD') : '',
        'Subtotal': isFirst ? (o.subtotal ?? '') : '',
        'Shipping': isFirst ? (o.shipping_cost ?? '') : '',
        'Taxes': isFirst ? (o.tax ?? '') : '',
        'Total': isFirst ? (o.total ?? '') : '',
        'Discount Code': '',
        'Discount Amount': isFirst ? (o.discount_total ?? '') : '',
        'Shipping Method': isFirst ? (shipping.method_title || '') : '',
        'Created at': isFirst ? (o.date_created || '') : '',
        'Lineitem quantity': qty,
        'Lineitem name': name,
        'Lineitem price': price,
        'Lineitem compare at price': '',
        'Lineitem sku': item?.sku || '',
        'Lineitem requires shipping': 'true',
        'Lineitem taxable': 'true',
        'Lineitem fulfillment status': fulfillment,
        'Billing Name': isFirst ? fullName(billing) : '',
        'Billing Street': isFirst ? [billing.address_1 || billing.address1, billing.address_2 || billing.address2].filter(Boolean).join(' ') : '',
        'Billing Address1': isFirst ? (billing.address_1 || billing.address1 || '') : '',
        'Billing Address2': isFirst ? (billing.address_2 || billing.address2 || '') : '',
        'Billing Company': isFirst ? (billing.company || '') : '',
        'Billing City': isFirst ? (billing.city || '') : '',
        'Billing Zip': isFirst ? (billing.postcode || billing.zip || billing.postal_code || '') : '',
        'Billing Province': isFirst ? (billing.state || billing.province || '') : '',
        'Billing Country': isFirst ? (billing.country || 'CA') : '',
        'Billing Phone': isFirst ? (billing.phone || '') : '',
        'Shipping Name': isFirst ? fullName(shipping) : '',
        'Shipping Street': isFirst ? [shipping.address_1 || shipping.address1, shipping.address_2 || shipping.address2].filter(Boolean).join(' ') : '',
        'Shipping Address1': isFirst ? (shipping.address_1 || shipping.address1 || '') : '',
        'Shipping Address2': isFirst ? (shipping.address_2 || shipping.address2 || '') : '',
        'Shipping Company': isFirst ? (shipping.company || '') : '',
        'Shipping City': isFirst ? (shipping.city || '') : '',
        'Shipping Zip': isFirst ? (shipping.postcode || shipping.zip || shipping.postal_code || '') : '',
        'Shipping Province': isFirst ? (shipping.state || shipping.province || '') : '',
        'Shipping Country': isFirst ? (shipping.country || 'CA') : '',
        'Shipping Phone': isFirst ? (shipping.phone || '') : '',
        'Notes': isFirst ? (o.customer_note || '') : '',
        'Note Attributes': '',
        'Cancelled at': '',
        'Payment Method': isFirst ? (o.payment_method || '') : '',
        'Payment Reference': '',
        'Refunded Amount': '',
        'Vendor': 'Sister Storage',
        'Tags': isFirst ? `imported,${o.source || 'legacy'}` : '',
        'Source': isFirst ? (o.source || '') : '',
        'Phone': isFirst ? (billing.phone || '') : '',
      });
    });
  }

  return toCsv(rows, ORDER_COLUMNS);
}
