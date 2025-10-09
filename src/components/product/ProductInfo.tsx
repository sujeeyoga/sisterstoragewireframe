
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
    <div className="space-y-6">
      {/* Category Badge & Title Section */}
      <div className="space-y-3">
        <span className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
        <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
      </div>
      
      {/* Description */}
      <div className="pb-6 border-b border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
      </div>
      
      {/* Bundle Contents for bundles */}
      {product.category === 'bundles' && product.bundleContents && (
        <div className="space-y-4 pb-6 border-b border-gray-200">
          <BundleContentsList contents={product.bundleContents} variant="full" />
          
          {/* Sizing Information */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Box Dimensions
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-700">Large Box:</span>
                <span className="text-sm text-gray-600 font-mono">10" × 8" × 4"</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-700">Medium Box:</span>
                <span className="text-sm text-gray-600 font-mono">8" × 6" × 3"</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-sm text-gray-700">Small Box:</span>
                <span className="text-sm text-gray-600 font-mono">6" × 4" × 2.5"</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
              💎 Perfect for organizing bangles, bracelets, and jewelry of all sizes
            </p>
          </div>
        </div>
      )}
      
      {/* Features */}
      <div className="pb-6 border-b border-gray-200">
        <ProductFeatures features={product.features || []} />
      </div>
      
      {/* Quantity & Stock Section */}
      <div className="space-y-4">
        <QuantitySelector 
          quantity={quantity}
          setQuantity={setQuantity}
          maxQuantity={product.stock || 10}
        />
        
        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <p className="text-sm text-gray-600">
              {product.stock > 5 
                ? `In stock (${product.stock} available)` 
                : product.stock > 0 
                  ? `Low stock (only ${product.stock} left)` 
                  : "Out of stock"}
            </p>
          </div>
        )}
      </div>
      
      {/* Buttons Container */}
      <div className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Add to Cart Button */}
          <Button 
            variant="buy"
            size="buy"
            disabled={!product.stock}
            onClick={onAddToCart}
            className="w-full"
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
            className="w-full"
          >
            <CreditCard className="h-4 w-4" />
            Buy Now
          </Button>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xl">🚚</div>
              <p className="text-xs text-gray-600 font-medium">Free Shipping</p>
            </div>
            <div className="space-y-1">
              <div className="text-xl">↩️</div>
              <p className="text-xs text-gray-600 font-medium">30-Day Returns</p>
            </div>
            <div className="space-y-1">
              <div className="text-xl">🔒</div>
              <p className="text-xs text-gray-600 font-medium">Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
