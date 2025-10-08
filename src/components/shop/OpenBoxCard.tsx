import React from "react";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Package, Sparkles, Clock } from "lucide-react";

interface OpenBoxCardProps {
  product: Product;
}

const OpenBoxCard = ({ product }: OpenBoxCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const savings = product.originalPrice && product.price
    ? ((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0)
    : "0";

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-2 border-[#ff6b35]/20">
      {/* Open Box Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-[#ff6b35] text-white border-none px-3 py-1 text-sm font-bold uppercase tracking-wider shadow-lg">
          <Package className="w-3 h-3 mr-1.5 inline-block" />
          OPEN BOX
        </Badge>
      </div>

      {/* Savings Badge */}
      {Number(savings) > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-green-600 text-white border-none px-3 py-1 text-sm font-bold shadow-lg">
            SAVE {savings}%
          </Badge>
        </div>
      )}

      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Area with Gradient Overlay */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}dd 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Stock Indicator */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#ff6b35]" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Only {product.stock} left
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          {/* Title Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-1 group-hover:text-[#ff6b35] transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">
              {product.description}
            </p>
          </div>

          {/* Short Description */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Features with Icons */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6b35]" />
              Why Open Box?
            </h4>
            <ul className="space-y-1.5">
              {product.features?.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[#ff6b35] mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Section */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#ff6b35]">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mt-0.5">
                  While supplies last
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-6 pb-6">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-bold uppercase tracking-wide py-6 text-base transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          GET THIS DEAL
        </Button>
      </div>
    </Card>
  );
};

export default OpenBoxCard;
