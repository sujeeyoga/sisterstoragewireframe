
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

// Sample product data (would typically come from an API)
const products = [
  {
    id: "1",
    name: "Bamboo Storage Box",
    description: "Elegant bamboo storage box with lid for bathroom essentials. This beautifully crafted box features a smooth finish and minimalist design, perfect for storing cotton swabs, bath salts, or other small items. The natural bamboo material adds warmth to your space while being eco-friendly and durable.",
    price: 35.99,
    category: "bathroom",
    imageUrl: "https://images.unsplash.com/photo-1595408043711-455f9386b41b?q=80&w=600&auto=format&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1562714529-94d65989df68?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "Kitchen Drawer Dividers",
    description: "Expandable bamboo dividers for kitchen utensils.",
    price: 24.99,
    category: "kitchen",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "4",
    name: "Decorative Wicker Basket",
    description: "Handwoven wicker basket for stylish storage.",
    price: 42.99,
    category: "living",
    imageUrl: "https://images.unsplash.com/photo-1595427749888-496edd6e3981?q=80&w=600&auto=format&fit=crop"
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
            <h2 className="text-2xl font-bold">Product Not Found</h2>
            <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
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
      image: product.imageUrl
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-28 pb-16 flex-grow">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="text-sm mb-8">
            <a href="/" className="text-gray-500 hover:text-purple-600">Home</a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/shop" className="text-gray-500 hover:text-purple-600">Shop</a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">{product.name}</span>
          </div>
          
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-gray-800 mb-6">${product.price.toFixed(2)}</p>
              
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              {/* Features */}
              {product.features && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-600 mr-2 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Quantity:</h3>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l"
                  >
                    -
                  </button>
                  <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(Math.min((product.stock || 10), quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Stock Status */}
              {product.stock && (
                <p className="text-sm text-gray-600 mb-6">
                  {product.stock > 5 
                    ? `In stock (${product.stock} available)` 
                    : product.stock > 0 
                      ? `Low stock (only ${product.stock} left)` 
                      : "Out of stock"}
                </p>
              )}
              
              {/* Add to Cart Button */}
              <Button 
                className="bg-purple-600 hover:bg-purple-500 text-white w-full py-6 text-base"
                disabled={!product.stock}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <div key={related.id} className="group">
                    <a href={`/shop/${related.id}`} className="block">
                      <div className="overflow-hidden rounded-lg bg-gray-100 mb-3 aspect-square">
                        <img
                          src={related.imageUrl}
                          alt={related.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-medium">{related.name}</h3>
                      <p className="text-gray-800 font-semibold mt-1">${related.price.toFixed(2)}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
