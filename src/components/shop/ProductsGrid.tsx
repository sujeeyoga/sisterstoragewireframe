
import React from "react";
import { Product } from "./ProductCard";
import ProductCard from "./ProductCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";

interface ProductsGridProps {
  products: Product[];
}

const ProductsGrid = ({ products }: ProductsGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard key={product.id} product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
