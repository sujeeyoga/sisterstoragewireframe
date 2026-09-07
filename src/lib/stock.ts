/**
 * Single source of truth for "is this product purchasable right now".
 * A product is sold out when the dashboard flag says so (inStock === false)
 * or when its tracked stock has run down to zero.
 */
export const isSoldOut = (product?: {
  inStock?: boolean;
  stock?: number;
  stockQuantity?: number;
} | null): boolean => {
  if (!product) return false;
  if (product.inStock === false) return true;
  if (typeof product.stock === "number" && product.stock <= 0) return true;
  if (
    product.stock === undefined &&
    typeof product.stockQuantity === "number" &&
    product.stockQuantity <= 0
  )
    return true;
  return false;
};
