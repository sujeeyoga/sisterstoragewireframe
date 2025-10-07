import React from "react";
import ShopProductSections from "@/components/shop/ShopProductSections";
import { Product } from "@/types/product";

interface ProductsSectionProps {
  products: Product[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ products }) => {
  return (
    <section className="products-section">
      <ShopProductSections products={products} />
    </section>
  );
};

export default ProductsSection;
