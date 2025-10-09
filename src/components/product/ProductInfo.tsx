
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard } from "lucide-react";
import ProductFeatures from "./ProductFeatures";
import QuantitySelector from "./QuantitySelector";
import BundleContentsList from "./BundleContentsList";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    features?: string[];
    stock?: number;
    bundleContents?: string;
  };
  quantity: number;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ProductInfo = ({ product, quantity, setQuantity, onAddToCart, onBuyNow }: ProductInfoProps) => {
  return (
    <div>
      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full mb-2 text-xs">
        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
      </span>
      <h1 className="text-base font-bold mb-2">{product.name}</h1>
      <p className="text-xs font-semibold text-gray-800 mb-4">${product.price.toFixed(2)}</p>
      
      <p className="text-xs text-gray-700 mb-5">{product.description}</p>
      
      {/* Bundle Contents for bundles */}
      {product.category === 'bundles' && product.bundleContents && (
        <>
          <BundleContentsList contents={product.bundleContents} variant="full" />
          
          {/* Sizing Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Box Dimensions</h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Large Box:</span>
                <span>10" L × 8" W × 4" H</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Medium Box:</span>
                <span>8" L × 6" W × 3" H</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Small Box:</span>
                <span>6" L × 4" W × 2.5" H</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              Perfect for organizing bangles, bracelets, and jewelry of all sizes
            </p>
          </div>
        </>
      )}
      
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
      
      {/* Buttons Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 justify-items-start">
        {/* Add to Cart Button */}
        <Button 
          variant="buy"
          size="buy"
          disabled={!product.stock}
          onClick={onAddToCart}
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>

        {/* Buy Now Button */}
        <Button 
          variant="buy"
          size="buy"
          disabled={!product.stock}
          onClick={onBuyNow}
        >
          <CreditCard className="h-4 w-4" />
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
