import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Tag, Package } from 'lucide-react';
import { useFlashSales } from '@/hooks/useFlashSales';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { useProducts } from '@/hooks/useProducts';

export const ActivePromotionsSummary = () => {
  const { data: flashSales } = useFlashSales();
  const { discount: storeDiscount } = useStoreDiscount();
  const { data: products = [] } = useProducts();

  // Filter active flash sales
  const now = new Date();
  const activeFlashSales = flashSales?.filter(sale => {
    const start = new Date(sale.starts_at);
    const end = new Date(sale.ends_at);
    return sale.enabled && start <= now && end >= now;
  }) || [];

  // Count products with sale prices
  const productsOnSale = products.filter(p => p.salePrice && p.originalPrice && p.salePrice < p.originalPrice).length;

  const totalActivePromotions = 
    (storeDiscount?.enabled ? 1 : 0) + 
    activeFlashSales.length + 
    (productsOnSale > 0 ? 1 : 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Active Promotions Overview
        </CardTitle>
        <CardDescription>
          Summary of all current discounts and promotional offers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Summary */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Active Promotions</p>
              <p className="text-3xl font-bold">{totalActivePromotions}</p>
            </div>
          </div>

          {/* Store-Wide Discount */}
          <div className="flex items-start justify-between p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">Store-Wide Discount</p>
                <p className="text-sm text-muted-foreground">
                  Applies to all full-price items
                </p>
              </div>
            </div>
            {storeDiscount?.enabled ? (
              <Badge className="bg-green-500">
                {storeDiscount.percentage}% OFF
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>

          {/* Flash Sales */}
          <div className="flex items-start justify-between p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium">Flash Sales</p>
                <p className="text-sm text-muted-foreground">
                  Time-limited promotional campaigns
                </p>
              </div>
            </div>
            <Badge className={activeFlashSales.length > 0 ? 'bg-yellow-500' : ''} variant={activeFlashSales.length > 0 ? 'default' : 'secondary'}>
              {activeFlashSales.length} Active
            </Badge>
          </div>

          {/* Product Sale Prices */}
          <div className="flex items-start justify-between p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Product Sale Prices</p>
                <p className="text-sm text-muted-foreground">
                  Individual product discounts
                </p>
              </div>
            </div>
            <Badge className={productsOnSale > 0 ? 'bg-blue-500' : ''} variant={productsOnSale > 0 ? 'default' : 'secondary'}>
              {productsOnSale} Products
            </Badge>
          </div>

          {/* Discount Priority Explanation */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">Discount Priority Order:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li><strong>Flash Sales</strong> - Highest priority</li>
              <li><strong>Product Sale Prices</strong> - Mid priority</li>
              <li><strong>Store-Wide Discount</strong> - Only for full-price items</li>
            </ol>
            <p className="text-xs text-blue-700 mt-2">
              Only one discount applies per product. Discounts do not stack.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};