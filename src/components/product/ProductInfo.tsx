
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
    attributes?: {
      rodCount?: string[];
      size?: string[];
      [key: string]: any;
    };
  };
  quantity: number;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ProductInfo = ({ product, quantity, setQuantity, onAddToCart, onBuyNow }: ProductInfoProps) => {
  // Extract rod count for individual products
  const rodCount = product.attributes?.rodCount?.[0];
  const showRodCount = rodCount && product.category !== 'bundles';

  return (
    <div className="space-y-3 max-h-[1080px] max-w-[300px] overflow-y-auto">
      {/* Category Badge & Title Section */}
      <div className="space-y-2">
        <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </span>
        <h1 className="text-xl md:text-2xl font-bold leading-tight">{product.name}</h1>
        <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
      </div>
      
      {/* Description */}
      <div className="pb-3 border-b border-gray-200">
        {product.description && (
          <div 
            className="text-xs text-gray-700 leading-relaxed prose prose-sm max-w-none [&_strong]:font-bold [&_strong]:text-gray-900 [&_em]:italic [&_em]:text-gray-600 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_br]:block [&_br]:my-1"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
      </div>
      
      {/* Rod Count Display for Individual Products */}
      {showRodCount && (
        <div className="pb-3 border-b border-gray-200">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 rounded-lg">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">Rods</span>
              <span className="text-3xl font-thin">{rodCount}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Bundle Contents for bundles */}
      {product.category === 'bundles' && product.bundleContents && (
        <div className="space-y-2 pb-3 border-b border-gray-200">
          <BundleContentsList contents={product.bundleContents} variant="full" />
          
          {/* Sizing Information */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Box Dimensions
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="font-semibold text-xs text-gray-700">Large:</span>
                <span className="text-xs text-gray-600 font-mono">10" × 8" × 4"</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="font-semibold text-xs text-gray-700">Medium:</span>
                <span className="text-xs text-gray-600 font-mono">8" × 6" × 3"</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-xs text-gray-700">Small:</span>
                <span className="text-xs text-gray-600 font-mono">6" × 4" × 2.5"</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Features */}
      <div className="pb-3 border-b border-gray-200">
        <ProductFeatures features={product.features || []} />
      </div>
      
      {/* Quantity & Stock Section */}
      <div className="space-y-2">
        <QuantitySelector 
          quantity={quantity}
          setQuantity={setQuantity}
          maxQuantity={product.stock || 10}
        />
        
        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <p className="text-xs text-gray-600">
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
      <div className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Add to Cart Button */}
          <Button 
            variant="buy"
            size="sm"
            disabled={!product.stock}
            onClick={onAddToCart}
            className="w-full"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </Button>

          {/* Buy Now Button */}
          <Button 
            variant="buy"
            size="sm"
            disabled={!product.stock}
            onClick={onBuyNow}
            className="w-full"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Buy Now
          </Button>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-0.5">
              <div className="text-base">🚚</div>
              <p className="text-[10px] text-gray-600 font-medium">Free Shipping</p>
            </div>
            <div className="space-y-0.5">
              <div className="text-base">↩️</div>
              <p className="text-[10px] text-gray-600 font-medium">30-Day Returns</p>
            </div>
            <div className="space-y-0.5">
              <div className="text-base">🔒</div>
              <p className="text-[10px] text-gray-600 font-medium">Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
