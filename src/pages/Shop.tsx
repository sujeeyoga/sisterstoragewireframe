import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";

// Sample product data
const products = [
  {
    id: "1",
    name: "Velvet Bangle Organizer",
    description: "Preserve your bangles with care in our soft-touch velvet box.",
    price: 29.99,
    category: "bangles",
    color: "#9b87f5" // Primary Purple
  },
  {
    id: "2",
    name: "Glass Lid Jewelry Box",
    description: "Showcase and protect your collection with style and intention.",
    price: 42.99,
    category: "jewelry",
    color: "#7E69AB" // Secondary Purple
  },
  {
    id: "3",
    name: "Cultural Keepsake Box",
    description: "Specially designed box that honors and preserves cultural artifacts and keepsakes.",
    price: 64.99,
    category: "keepsakes",
    color: "#6E59A5" // Tertiary Purple
  },
  {
    id: "4",
    name: "Stackable Bangle Trays",
    description: "Versatile stackable trays that beautifully organize your bangles with a clean, minimal aesthetic.",
    price: 24.99,
    category: "bangles",
    color: "#D6BCFA" // Light Purple
  },
  {
    id: "5",
    name: "Ring Display Tower",
    description: "Elegant tower designed to showcase your ring collection while keeping each piece separate and protected.",
    price: 24.99,
    category: "jewelry",
    color: "#9b87f5" // Primary Purple
  },
  {
    id: "6",
    name: "Memory Collection Case",
    description: "Elegant case with compartments designed to organize and protect your precious memories.",
    price: 49.99,
    category: "keepsakes",
    color: "#7E69AB" // Secondary Purple
  }
];

const categories = ["all", "bangles", "jewelry", "keepsakes"];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: typeof products[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.color // Now using color as the image identifier
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pb-8 bg-purple-50">
        <div className="container-custom pt-6">
          <h1 className="font-bold text-center mb-4">BUY</h1>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-8">
            Discover storage that's designed for your bangles, jewelry, and keepsakes — made with the details that matter most.
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full capitalize transition-all ${
                  selectedCategory === category
                    ? "bg-[#E6007E] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-purple-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="bg-white py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link to={`/shop/${product.id}`} className="block">
                  <div className="rounded-lg mb-3 aspect-square transition-transform duration-300 group-hover:scale-105 flex items-center justify-center"
                       style={{ backgroundColor: product.color }}>
                    <span className="text-white font-bold">Sister Storage</span>
                  </div>
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    <Button 
                      size="sm" 
                      className="bg-[#E6007E] hover:bg-black"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
