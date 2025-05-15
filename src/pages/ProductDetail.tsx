
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import RelatedProducts from "@/components/product/RelatedProducts";

// Sample product data (would typically come from an API)
const products = [
  {
    id: "1",
    name: "Bamboo Storage Box",
    description: "Elegant bamboo storage box with lid for bathroom essentials. This beautifully crafted box features a smooth finish and minimalist design, perfect for storing cotton swabs, bath salts, or other small items. The natural bamboo material adds warmth to your space while being eco-friendly and durable.",
    price: 35.99,
    category: "bathroom",
    color: "#9b87f5", // Primary Purple
    features: [
      "Made from sustainable bamboo",
      "Water-resistant finish",
      "Removable dividers",
      "Compact size: 8\" x 6\" x 4\""
    ],
    stock: 12,
    relatedProducts: ["2", "3", "4"]
  },
  {
    id: "2",
    name: "Fabric Closet Organizer",
    description: "Soft fabric organizer for clothes and accessories.",
    price: 29.99,
    category: "closet",
    color: "#7E69AB" // Secondary Purple
  },
  {
    id: "3",
    name: "Kitchen Drawer Dividers",
    description: "Expandable bamboo dividers for kitchen utensils.",
    price: 24.99,
    category: "kitchen",
    color: "#6E59A5" // Tertiary Purple
  },
  {
    id: "4",
    name: "Decorative Wicker Basket",
    description: "Handwoven wicker basket for stylish storage.",
    price: 42.99,
    category: "living",
    color: "#D6BCFA" // Light Purple
  }
];

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Find the product based on the URL parameter
  const product = products.find(p => p.id === productId);
  
  // Handle case where product isn't found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-bold text-base">Product Not Found</h2>
            <p className="mt-2 text-xs text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <button className="mt-4 text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-md" onClick={() => window.history.back()}>Go Back</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Get related products
  const relatedProducts = product.relatedProducts 
    ? products.filter(p => product.relatedProducts?.includes(p.id))
    : [];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.color // Now we're using the color instead of image
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-10 flex-grow">
        <div className="container-custom">
          <Breadcrumbs productName={product.name} />
          
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <ProductImage color={product.color} />
            <ProductInfo 
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
            />
          </div>
          
          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
