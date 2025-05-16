
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
    <div className="masonry-grid columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
      {products.map((product) => (
        <div key={product.id} className="masonry-item break-inside-avoid mb-4">
          <ProductCard key={product.id} product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
