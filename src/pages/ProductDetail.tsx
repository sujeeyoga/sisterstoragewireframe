
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useStoreDiscount } from "@/hooks/useStoreDiscount";
import { useInventorySettings } from "@/hooks/useInventorySettings";
import { useProduct, useProductsByCategory } from "@/hooks/useProducts";
import { useProductSEO } from "@/hooks/useProductSEO";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import RelatedProducts from "@/components/product/RelatedProducts";
import { ProductQA } from "@/components/product/ProductQA";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";

import { productTaxonomyMap } from "@/data/product-taxonomy";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { discount, applyDiscount } = useStoreDiscount();
  const { lowStock, preorders, isLowStock, isOutOfStock } = useInventorySettings();
  
  // Fetch product from Supabase (supports both ID and slug)
  const { data: product, isLoading } = useProduct(productId || "");
  const taxonomy = product ? productTaxonomyMap[product.id] : undefined;
  const attributes = taxonomy?.attributes;
  const primaryCategorySlug = taxonomy?.categorySlugs?.[0];
  const primaryCategory = product?.categories?.[0];
  
  // Fetch related products from the same category
  const { data: categoryProducts = [], isLoading: isLoadingRelated } = useProductsByCategory(primaryCategory || "");
  
  // SEO setup for product page
  useProductSEO(product, attributes);
  
  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-600">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Handle case where product isn't found
  if (!product) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-bold text-base">Product Not Found</h2>
            <p className="mt-2 text-xs text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <button className="mt-4 text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-md" onClick={() => window.history.back()}>Go Back</button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Get related products from same category (excluding current product)
  const relatedProducts = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  
  const discountedPrice = discount?.enabled ? applyDiscount(product.price) : product.price;
  const canAddToCart = true; // Always allow adding to cart

  const handleAddToCart = () => {
    if (!canAddToCart) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable",
        variant: "destructive",
      });
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.images?.[0] || product.color
    });
    
  toast({
    title: "Added to cart",
    description: `${quantity} × ${product.name} added to your cart`,
  });

  setIsOpen(true);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.images?.[0] || product.color
    });
    
    toast({
      title: "Processing purchase",
      description: `${quantity} × ${product.name} added to your cart`,
    });
    
    // Navigate to checkout
    navigate('/checkout');
  };

  return (
    <Layout>
      <div className="pb-10 pt-12">
        <div className="container-custom">
          <Breadcrumbs productName={product.name} primaryCategorySlug={primaryCategorySlug} />

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <ProductImage 
              images={product.images} 
              color={product.color} 
              name={product.name}
            />
            <ProductInfo 
              product={{ ...product, price: discountedPrice }}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
          
          {/* Attributes */}
          {attributes && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold mb-3">Product Attributes</h2>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const chips: JSX.Element[] = [];
                  const push = (label: string, vals?: unknown) => {
                    const arr = Array.isArray(vals) ? vals : vals ? [vals] : [];
                    arr.forEach((v, i) =>
                      chips.push(
                        <span key={`${label}-${String(v)}-${i}`} className="px-3 py-1 rounded-full text-xs border border-border bg-background text-foreground/80">
                          {label}: {String(v)}
                        </span>
                      )
                    );
                  };
                  push("Rod", attributes?.rodCount);
                  push("Size", attributes?.size);
                  push("Use", attributes?.useCase);
                  push("Bundle", attributes?.bundleSize);
                  return chips;
                })()}
              </div>
            </div>
          )}

          {/* Product Q&A */}
          <ProductQA 
            productName={product.name}
            productType={primaryCategory}
          />

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
