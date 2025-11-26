import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap, Tag, Package, Loader2 } from 'lucide-react';
import { useFlashSales, useUpdateFlashSale } from '@/hooks/useFlashSales';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { useProducts } from '@/hooks/useProducts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ActivePromotionsSummary = () => {
  const { data: flashSales } = useFlashSales();
  const { discount: storeDiscount } = useStoreDiscount();
  const { data: products = [] } = useProducts();
  const queryClient = useQueryClient();
  const updateFlashSale = useUpdateFlashSale();

  // Mutation to toggle store-wide discount
  const toggleStoreDiscount = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await supabase
        .from('store_settings')
        .update({ enabled })
        .eq('setting_key', 'store_wide_discount');
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-discount'] });
      toast.success('Store-wide discount updated');
    },
    onError: (error) => {
      toast.error('Failed to update discount: ' + error.message);
    },
  });

  // Function to disable all active flash sales
  const disableAllFlashSales = useMutation({
    mutationFn: async () => {
      const salesToDisable = activeFlashSales.map(sale => 
        updateFlashSale.mutateAsync({ id: sale.id, enabled: false })
      );
      await Promise.all(salesToDisable);
    },
    onSuccess: () => {
      toast.success('All flash sales disabled');
    },
    onError: (error) => {
      toast.error('Failed to disable flash sales: ' + error.message);
    },
  });

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
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <Tag className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium">Store-Wide Discount</p>
                <p className="text-sm text-muted-foreground">
                  Applies to all full-price items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {storeDiscount?.enabled ? (
                <Badge className="bg-green-500">
                  {storeDiscount.percentage}% OFF
                </Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
              <Switch
                checked={storeDiscount?.enabled || false}
                onCheckedChange={(checked) => toggleStoreDiscount.mutate(checked)}
                disabled={toggleStoreDiscount.isPending}
              />
              {toggleStoreDiscount.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </div>

          {/* Flash Sales */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium">Flash Sales</p>
                <p className="text-sm text-muted-foreground">
                  Time-limited promotional campaigns
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={activeFlashSales.length > 0 ? 'bg-yellow-500' : ''} variant={activeFlashSales.length > 0 ? 'default' : 'secondary'}>
                {activeFlashSales.length} Active
              </Badge>
              {activeFlashSales.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => disableAllFlashSales.mutate()}
                  disabled={disableAllFlashSales.isPending}
                >
                  {disableAllFlashSales.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Disabling...
                    </>
                  ) : (
                    'Disable All'
                  )}
                </Button>
              )}
            </div>
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