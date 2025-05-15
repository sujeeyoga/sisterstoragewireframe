
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

// Sample blog posts
const blogPosts = [
  {
    id: "1",
    title: "5 Ways to Organize Your Bathroom Cabinets",
    excerpt: "Transform your bathroom storage with these simple yet effective organization tips that will maximize space and minimize clutter.",
    author: "Emma Wilson",
    date: "May 12, 2025",
    category: "Organization Tips",
    imageUrl: "https://images.unsplash.com/photo-1595408043711-455f9386b41b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "The Psychology of a Well-Organized Space",
    excerpt: "Discover how an organized home can lead to reduced stress and increased productivity in your daily life.",
    author: "Olivia Wilson",
    date: "May 5, 2025",
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Storage Solutions for Small Apartments",
    excerpt: "Living in a compact space doesn't mean sacrificing organization. Learn how to maximize every inch with these clever storage ideas.",
    author: "James Chen",
    date: "April 28, 2025",
    category: "Small Spaces",
    imageUrl: "https://images.unsplash.com/photo-1595427749888-496edd6e3981?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Sustainable Organization: Eco-Friendly Storage",
    excerpt: "Explore how to organize your home using sustainable materials and practices that are better for both your space and the planet.",
    author: "Sophia Rodriguez",
    date: "April 22, 2025",
    category: "Sustainability",
    imageUrl: "https://images.unsplash.com/photo-1556707752-481d500a2c58?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Seasonal Storage: Rotating Your Belongings",
    excerpt: "Learn the art of seasonal rotation to keep your home clutter-free throughout the year.",
    author: "Emma Wilson",
    date: "April 15, 2025",
    category: "Organization Tips",
    imageUrl: "https://images.unsplash.com/photo-1562714529-94d65989df68?q=80&w=800&auto=format&fit=crop"
  }
];

const categories = ["All", "Organization Tips", "Wellness", "Small Spaces", "Sustainability"];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-28 pb-16 bg-purple-50">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Organization & Inspiration</h1>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-10">
            Tips, strategies, and inspiration to help you create beautifully organized spaces that bring joy to your everyday life.
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
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
      
      {/* Blog Posts */}
      <div className="bg-white py-16">
        <div className="container-custom">
          {/* Featured Post */}
          {filteredPosts.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src={filteredPosts[0].imageUrl} 
                    alt={filteredPosts[0].title} 
                    className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {filteredPosts[0].category}
                  </span>
                  <h2 className="text-3xl font-bold">{filteredPosts[0].title}</h2>
                  <p className="text-gray-700">{filteredPosts[0].excerpt}</p>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-600">
                      By {filteredPosts[0].author} • {filteredPosts[0].date}
                    </div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-500 text-white mt-2">
                    Read Article
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Grid of Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <div key={post.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="overflow-hidden h-48">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      By {post.author} • {post.date}
                    </div>
                    <Button variant="secondary" size="sm">Read More</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="py-16 bg-purple-50">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Organization Tips Delivered</h2>
          <p className="text-gray-700 mb-6">
            Join our newsletter to receive monthly organization tips, exclusive offers, and early access to new products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded-md border border-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <Button className="bg-purple-600 hover:bg-purple-500 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
