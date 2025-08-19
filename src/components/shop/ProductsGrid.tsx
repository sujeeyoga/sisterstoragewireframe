
import React from "react";
import { Product } from "./ProductCard";
import DualProductCard from "./DualProductCard";

interface ProductsGridProps {
  products: Product[];
}

const ProductsGrid = ({ products }: ProductsGridProps) => {
  // Group products into pairs
  const productPairs: [Product, Product?][] = [];
  for (let i = 0; i < products.length; i += 2) {
    const pair: [Product, Product?] = [products[i], products[i + 1]];
    productPairs.push(pair);
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {productPairs.map((pair, index) => (
        <DualProductCard key={`${pair[0].id}-${pair[1]?.id || 'single'}`} products={pair} />
      ))}
    </div>
  );
};

export default ProductsGrid;
