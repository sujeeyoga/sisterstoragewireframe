
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import ProductFeatures from "./ProductFeatures";
import QuantitySelector from "./QuantitySelector";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    features?: string[];
    stock?: number;
  };
  quantity: number;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
}

const ProductInfo = ({ product, quantity, setQuantity, onAddToCart }: ProductInfoProps) => {
  return (
    <div>
      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full mb-2 text-xs">
        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
      </span>
      <h1 className="text-base font-bold mb-2">{product.name}</h1>
      <p className="text-xs font-semibold text-gray-800 mb-4">${product.price.toFixed(2)}</p>
      
      <p className="text-xs text-gray-700 mb-5">{product.description}</p>
      
      <ProductFeatures features={product.features || []} />
      
      <QuantitySelector 
        quantity={quantity}
        setQuantity={setQuantity}
        maxQuantity={product.stock || 10}
      />
      
      {/* Stock Status */}
      {product.stock !== undefined && (
        <p className="text-xs text-gray-600 mb-4">
          {product.stock > 5 
            ? `In stock (${product.stock} available)` 
            : product.stock > 0 
              ? `Low stock (only ${product.stock} left)` 
              : "Out of stock"}
        </p>
      )}
      
      {/* Add to Cart Button */}
      <Button 
        className="bg-purple-600 hover:bg-purple-500 text-white w-full py-4"
        disabled={!product.stock}
        onClick={onAddToCart}
      >
        <ShoppingBag className="mr-2 h-3 w-3" />
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductInfo;
