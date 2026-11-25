import type { CartItem } from '@/contexts/CartContext';
import { catalogPrice, findCatalogProduct, productKey, type CatalogProduct } from '../../supabase/functions/_shared/catalog-pricing';

// Keep quantities, sleeve choices, and cart identifiers; only refresh catalog pricing.
export function refreshCartPrices(items: CartItem[], products: CatalogProduct[]): CartItem[] {
  return items.map(item => {
    try {
      const product = findCatalogProduct(productKey(item), products);
      return product ? { ...item, ...catalogPrice(product) } : item;
    } catch {
      // Unresolved items stay visible; checkout rejects them rather than trusting cached prices.
      return item;
    }
  });
}