import { Filters } from "@/hooks/useShopFilters";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface FilterGroup {
  title: string;
  key: keyof Filters;
  options: { value: string; label: string; count?: number }[];
}

const filterGroups: FilterGroup[] = [
  {
    title: "CATEGORIES",
    key: "category" as keyof Filters,
    options: [
      { value: "bangle-boxes", label: "BANGLE BOXES", count: 2 },
      { value: "travel", label: "TRAVEL", count: 4 },
      { value: "medium", label: "MEDIUM", count: 2 },
      { value: "large", label: "LARGE", count: 1 },
      { value: "bundles", label: "BUNDLES" },
      { value: "organizers", label: "ORGANIZERS" }
    ]
  }
];

const sizeOptions = [
  { value: "travel", label: "TRAVEL" },
  { value: "medium", label: "MEDIUM" },
  { value: "large", label: "LARGE" }
];

const useCaseOptions = [
  { value: "travel", label: "TRAVEL" },
  { value: "home", label: "HOME" },
  { value: "bridal", label: "BRIDAL" },
  { value: "props", label: "PROPS" }
];

const rodCountOptions = [
  { value: "1", label: "1 ROD" },
  { value: "2", label: "2 RODS" },
  { value: "4", label: "4 RODS" }
];

interface ShopSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const ShopSidebar = ({ filters, onFiltersChange }: ShopSidebarProps) => {
  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === value ? undefined : value
    });
  };

  const handleMultiSelectChange = (key: keyof Filters, value: string) => {
    const currentValues = filters[key] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [key]: newValues
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: undefined,
      rodCount: [],
      size: [],
      useCase: [],
      bundleSize: []
    });
  };

  return (
    <aside className="w-72 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">FILTERS</h3>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">CATEGORIES</h4>
            <div className="space-y-2">
              {filterGroups[0].options.map((option) => (
                <div key={option.value} className="flex items-center justify-between">
                  <Button
                    variant={filters.category === option.value ? "default" : "ghost"}
                    size="sm"
                    className="justify-start h-8 w-full text-xs"
                    onClick={() => handleCategoryChange(option.value)}
                  >
                    {option.label}
                  </Button>
                  {option.count && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {option.count}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Rod Count */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">ROD COUNT</h4>
            <div className="space-y-2">
              {rodCountOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.rodCount.includes(option.value) ? "default" : "ghost"}
                  size="sm"
                  className="justify-start h-8 w-full text-xs"
                  onClick={() => handleMultiSelectChange("rodCount", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Size */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">SIZE</h4>
            <div className="space-y-2">
              {sizeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.size.includes(option.value) ? "default" : "ghost"}
                  size="sm"
                  className="justify-start h-8 w-full text-xs"
                  onClick={() => handleMultiSelectChange("size", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Use Case */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">USE CASE</h4>
            <div className="space-y-2">
              {useCaseOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.useCase.includes(option.value) ? "default" : "ghost"}
                  size="sm"
                  className="justify-start h-8 w-full text-xs"
                  onClick={() => handleMultiSelectChange("useCase", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ShopSidebar;