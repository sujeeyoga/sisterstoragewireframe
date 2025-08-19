import ShopFilters from "@/components/shop/ShopFilters";
import { Filters } from "@/hooks/useShopFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShopSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const ShopSidebar = ({ filters, onFiltersChange }: ShopSidebarProps) => {
  return (
    <aside className="w-64 flex-shrink-0">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <ShopFilters filters={filters} onChange={onFiltersChange} />
        </CardContent>
      </Card>
    </aside>
  );
};

export default ShopSidebar;