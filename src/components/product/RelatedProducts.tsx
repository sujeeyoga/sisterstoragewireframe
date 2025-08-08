
import React from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  color: string;
}

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
              <div 
                className="rounded-lg flex items-center justify-center aspect-square mb-2 transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: product.color || "#9b87f5" }}
              >
                <span className="text-white text-xs font-bold">Sister Storage</span>
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
