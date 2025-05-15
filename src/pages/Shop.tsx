
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Enhanced product data
const products = [
  {
    id: "1",
    name: "Velvet Bangle Organizer",
    description: "Preserve your bangles with care in our soft-touch velvet box. Perfect for storing and displaying your precious collection.",
    price: 29.99,
    category: "bangles",
    color: "#e90064", // Updated from purple to new primary color
    features: ["Soft velvet interior", "10 compartments", "Stackable design"],
    material: "Premium velvet",
    bestSeller: true,
    stock: 8
  },
  {
    id: "2",
    name: "Glass Lid Jewelry Box",
    description: "Showcase and protect your collection with style and intention. The glass lid allows you to easily see your pieces.",
    price: 42.99,
    category: "jewelry",
    color: "#c80056", // Darker shade of primary color
    features: ["Glass display lid", "Anti-tarnish lining", "Secure closure"],
    material: "Sustainable wood with glass",
    newArrival: true,
    stock: 15
  },
  {
    id: "3",
    name: "Cultural Keepsake Box",
    description: "Specially designed box that honors and preserves cultural artifacts and keepsakes with compartments for various sized items.",
    price: 64.99,
    category: "keepsakes",
    color: "#a60048", // Even darker shade of primary color
    features: ["Hand-carved details", "Acid-free lining", "Custom compartments"],
    material: "Ethically sourced hardwood",
    limitedEdition: true,
    stock: 5
  },
  {
    id: "4",
    name: "Stackable Bangle Trays",
    description: "Versatile stackable trays that beautifully organize your bangles with a clean, minimal aesthetic. Perfect for dresser tops.",
    price: 24.99,
    category: "bangles",
    color: "#ff4d8d", // Lighter shade of primary color
    features: ["Modular design", "Felt lining", "Space-efficient"],
    material: "Recycled materials",
    stock: 20
  },
  {
    id: "5",
    name: "Ring Display Tower",
    description: "Elegant tower designed to showcase your ring collection while keeping each piece separate and protected from scratches.",
    price: 24.99,
    category: "jewelry",
    color: "#e90064", // Primary color
    features: ["Holds up to 12 rings", "Rotating base", "Compact design"],
    material: "Metal with velvet coating",
    stock: 12
  },
  {
    id: "6",
    name: "Memory Collection Case",
    description: "Elegant case with compartments designed to organize and protect your precious memories, from small keepsakes to photographs.",
    price: 49.99,
    category: "keepsakes",
    color: "#c80056", // Darker shade of primary color
    features: ["Archival quality", "Photo slots", "Custom dividers"],
    material: "Acid-free fabric and board",
    bestSeller: true,
    stock: 7
  }
];

const categories = ["all", "bangles", "jewelry", "keepsakes"];

// Benefits data for the benefits section
const benefits = [
  {
    title: "Thoughtful Design",
    description: "Every piece is designed with intention, considering the unique needs of cultural items."
  },
  {
    title: "Quality Materials",
    description: "We use premium, sustainable materials that protect your treasured possessions."
  },
  {
    title: "Cultural Significance",
    description: "Our products honor and celebrate cultural heritage through mindful storage solutions."
  }
];

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
      image: product.color
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <Layout>
      {/* Enhanced Hero Section - Replace gradient with solid color */}
      <div className="relative pb-10 bg-pink-50">
        <div className="container-custom pt-10">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="font-bold text-3xl mb-4">Storage with Soul</h1>
            <p className="text-gray-700 text-center mx-auto mb-6">
              Discover storage that's designed for your bangles, jewelry, and keepsakes — made with the details that matter most to your cultural heritage.
            </p>
            <p className="text-sm text-pink-700 mb-6">
              Handcrafted with love, designed with intention.
            </p>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full capitalize transition-all ${
                  selectedCategory === category
                    ? "bg-[#e90064] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-pink-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <Link to={`/shop/${product.id}`} className="block">
                  <div className="relative">
                    <div 
                      className="aspect-square transition-transform duration-300 group-hover:scale-105 flex items-center justify-center"
                      style={{ backgroundColor: product.color }}
                    >
                      <span className="text-white font-bold">Sister Storage</span>
                    </div>
                    
                    {/* Product badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.bestSeller && (
                        <Badge className="bg-amber-500 text-white">Best Seller</Badge>
                      )}
                      {product.newArrival && (
                        <Badge className="bg-green-500 text-white">New Arrival</Badge>
                      )}
                      {product.limitedEdition && (
                        <Badge className="bg-red-500 text-white">Limited Edition</Badge>
                      )}
                      {product.stock <= 5 && (
                        <Badge className="bg-gray-700 text-white">Only {product.stock} left</Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="pt-4">
                    <div className="mb-1 flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    
                    {/* Material tag */}
                    <div className="mb-2 text-xs text-gray-500">
                      {product.material}
                    </div>
                    
                    {/* Feature list */}
                    <ul className="mb-3">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                          <Check className="h-3 w-3 text-pink-600" /> {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-medium bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
          
          {/* Benefits Section */}
          <div className="mt-16 bg-pink-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Why Sister Storage?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <p className="italic mb-4 text-gray-700">"I've been looking for storage options that honor my cultural pieces for years. Sister Storage not only protects my items but celebrates them with thoughtful design."</p>
            <p className="font-semibold">- Priya S., Loyal Customer</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
