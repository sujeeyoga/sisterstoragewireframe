import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { FlashSale, useCreateFlashSale, useUpdateFlashSale } from '@/hooks/useFlashSales';
import { useProducts } from '@/hooks/useProducts';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';

interface FlashSaleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: FlashSale | null;
}

export const FlashSaleForm = ({ open, onOpenChange, sale }: FlashSaleFormProps) => {
  const { data: products } = useProducts();
  const { discount: storeDiscount } = useStoreDiscount();
  const createMutation = useCreateFlashSale();
  const updateMutation = useUpdateFlashSale();

  const [formData, setFormData] = useState({
    name: sale?.name || '',
    description: sale?.description || '',
    discount_type: sale?.discount_type || 'percentage',
    discount_value: sale?.discount_value || 0,
    applies_to: sale?.applies_to || 'all',
    product_ids: sale?.product_ids || [],
    category_slugs: sale?.category_slugs || [],
    starts_at: sale?.starts_at ? new Date(sale.starts_at).toISOString().slice(0, 16) : '',
    ends_at: sale?.ends_at ? new Date(sale.ends_at).toISOString().slice(0, 16) : '',
    enabled: sale?.enabled ?? true,
    priority: sale?.priority || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const saleData = {
      ...formData,
      starts_at: new Date(formData.starts_at).toISOString(),
      ends_at: new Date(formData.ends_at).toISOString(),
      product_ids: formData.applies_to === 'products' ? formData.product_ids : null,
      category_slugs: formData.applies_to === 'categories' ? formData.category_slugs : null,
    };

    if (sale) {
      await updateMutation.mutateAsync({ id: sale.id, ...saleData });
    } else {
      await createMutation.mutateAsync(saleData as any);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sale ? 'Edit Flash Sale' : 'Create Flash Sale'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Store-wide discount info banner */}
          {storeDiscount?.enabled && (
            <Alert className="border-blue-500 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Note:</strong> A {storeDiscount.percentage}% store-wide discount is currently active. 
                Flash sales take priority and will override the store-wide discount for affected products.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Sale Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Black Friday Sale"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Limited time offer..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_type">Discount Type *</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value: any) => setFormData({ ...formData, discount_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                  <SelectItem value="bogo">Buy One Get One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_value">
                Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="discount_value"
                type="number"
                min="0"
                step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applies_to">Applies To *</Label>
            <Select
              value={formData.applies_to}
              onValueChange={(value: any) => setFormData({ ...formData, applies_to: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="products">Specific Products</SelectItem>
                <SelectItem value="categories">Categories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.applies_to === 'products' && (
            <div className="space-y-2">
              <Label>Select Products</Label>
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                {products?.map((product) => (
                  <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.product_ids.includes(Number(product.id))}
                      onChange={(e) => {
                        const productId = Number(product.id);
                        const ids = e.target.checked
                          ? [...formData.product_ids, productId]
                          : formData.product_ids.filter((id) => id !== productId);
                        setFormData({ ...formData, product_ids: ids });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{product.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starts_at">Start Date & Time *</Label>
              <Input
                id="starts_at"
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ends_at">End Date & Time *</Label>
              <Input
                id="ends_at"
                type="datetime-local"
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority (Higher = Takes precedence)</Label>
            <Input
              id="priority"
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
            />
            <Label htmlFor="enabled">Enable this sale</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {sale ? 'Update' : 'Create'} Sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
