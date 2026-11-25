export type CatalogProduct = {
  id: number;
  slug: string;
  name: string;
  price: number | string | null;
  regular_price: number | string | null;
  sale_price: number | string | null;
  visible?: boolean;
  in_stock?: boolean;
};

export function productKey(item: { id: unknown; productId?: unknown }): string {
  const value = String(item.productId ?? item.id ?? '').trim();
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(value)) {
    throw new Error('A valid product identifier is required. Please update your cart.');
  }
  return value;
}

export function findCatalogProduct(key: string, products: CatalogProduct[]) {
  return products.find(product => String(product.id) === key || product.slug === key);
}

export function catalogPrice(product: CatalogProduct) {
  if (product.price === null || String(product.price).trim() === '') {
    throw new Error('Unable to confirm the current product price. Please try again.');
  }
  const price = Number(product.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error('Unable to confirm the current product price. Please try again.');
  }
  const regularPrice = product.regular_price == null ? price : Number(product.regular_price);
  const sale = product.sale_price == null || String(product.sale_price).trim() === ''
    ? undefined : Number(product.sale_price);
  return {
    price,
    regularPrice: Number.isFinite(regularPrice) ? regularPrice : price,
    salePrice: sale !== undefined && Number.isFinite(sale) && sale > 0 && sale < regularPrice
      ? sale : undefined,
  };
}

export function resolveCatalogItem<T extends { id: unknown; productId?: unknown; quantity: number }>(
  item: T, products: CatalogProduct[],
) {
  if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) {
    throw new Error('Cart quantity must be a positive whole number.');
  }
  const product = findCatalogProduct(productKey(item), products);
  if (!product || product.visible === false || product.in_stock === false) {
    throw new Error('A product is unavailable. Please update your cart and try again.');
  }
  return { ...item, id: product.id, name: product.name, ...catalogPrice(product) };
}

export function discountedCatalogPrice(
  item: { price: number; regularPrice: number; salePrice?: number },
  flashSale: { discount_type: string; discount_value: number } | null,
  storeDiscount: number,
) {
  let price = item.price;
  if (flashSale) {
    if (flashSale.discount_type === 'percentage') price *= 1 - flashSale.discount_value / 100;
    else if (flashSale.discount_type === 'fixed_amount') price -= flashSale.discount_value;
  } else if (storeDiscount > 0 && item.salePrice === undefined) {
    price *= 1 - storeDiscount / 100;
  }
  return Math.round(Math.max(0, price) * 100) / 100;
}

export function validateGiftItems(
  items: Array<{ id: number; quantity: number; isFreeGift?: boolean }>,
  promotion: { enabled: boolean; setting_value?: { gift_product_id?: number; countries?: string[]; min_order_amount?: number } } | null,
  country: string,
  subtotal: number,
) {
  const gifts = items.filter(item => item.isFreeGift);
  if (!gifts.length) return;
  const settings = promotion?.setting_value;
  if (!promotion?.enabled || gifts.length !== 1 || gifts[0].quantity !== 1 ||
      gifts[0].id !== (settings?.gift_product_id || 25814005) ||
      !(settings?.countries || ['US']).includes(country) ||
      subtotal < (settings?.min_order_amount || 100)) {
    throw new Error('This cart does not qualify for the free gift. Please refresh your cart.');
  }
}