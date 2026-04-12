import React from "react";
import ShopProductSections from "@/components/shop/ShopProductSections";
import { Product } from "@/types/product";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ProductsGridSkeleton } from "@/components/skeletons/ProductsGridSkeleton";

interface ProductsSectionProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ products, isLoading, error }) => {
  if (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load products. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <ProductsGridSkeleton />
      </div>
    );
  }

  return <ShopProductSections products={products} />;
};

export default ProductsSection;
