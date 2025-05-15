
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

// Sample product data
const products = [
  {
    id: "1",
    name: "Bamboo Storage Box",
    description: "Elegant bamboo storage box with lid for bathroom essentials.",
    price: 35.99,
    category: "bathroom",
    imageUrl: "https://images.unsplash.com/photo-1595408043711-455f9386b41b?q=80&w=600&auto=format&fit=crop"
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
  },
  {
    id: "5",
    name: "Desk Organizer Set",
    description: "Complete desk organization solution with multiple compartments.",
    price: 49.99,
    category: "office",
    imageUrl: "https://images.unsplash.com/photo-1556707752-481d500a2c58?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "6",
    name: "Jewelry Storage Box",
    description: "Multi-layer jewelry organizer with mirror.",
    price: 58.99,
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1562714529-94d65989df68?q=80&w=600&auto=format&fit=crop"
  }
];

const categories = ["all", "bathroom", "kitchen", "living", "office", "closet", "accessories"];

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
      image: product.imageUrl
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-12 bg-purple-50">
        <div className="container-custom pt-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Shop Our Collection</h1>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-10">
            Browse our curated selection of beautifully designed storage solutions that bring both function and style to your space.
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
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
      <div className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link to={`/shop/${product.id}`} className="block">
                  <div className="overflow-hidden rounded-lg bg-gray-100 mb-4 aspect-square">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-500"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Shop;
