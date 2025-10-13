import React from "react";
import ShopProductSections from "@/components/shop/ShopProductSections";
import Section from "@/components/layout/Section";
import { Product } from "@/types/product";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProductsSectionProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ products, isLoading, error }) => {
  if (error) {
    return (
      <Section spacing="lg" width="full" as="div">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load products. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </Section>
    );
  }

  if (isLoading) {
    return (
      <Section spacing="lg" width="full" as="div">
        <div className="text-center py-16 text-muted-foreground">
          Loading products...
        </div>
      </Section>
    );
  }

  return (
    <Section spacing="lg" width="full" as="div">
      <ShopProductSections products={products} />
    </Section>
  );
};

export default ProductsSection;
