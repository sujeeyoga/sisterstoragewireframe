import { useEffect, useState, useRef } from 'react';
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
import { ArrowLeft, Bold, Italic, Underline, Type, History, Save, Check, Bookmark, ShoppingBag, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { products as staticProducts } from '@/data/products';
import { productTaxonomyMap } from '@/data/product-taxonomy';

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
  images: string[];
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  package_value: number | null;
};

type VersionHistory = {
  timestamp: number;
  data: ProductFormData;
};

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = id !== 'new';
  
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimeout = useRef<NodeJS.Timeout>();
  const lastSavedData = useRef<ProductFormData | null>(null);

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

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      manage_stock: false,
      in_stock: true,
      images: [],
    },
  });

  useEffect(() => {
    if (product) {
      const productImages = product.images as any;
      const imageUrls = Array.isArray(productImages) 
        ? productImages.map((img: any) => img.src || img).filter(Boolean)
        : [];
      
      const initialData = {
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
        images: imageUrls,
        weight: product.weight ? Number(product.weight) : null,
        length: product.length ? Number(product.length) : null,
        width: product.width ? Number(product.width) : null,
        height: product.height ? Number(product.height) : null,
        package_value: product.package_value ? Number(product.package_value) : null,
      };
      reset(initialData);
      setUploadedImages(imageUrls);
      lastSavedData.current = initialData;
      setSaveStatus('saved');
    }
  }, [product, reset]);

  // Auto-save effect
  useEffect(() => {
    if (!isEdit) return; // Only auto-save for existing products
    
    const subscription = watch((formData) => {
      if (!lastSavedData.current) return;
      
      // Check if data has actually changed
      const hasChanged = JSON.stringify(formData) !== JSON.stringify(lastSavedData.current);
      
      if (hasChanged) {
        setSaveStatus('unsaved');
        
        // Clear existing timeout
        if (autoSaveTimeout.current) {
          clearTimeout(autoSaveTimeout.current);
        }
        
        // Set new timeout for auto-save
        autoSaveTimeout.current = setTimeout(() => {
          const dataToSave = formData as ProductFormData;
          
          // Save current version to history before auto-saving
          if (lastSavedData.current) {
            setVersionHistory(prev => {
              const newHistory = [
                { timestamp: Date.now(), data: lastSavedData.current! },
                ...prev.slice(0, 9) // Keep last 10 versions
              ];
              return newHistory;
            });
          }
          
          setSaveStatus('saving');
          saveMutation.mutate(dataToSave);
        }, 2000); // Auto-save after 2 seconds of no changes
      }
    });
    
    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [watch, isEdit]);

  const restoreVersion = (version: VersionHistory) => {
    reset(version.data);
    lastSavedData.current = version.data;
    setSaveStatus('unsaved');
    setShowHistory(false);
    toast({
      title: 'Version restored',
      description: 'Click Save to keep these changes',
    });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      const updatedImages = [...uploadedImages, ...newImages];
      setUploadedImages(updatedImages);
      setValue('images', updatedImages);
      setSaveStatus('unsaved');

      toast({
        title: 'Images uploaded successfully',
        description: `${newImages.length} image(s) added`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setValue('images', updatedImages);
    setSaveStatus('unsaved');
  };

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
          images: uploadedImages.map(url => ({ src: url })),
          weight: data.weight,
          length: data.length,
          width: data.width,
          height: data.height,
          package_value: data.package_value,
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
          images: uploadedImages.map(url => ({ src: url })),
          weight: data.weight,
          length: data.length,
          width: data.width,
          height: data.height,
          package_value: data.package_value,
        };
        
        const { error } = await supabase
          .from('woocommerce_products')
          .insert([insertPayload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      const successMessage = isEdit ? 'Product auto-saved' : 'Product created successfully';
      toast({ title: successMessage });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      
      // Update last saved data reference
      lastSavedData.current = formValues as ProductFormData;
      setSaveStatus('saved');
      
      if (!isEdit) {
        navigate('/admin/products');
      }
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

  const handleTextFormat = (field: 'short_description' | 'description', formatType: 'bold' | 'italic' | 'underline' | 'small' | 'medium' | 'large') => {
    const textarea = document.getElementById(field) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;

    let formattedText = '';
    switch (formatType) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'small':
        formattedText = `<span style="font-size: 0.875em">${selectedText}</span>`;
        break;
      case 'medium':
        formattedText = `<span style="font-size: 1em">${selectedText}</span>`;
        break;
      case 'large':
        formattedText = `<span style="font-size: 1.25em">${selectedText}</span>`;
        break;
    }

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    textarea.value = newValue;
    textarea.focus();
    textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    
    // Trigger form update
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/products')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        
        {isEdit && (
          <div className="flex items-center gap-3">
            {saveStatus === 'saved' && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Check className="h-3 w-3 mr-1" />
                Saved
              </Badge>
            )}
            {saveStatus === 'saving' && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Save className="h-3 w-3 mr-1 animate-pulse" />
                Saving...
              </Badge>
            )}
            {saveStatus === 'unsaved' && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Unsaved changes
              </Badge>
            )}
            
            {versionHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-4 w-4 mr-2" />
                History ({versionHistory.length})
              </Button>
            )}
          </div>
        )}
      </div>

      {showHistory && versionHistory.length > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-sm">Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {versionHistory.map((version, index) => (
                <div
                  key={version.timestamp}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{version.data.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(version.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => restoreVersion(version)}
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="short_description">Short Description</Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleTextFormat('short_description', 'bold')}
                    title="Bold"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleTextFormat('short_description', 'italic')}
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleTextFormat('short_description', 'underline')}
                    title="Underline"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </Button>
                  <div className="w-px h-7 bg-border mx-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleTextFormat('short_description', 'small')}
                    title="Small text"
                  >
                    S
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-sm"
                    onClick={() => handleTextFormat('short_description', 'medium')}
                    title="Medium text"
                  >
                    M
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => handleTextFormat('short_description', 'large')}
                    title="Large text"
                  >
                    L
                  </Button>
                </div>
              </div>
              <Textarea
                id="short_description"
                {...register('short_description')}
                placeholder="Brief product description"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Select text and click formatting buttons to apply styles
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Full Description</Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleTextFormat('description', 'bold')}
                    title="Bold"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleTextFormat('description', 'italic')}
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleTextFormat('description', 'underline')}
                    title="Underline"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </Button>
                  <div className="w-px h-7 bg-border mx-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleTextFormat('description', 'small')}
                    title="Small text"
                  >
                    S
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-sm"
                    onClick={() => handleTextFormat('description', 'medium')}
                    title="Medium text"
                  >
                    M
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => handleTextFormat('description', 'large')}
                    title="Large text"
                  >
                    L
                  </Button>
                </div>
              </div>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Detailed product description"
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Select text and click formatting buttons to apply styles
              </p>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4 pt-4 border-t">
                <Label>Product Images</Label>
                <div className="space-y-3">
                  {/* Upload Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleImageUpload(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {isUploading ? 'Uploading...' : 'Click or drag images to upload'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP up to 10MB each
                    </p>
                  </div>

                  {/* Image Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {index === 0 && (
                            <Badge className="absolute bottom-1 left-1 text-xs">
                              Primary
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="manage_stock"
                      checked={manageStock}
                      onCheckedChange={(checked) => {
                        setValue('manage_stock', checked);
                        if (!checked) {
                          // Clear stock quantity when switching to unlimited
                          setValue('stock_quantity', null);
                        }
                        setSaveStatus('unsaved');
                      }}
                    />
                    <Label htmlFor="manage_stock">Track Stock Quantity</Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">
                    {manageStock 
                      ? 'Stock is limited to a specific quantity' 
                      : '✓ Unlimited stock - quantity not tracked'}
                  </p>
                </div>

                {manageStock && (
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      {...register('stock_quantity', { valueAsNumber: true })}
                      placeholder="Enter available quantity"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="in_stock"
                      {...register('in_stock')}
                    />
                    <Label htmlFor="in_stock">Available for Purchase</Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">
                    Toggle off to temporarily hide from shop
                  </p>
                </div>
              </div>

              {/* Shipping Information */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Information</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Used for calculating accurate shipping rates
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (grams)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="1"
                        {...register('weight', { valueAsNumber: true })}
                        placeholder="e.g., 170 for Travel box"
                      />
                      <p className="text-xs text-muted-foreground">
                        Travel: 170g, Medium: 297g, Large: 581g
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="package_value">Package Value (USD)</Label>
                      <Input
                        id="package_value"
                        type="number"
                        step="1"
                        {...register('package_value', { valueAsNumber: true })}
                        placeholder="e.g., 75"
                      />
                      <p className="text-xs text-muted-foreground">
                        For customs declarations
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        {...register('length', { valueAsNumber: true })}
                        placeholder="e.g., 25"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        {...register('width', { valueAsNumber: true })}
                        placeholder="e.g., 20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        {...register('height', { valueAsNumber: true })}
                        placeholder="e.g., 10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : isEdit ? 'Save Now' : 'Create Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/products')}
                >
                  Cancel
                </Button>
                {isEdit && (
                  <p className="text-xs text-muted-foreground self-center ml-2">
                    Auto-saves 2 seconds after changes
                  </p>
                )}
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
              <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg h-full">
                <div className="block relative">
                  <div className="relative overflow-hidden">
                    {/* Product Image with aspect-square ratio */}
                    <div className="aspect-square transition-transform duration-500 overflow-hidden">
                      {(() => {
                        // First try uploaded images
                        if (uploadedImages.length > 0) {
                          return (
                            <img 
                              src={uploadedImages[0]} 
                              alt={formValues.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          );
                        }
                        
                        // Then try shop product images
                        const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                        const imageUrl = shopProduct?.images?.[0];
                        
                        if (imageUrl) {
                          return (
                            <img 
                              src={imageUrl} 
                              alt={formValues.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          );
                        }
                        
                        // Fallback to colored placeholder
                        return (
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: shopProduct?.color || '#E91E63' }}
                          >
                            <ImageIcon className="h-12 w-12 text-background/50" />
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300"></div>
                    
                    {/* Bookmark button */}
                    <Button 
                      size="icon"
                      variant="ghost" 
                      className="absolute top-2 right-2 rounded-full bg-background/70 hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-300"
                      disabled
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    
                    {/* Product badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {(() => {
                        const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                        return (
                          <>
                            {shopProduct?.bestSeller && <Badge>Best Seller</Badge>}
                            {formValues.manage_stock && formValues.stock_quantity !== null && formValues.stock_quantity <= 5 && formValues.stock_quantity > 0 && (
                              <Badge variant="outline">Only {formValues.stock_quantity} left</Badge>
                            )}
                            {!formValues.in_stock && (
                              <Badge variant="destructive">Out of Stock</Badge>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* All product information underneath */}
                  <CardContent className="px-4 py-4 flex flex-col h-full">
                    {/* Title & Price - Fixed Height */}
                    <div className="mb-2 flex justify-between items-start min-h-[5rem]">
                      <h3 className="font-bold text-3xl lg:text-4xl line-clamp-2 flex-1 uppercase">
                        {formValues.name || 'Product Name'}
                      </h3>
                      <div className="text-right flex-shrink-0 ml-2">
                        {formValues.sale_price && formValues.sale_price < formValues.regular_price ? (
                          <div className="flex flex-col items-end">
                            <span className="text-sm text-muted-foreground line-through">
                              ${Number(formValues.regular_price || 0).toFixed(2)}
                            </span>
                            <span className="font-bold text-2xl text-[hsl(var(--primary))]">
                              ${Number(formValues.sale_price).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-2xl">
                            ${Number(formValues.price || 0).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Sister Caption - Fixed Height */}
                    <div className="min-h-[2rem] mb-2">
                      {(() => {
                        const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                        return shopProduct?.caption ? (
                          <p className="text-[hsl(var(--primary))] text-lg font-medium italic line-clamp-1">
                            "{shopProduct.caption}"
                          </p>
                        ) : null;
                      })()}
                    </div>
                    
                    {/* Description - Fixed Height */}
                    <div className="h-[3rem] mb-3">
                      {formValues.description && (
                        <p className="text-muted-foreground text-lg line-clamp-2">
                          {formValues.description.replace(/<[^>]*>/g, '')}
                        </p>
                      )}
                    </div>
                    
                    {/* Material - Fixed Height */}
                    <div className="h-[1.5rem] mb-3 text-sm text-muted-foreground">
                      {(() => {
                        const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                        return shopProduct?.material || 'Premium materials';
                      })()}
                    </div>
                    
                    {/* Feature - Fixed Height */}
                    <div className="h-[1.5rem] mb-3">
                      {(() => {
                        const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                        const feature = shopProduct?.features?.[0];
                        return feature ? (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Check className="h-4 w-4 text-[hsl(var(--primary))]" /> 
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ) : null;
                      })()}
                    </div>
                    
                    {/* Rod Count - Fixed Height */}
                    <div className="min-h-[4rem] mb-3 flex justify-center">
                      {(() => {
                        const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                        if (!shopProduct) return null;
                        
                        const taxonomy = productTaxonomyMap[shopProduct.id];
                        const rodCount = taxonomy?.attributes?.rodCount;
                        
                        return rodCount ? (
                          <div className="inline-flex flex-col items-center bg-[hsl(var(--primary))] text-primary-foreground rounded-lg px-3 py-2">
                            <span className="text-xs font-medium">RODS</span>
                            <span className="text-2xl font-bold">{rodCount}</span>
                          </div>
                        ) : null;
                      })()}
                    </div>
                    
                    {/* Attribute Chips - Fixed Height */}
                    <div className="min-h-[2rem] mb-3">
                      {(() => {
                        const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                        if (!shopProduct) return null;
                        
                        const taxonomy = productTaxonomyMap[shopProduct.id];
                        const attrs = taxonomy?.attributes;
                        if (!attrs) return null;
                        
                        const chips: React.ReactNode[] = [];
                        const push = (label: string, vals?: unknown) => {
                          const arr = Array.isArray(vals) ? vals : vals ? [vals] : [];
                          arr.forEach((v, i) =>
                            chips.push(
                              <Badge key={`${label}-${String(v)}-${i}`} variant="outline" className="text-xs h-6 px-2">
                                {label}: {String(v)}
                              </Badge>
                            )
                          );
                        };
                        push("Size", attrs.size);
                        push("Use", attrs.useCase);
                        push("Bundle", attrs.bundleSize);
                        
                        return chips.length > 0 ? (
                          <div className="flex flex-wrap gap-2">{chips}</div>
                        ) : null;
                      })()}
                    </div>
                    
                    {/* Bottom Section - Fixed at Bottom */}
                    <div className="mt-auto space-y-2">
                      {/* SKU - Fixed Height */}
                      <div className="min-h-[1rem]">
                        {(() => {
                          const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                          return shopProduct?.sku ? (
                            <div className="text-xs text-muted-foreground">
                              SKU: {shopProduct.sku}
                            </div>
                          ) : null;
                        })()}
                      </div>
                      
                      {/* Category Badge - Fixed Height */}
                      <div className="flex justify-between items-center h-8">
                        {(() => {
                          const shopProduct = staticProducts.find(p => p.slug === formValues.slug);
                          return shopProduct?.category ? (
                            <Badge variant="outline" className="h-6 px-3">{shopProduct.category}</Badge>
                          ) : null;
                        })()}
                      </div>
                      
                      {/* Add to Cart Button */}
                      <Button
                        className="w-full"
                        size="lg"
                        disabled
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
