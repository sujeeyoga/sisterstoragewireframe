
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (!products || products.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-base font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <div key={product.id} className="group">
            <Link to={`/shop/${product.id}`} className="block">
              <div className="rounded-lg overflow-hidden aspect-square mb-2 bg-gray-100">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: product.color || "#9b87f5" }}
                  >
                    <span className="text-white text-xs font-bold">Sister Storage</span>
                  </div>
                )}
              </div>
              <h3 className="text-xs font-medium">{product.name}</h3>
              <p className="text-xs text-gray-800 font-semibold mt-1">${product.price.toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
