import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ShopHeaderProps {
  sort: string;
  onSortChange: (value: string) => void;
  productCount: number;
}

const ShopHeader = ({ sort, onSortChange, productCount }: ShopHeaderProps) => {
  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case "price-asc": return "lowest price first";
      case "price-desc": return "highest price first";
      case "relevance": return "newest";
      default: return "newest";
    }
  };

  return (
    <div className="flex items-center justify-end mb-8">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sort by</span>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto font-medium underline">
            <SelectValue>
              {getSortLabel(sort)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Newest first</SelectItem>
            <SelectItem value="price-asc">Lowest Price first</SelectItem>
            <SelectItem value="price-desc">Highest Price first</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopHeader;