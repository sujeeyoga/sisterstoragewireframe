import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  regular_price: number;
  sale_price: number | null;
  manage_stock: boolean;
  stock_quantity: number | null;
  in_stock: boolean;
};

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = id !== 'new';

  const { data: product } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      if (!isEdit || !id) return null;
      const { data, error } = await supabase
        .from('woocommerce_products')
        .select('*')
        .eq('id', parseInt(id))
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit && !!id,
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      manage_stock: false,
      in_stock: true,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        short_description: product.short_description || '',
        price: Number(product.price) || 0,
        regular_price: Number(product.regular_price) || 0,
        sale_price: product.sale_price ? Number(product.sale_price) : null,
        manage_stock: product.manage_stock || false,
        stock_quantity: product.stock_quantity,
        in_stock: product.in_stock,
      });
    }
  }, [product, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (isEdit && id) {
        const updatePayload = {
          name: data.name,
          slug: data.slug,
          description: data.description,
          short_description: data.short_description,
          price: data.price,
          regular_price: data.regular_price,
          sale_price: data.sale_price,
          manage_stock: data.manage_stock,
          stock_quantity: data.stock_quantity,
          in_stock: data.in_stock,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('woocommerce_products')
          .update(updatePayload)
          .eq('id', parseInt(id));
        if (error) throw error;
      } else {
        // For new products, generate ID from timestamp
        const insertPayload = {
          id: Date.now(),
          name: data.name,
          slug: data.slug,
          description: data.description,
          short_description: data.short_description,
          price: data.price,
          regular_price: data.regular_price,
          sale_price: data.sale_price,
          manage_stock: data.manage_stock,
          stock_quantity: data.stock_quantity,
          in_stock: data.in_stock,
        };
        
        const { error } = await supabase
          .from('woocommerce_products')
          .insert([insertPayload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: `Product ${isEdit ? 'updated' : 'created'} successfully` });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEdit ? 'update' : 'create'} product`,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const manageStock = watch('manage_stock');
  const formValues = watch();

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/products')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug', { required: 'Slug is required' })}
                    placeholder="product-slug"
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  {...register('short_description')}
                  placeholder="Brief product description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Detailed product description"
                  rows={5}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Price is required', valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regular_price">Regular Price</Label>
                  <Input
                    id="regular_price"
                    type="number"
                    step="0.01"
                    {...register('regular_price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale_price">Sale Price</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    {...register('sale_price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="manage_stock"
                    {...register('manage_stock')}
                  />
                  <Label htmlFor="manage_stock">Manage Stock</Label>
                </div>

                {manageStock && (
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      {...register('stock_quantity', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="in_stock"
                    {...register('in_stock')}
                  />
                  <Label htmlFor="in_stock">In Stock</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/products')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="lg:sticky lg:top-8 h-fit">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              How this product will appear on the shop page
            </p>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto">
              <Card className="group overflow-hidden border-none shadow-md h-full bg-white">
                {/* Product Image Preview */}
                <div className="relative overflow-hidden">
                  <div 
                    className="w-full aspect-square flex items-center justify-center text-white font-bold text-xs uppercase"
                    style={{ backgroundColor: '#E91E63' }}
                  >
                    <span className="line-clamp-1 text-center px-2 tracking-wide">Sister Storage</span>
                  </div>
                </div>
                
                <CardContent className="p-3 space-y-3">
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400">★</span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs font-medium">(124)</span>
                  </div>
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight line-clamp-2 uppercase">
                      {formValues.name || 'Product Name'}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed line-clamp-2">
                      {(formValues.short_description || 'Product description goes here').replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                  
                  {/* Price Display */}
                  {formValues.price > 0 && (
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          ${formValues.sale_price || formValues.price}
                        </span>
                        {formValues.sale_price && formValues.regular_price && (
                          <span className="text-lg text-gray-500 line-through">
                            ${formValues.regular_price}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  <div className="text-sm">
                    {formValues.in_stock ? (
                      <span className="text-green-600 font-medium">✓ In Stock</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Out of Stock</span>
                    )}
                    {formValues.manage_stock && formValues.stock_quantity !== null && (
                      <span className="text-gray-500 ml-2">
                        ({formValues.stock_quantity} available)
                      </span>
                    )}
                  </div>
                  
                  {/* Buy Button */}
                  <Button
                    variant="buy"
                    size="buy"
                    className="w-full font-bold text-sm py-3"
                    disabled
                  >
                    ADD TO CART
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
