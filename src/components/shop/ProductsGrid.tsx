
import React from "react";
import { Product } from "@/types/product";
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
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <SingleProductCard 
          key={product.id} 
          product={product}
          priority={index < 8}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
