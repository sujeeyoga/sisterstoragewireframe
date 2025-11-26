import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, Search, Eye, EyeOff, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { products as staticProducts } from '@/data/products';
import { ProductFormDialog } from './ProductFormDialog';

type SortField = 'name' | 'price' | 'stock' | 'visible';
type SortDirection = 'asc' | 'desc' | null;

export const ProductsTable = () => {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check if a product exists on the shop page (static products)
  const isOnShopPage = (productSlug: string) => {
    return staticProducts.some(p => p.slug === productSlug);
  };

  // Get shop page product data by slug
  const getShopPageProduct = (productSlug: string) => {
    return staticProducts.find(p => p.slug === productSlug);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const { data: rawProducts, isLoading } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: async () => {
      let query = supabase
        .from('woocommerce_products')
        .select('*')
        .eq('visible', true)
        .eq('in_stock', true)
        .order('name');
      
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const products = rawProducts ? [...rawProducts].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.sale_price || a.regular_price || a.price || 0;
        bValue = b.sale_price || b.regular_price || b.price || 0;
        break;
      case 'stock':
        aValue = a.manage_stock ? (a.stock_quantity || 0) : Infinity;
        bValue = b.manage_stock ? (b.stock_quantity || 0) : Infinity;
        break;
      case 'visible':
        aValue = a.visible ? 1 : 0;
        bValue = b.visible ? 1 : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }) : rawProducts;

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('woocommerce_products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Product deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const { error } = await supabase
        .from('woocommerce_products')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (count) => {
      toast({ 
        title: 'Products deleted', 
        description: `${count} product(s) removed successfully` 
      });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowBulkDeleteDialog(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete products',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleBulkDelete = () => {
    if (!products) return;
    const productsNotOnShop = products.filter(p => !isOnShopPage(p.slug));
    const ids = productsNotOnShop.map(p => p.id);
    if (ids.length > 0) {
      bulkDeleteMutation.mutate(ids);
    }
  };

  const productsNotOnShop = products?.filter(p => !isOnShopPage(p.slug)) || [];

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: number; visible: boolean }) => {
      const { error } = await supabase
        .from('woocommerce_products')
        .update({ visible })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Product visibility updated' });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update visibility',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Showing shop-visible products only (visible & in stock)</p>
          {productsNotOnShop.length > 0 && (
            <p className="text-sm text-destructive mt-1">
              {productsNotOnShop.length} product(s) not on shop page
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {productsNotOnShop.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={() => setShowBulkDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove {productsNotOnShop.length} Hidden Products
            </Button>
          )}
          <Button onClick={() => {
            setEditingProduct(null);
            setShowProductForm(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="h-8 px-2 hover:bg-muted"
                >
                  Name
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('price')}
                  className="h-8 px-2 hover:bg-muted"
                >
                  Price
                  {getSortIcon('price')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('stock')}
                  className="h-8 px-2 hover:bg-muted"
                >
                  Stock
                  {getSortIcon('stock')}
                </Button>
              </TableHead>
              <TableHead>Weight (g)</TableHead>
              <TableHead>Dimensions (cm)</TableHead>
              <TableHead>Value ($)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('visible')}
                  className="h-8 px-2 hover:bg-muted"
                >
                  Visibility
                  {getSortIcon('visible')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => {
                const shopProduct = getShopPageProduct(product.slug);
                const displayName = shopProduct?.name || product.name;
                const displayPrice = shopProduct?.price || product.sale_price || product.regular_price || product.price;
                const displayStock = shopProduct?.stock || product.stock_quantity;
                const displayInStock = shopProduct?.inStock ?? product.in_stock;
                
                const firstImage = product.images?.[0]?.src;
                
                return (
                  <TableRow 
                    key={product.id}
                    className={`cursor-pointer hover:bg-muted/50 ${!product.visible ? 'opacity-50 bg-muted/30' : ''}`}
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                  >
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {firstImage ? (
                          <img 
                            src={firstImage} 
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {displayName}
                        {!product.visible && (
                          <Badge variant="secondary" className="text-xs">
                            Hidden
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      ${displayPrice}
                    </TableCell>
                    <TableCell>
                      {shopProduct ? displayStock : (product.manage_stock ? product.stock_quantity : 'Unlimited')}
                    </TableCell>
                    <TableCell>
                      {product.weight ? (
                        <span className="text-sm">{Number(product.weight).toFixed(0)}g</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.length && product.width && product.height ? (
                        <span className="text-sm">
                          {Number(product.length).toFixed(0)}×{Number(product.width).toFixed(0)}×{Number(product.height).toFixed(0)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.package_value ? (
                        <span className="text-sm">${Number(product.package_value).toFixed(0)}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={displayInStock ? 'default' : 'destructive'}>
                        {displayInStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVisibilityMutation.mutate({
                              id: product.id,
                              visible: !product.visible,
                            });
                          }}
                          title={product.visible ? 'Hide product' : 'Show product'}
                        >
                        {!isOnShopPage(product.slug) ? (
                          <Eye className="h-4 w-4 text-red-600" />
                        ) : product.visible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                      {!isOnShopPage(product.slug) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                This product is not in the shop page's product list.
                                It won't appear on the website even if visible.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(product.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Products Not on Shop Page</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {productsNotOnShop.length} product(s) that are not displayed on the shop page. 
              These products have a warning icon (⚠️) in the visibility column.
              <div className="mt-4 p-3 bg-muted rounded-md max-h-48 overflow-y-auto">
                <p className="text-sm font-medium mb-2">Products to be deleted:</p>
                <ul className="text-sm space-y-1">
                  {productsNotOnShop.map(p => (
                    <li key={p.id}>• {p.name}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 font-semibold text-destructive">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? 'Deleting...' : `Delete ${productsNotOnShop.length} Products`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProductFormDialog
        open={showProductForm}
        onOpenChange={(open) => {
          setShowProductForm(open);
          if (!open) setEditingProduct(null);
        }}
        product={editingProduct}
      />
    </div>
  );
};
