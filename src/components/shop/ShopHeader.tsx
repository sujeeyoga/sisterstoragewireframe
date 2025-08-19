import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ShopHeaderProps {
  sort: string;
  onSortChange: (value: string) => void;
  productCount: number;
}

const ShopHeader = ({ sort, onSortChange, productCount }: ShopHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SHOP</h1>
        <p className="text-gray-500 text-sm">({productCount} products)</p>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">RELEVANCE</SelectItem>
            <SelectItem value="price-asc">PRICE: LOW TO HIGH</SelectItem>
            <SelectItem value="price-desc">PRICE: HIGH TO LOW</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopHeader;