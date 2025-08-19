import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ShopHeaderProps {
  sort: string;
  onSortChange: (value: string) => void;
  productCount: number;
}

const ShopHeader = ({ sort, onSortChange, productCount }: ShopHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Shop</h1>
        <span className="text-muted-foreground">({productCount} products)</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopHeader;