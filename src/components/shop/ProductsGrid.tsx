
import React from "react";
import { Product } from "./ProductCard";
import SingleProductCard from "./SingleProductCard";

interface ProductsGridProps {
  products: Product[];
}

const ProductsGrid = ({ products }: ProductsGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <SingleProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
