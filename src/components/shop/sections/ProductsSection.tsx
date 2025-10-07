import React from "react";
import ShopProductSections from "@/components/shop/ShopProductSections";
import Section from "@/components/layout/Section";
import { Product } from "@/types/product";

interface ProductsSectionProps {
  products: Product[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ products }) => {
  return (
    <Section spacing="lg" width="full" as="div">
      <ShopProductSections products={products} />
    </Section>
  );
};

export default ProductsSection;
