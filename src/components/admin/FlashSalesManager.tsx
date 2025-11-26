import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Zap } from 'lucide-react';
import { useFlashSales, useDeleteFlashSale, FlashSale, applyFlashSaleDiscount } from '@/hooks/useFlashSales';
import { useProducts } from '@/hooks/useProducts';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { FlashSaleForm } from './FlashSaleForm';
import { FlashSaleStatusBadge } from './FlashSaleStatusBadge';
import { DiscountConflictWarning } from './DiscountConflictWarning';
import { ActivePromotionsSummary } from './ActivePromotionsSummary';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

export const FlashSalesManager = () => {
  const { data: sales, isLoading } = useFlashSales();
  const { data: products = [] } = useProducts();
  const { discount: storeDiscount } = useStoreDiscount();
  const deleteMutation = useDeleteFlashSale();
  const [formOpen, setFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
  const [deletingSale, setDeletingSale] = useState<FlashSale | null>(null);

  // Filter currently active sales
  const now = new Date();
  const activeSales = sales?.filter(sale => {
    const start = new Date(sale.starts_at);
    const end = new Date(sale.ends_at);
    return sale.enabled && start <= now && end >= now;
  }) || [];

  // Get products affected by a sale
  const getSaleProducts = (sale: FlashSale) => {
    if (sale.applies_to === 'all') {
      return products;
    } else if (sale.applies_to === 'products' && sale.product_ids) {
      return products.filter(p => sale.product_ids?.includes(parseInt(p.id)));
    } else if (sale.applies_to === 'categories' && sale.category_slugs) {
      return products.filter(p => 
        p.taxonomy?.categorySlugs?.some(slug => sale.category_slugs?.includes(slug))
      );
    }
    return [];
  };

  const handleEdit = (sale: FlashSale) => {
    setEditingSale(sale);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (deletingSale) {
      await deleteMutation.mutateAsync(deletingSale.id);
      setDeletingSale(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingSale(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Active Promotions Summary - Highlighted */}
      <div className="border-2 border-purple-500 rounded-lg shadow-lg">
        <ActivePromotionsSummary />
      </div>

      {/* Discount Conflict Warning */}
      <DiscountConflictWarning
        storeWideEnabled={storeDiscount?.enabled}
        storeWidePercentage={storeDiscount?.percentage}
        activeFlashSalesCount={activeSales.length}
      />

      {/* Currently Active Sales Section */}
      {activeSales.length > 0 && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Zap className="h-5 w-5" />
              Currently Active Sales
            </CardTitle>
            <CardDescription>
              {activeSales.length} sale{activeSales.length !== 1 ? 's' : ''} running right now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSales.map((sale) => {
                const saleProducts = getSaleProducts(sale);
                
                return (
                  <div key={sale.id} className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-lg">{sale.name}</h4>
                          {sale.description && (
                            <p className="text-sm text-muted-foreground">{sale.description}</p>
                          )}
                          <div className="flex gap-4 text-sm">
                            <span className="font-medium">
                              {sale.discount_type === 'percentage' && `${sale.discount_value}% OFF`}
                              {sale.discount_type === 'fixed_amount' && `$${sale.discount_value} OFF`}
                              {sale.discount_type === 'bogo' && 'BOGO'}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="capitalize">{sale.applies_to}</span>
                            {sale.product_ids && sale.product_ids.length > 0 && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <span>{sale.product_ids.length} product{sale.product_ids.length !== 1 ? 's' : ''}</span>
                              </>
                            )}
                            {sale.category_slugs && sale.category_slugs.length > 0 && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <span>{sale.category_slugs.length} categor{sale.category_slugs.length !== 1 ? 'ies' : 'y'}</span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Ends: {format(new Date(sale.ends_at), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(sale)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Products with discounted prices */}
                    {saleProducts.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-4">
                        {saleProducts.map((product) => {
                          const { discountedPrice } = applyFlashSaleDiscount(product.price, sale);
                          
                          return (
                            <div key={product.id} className="border rounded-lg p-3 bg-white">
                              {product.images?.[0] && (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  className="w-full h-32 object-cover rounded mb-2"
                                />
                              )}
                              <h5 className="text-sm font-medium line-clamp-2 mb-1">{product.name}</h5>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  ${discountedPrice.toFixed(2)}
                                </span>
                              </div>
                              <div className="text-xs text-green-600 font-medium">
                                Save ${(product.price - discountedPrice).toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Flash Sales
              </CardTitle>
              <CardDescription>
                Create and manage limited-time sales campaigns
              </CardDescription>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sale
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading sales...</div>
          ) : !sales || sales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No flash sales yet. Create your first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Applies To</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <FlashSaleStatusBadge sale={sale} />
                    </TableCell>
                    <TableCell className="font-medium">{sale.name}</TableCell>
                    <TableCell>
                      {sale.discount_type === 'percentage' && `${sale.discount_value}% OFF`}
                      {sale.discount_type === 'fixed_amount' && `$${sale.discount_value} OFF`}
                      {sale.discount_type === 'bogo' && 'BOGO'}
                    </TableCell>
                    <TableCell className="capitalize">{sale.applies_to}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(sale.starts_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(sale.ends_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>{sale.priority}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(sale)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingSale(sale)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <FlashSaleForm
        open={formOpen}
        onOpenChange={handleFormClose}
        sale={editingSale}
      />

      <AlertDialog open={!!deletingSale} onOpenChange={() => setDeletingSale(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flash Sale</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSale?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
