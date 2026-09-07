import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useProductsCatalog } from '@/hooks/useProductsCatalog';
import { isSoldOut } from '@/lib/stock';

interface ReorderButtonProps {
  items: any[];
  orderNumber: string;
}

export const ReorderButton = ({ items, orderNumber }: ReorderButtonProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { data: catalog = [] } = useProductsCatalog();

  const handleReorder = () => {
    let addedCount = 0;
    let skippedSoldOut = 0;

    items.forEach((item: any) => {
      // Skip free gifts and non-reorderable items
      if (!item.isFreeGift && item.price > 0) {
        const itemId = String(item.product_id || item.id);
        const match = catalog.find(
          (p: any) => String(p.id) === itemId || String(p.slug) === itemId
        );
        if (match && isSoldOut(match)) {
          skippedSoldOut += 1;
          return;
        }
        // Add items one by one to respect quantity
        for (let i = 0; i < item.quantity; i++) {
          addItem({
            id: item.product_id || item.id,
            name: item.name,
            price: item.price,
            regularPrice: item.regular_price,
            salePrice: item.sale_price,
            image: item.image,
          });
        }
        addedCount++;
      }
    });

    if (addedCount > 0) {
      if (skippedSoldOut > 0) {
        toast.success(
          `Items from order #${orderNumber} added to cart. ${skippedSoldOut} item(s) are sold out and were skipped.`
        );
      } else {
        toast.success(`Items from order #${orderNumber} added to cart`);
      }
      navigate('/checkout');
    } else if (skippedSoldOut > 0) {
      toast.error('Those items are currently sold out');
    } else {
      toast.error('No items available to reorder');
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleReorder}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Reorder
    </Button>
  );
};
