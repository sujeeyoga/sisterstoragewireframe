import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";

// Expanded blog posts with additional brand colors
const blogPosts = [
  {
    id: "1",
    title: "5 Ways to Organize Your Bathroom Cabinets",
    excerpt: "Transform your bathroom storage with these simple yet effective organization tips that will maximize space and minimize clutter.",
    author: "Emma Wilson",
    date: "May 12, 2025",
    category: "Organization Tips",
    color: "#E90064", // Primary Pink for Organization Tips
    readingTime: "5 min",
    difficulty: "Beginner"
  },
  {
    id: "2",
    title: "The Psychology of a Well-Organized Space",
    excerpt: "Discover how an organized home can lead to reduced stress and increased productivity in your daily life.",
    author: "Olivia Wilson",
    date: "May 5, 2025",
    category: "Wellness",
    color: "#9b87f5", // Purple for Wellness
    readingTime: "8 min",
    difficulty: "Intermediate"
  },
  {
    id: "3",
    title: "Storage Solutions for Small Apartments",
    excerpt: "Living in a compact space doesn't mean sacrificing organization. Learn how to maximize every inch with these clever storage ideas.",
    author: "James Chen",
    date: "April 28, 2025",
    category: "Small Spaces",
    color: "#E6007E", // Secondary Pink for Small Spaces
    readingTime: "6 min",
    difficulty: "Intermediate"
  },
  {
    id: "4",
    title: "Sustainable Organization: Eco-Friendly Storage",
    excerpt: "Explore how to organize your home using sustainable materials and practices that are better for both your space and the planet.",
    author: "Sophia Rodriguez",
    date: "April 22, 2025",
    category: "Sustainability",
    color: "#7E69AB", // Secondary Purple for Sustainability
    readingTime: "7 min",
    difficulty: "Advanced"
  },
  {
    id: "5",
    title: "Seasonal Storage: Rotating Your Belongings",
    excerpt: "Learn the art of seasonal rotation to keep your home clutter-free throughout the year.",
    author: "Emma Wilson",
    date: "April 15, 2025",
    category: "Organization Tips",
    color: "#E90064", // Primary Pink for Organization Tips
    readingTime: "4 min",
    difficulty: "Beginner"
  },
  // New blog posts with more brand colors
  {
    id: "6",
    title: "Smart Pantry Organization Systems",
    excerpt: "Revolutionize your kitchen storage with these smart pantry systems that make finding ingredients a breeze.",
    author: "Michael Torres",
    date: "May 18, 2025",
    category: "Kitchen & Pantry",
    color: "#F97316", // Bright Orange for Kitchen & Pantry
    readingTime: "6 min",
    difficulty: "Intermediate",
    featured: true
  },
  {
    id: "7",
    title: "Under-Bed Storage Hacks for Small Bedrooms",
    excerpt: "Make the most of every inch in your bedroom with these clever under-bed storage solutions that hide clutter and maximize space.",
    author: "Anna Johnson",
    date: "May 16, 2025",
    category: "Bedroom Storage",
    color: "#33C3F0", // Sky Blue for Bedroom Storage
    readingTime: "5 min",
    difficulty: "Beginner",
    trending: true
  },
  {
    id: "8",
    title: "Kid-Friendly Organization Systems That Last",
    excerpt: "Design storage solutions that grow with your children and teach them valuable organization skills at the same time.",
    author: "Priya Patel",
    date: "May 11, 2025",
    category: "Kids' Rooms",
    color: "#D946EF", // Magenta Pink for Kids' Rooms
    readingTime: "9 min",
    difficulty: "Advanced",
    editorsPick: true
  },
  {
    id: "9",
    title: "Creating a Minimalist Home Office",
    excerpt: "Design a clutter-free workspace that enhances productivity and mental clarity with these minimalist organization principles.",
    author: "Robert Chen",
    date: "May 9, 2025",
    category: "Office Organization",
    color: "#0EA5E9", // Ocean Blue for Office Organization
    readingTime: "7 min",
    difficulty: "Intermediate",
    mostShared: true
  },
  {
    id: "10",
    title: "Packing Cubes: The Ultimate Travel Organization",
    excerpt: "Transform your travel experience with packing cubes that keep clothes organized and maximize suitcase space.",
    author: "Sophia Rodriguez",
    date: "May 7, 2025",
    category: "Travel & Packing",
    color: "#8B5CF6", // Vivid Purple for Travel & Packing
    readingTime: "4 min",
    difficulty: "Beginner"
  },
  {
    id: "11",
    title: "Holiday Decoration Storage Solutions",
    excerpt: "Protect and organize your seasonal decorations with these smart storage ideas that make decorating easier every year.",
    author: "Emma Wilson",
    date: "May 3, 2025",
    category: "Seasonal Decor",
    color: "#ea384c", // Red for Seasonal Decor
    readingTime: "6 min",
    difficulty: "Intermediate",
    trending: true
  },
  {
    id: "12",
    title: "Creating a Color-Coded Closet System",
    excerpt: "Transform your closet into a visually pleasing and functional space with this step-by-step color-coding guide.",
    author: "James Chen",
    date: "April 30, 2025",
    category: "Organization Tips",
    color: "#E90064", // Primary Pink for Organization Tips
    readingTime: "8 min",
    difficulty: "Advanced"
  }
];

// New themed collections with brand colors
const collections = [
  {
    id: "bangle-archives",
    title: "Bangle Archives",
    description: "The stories behind the sets we'll never throw out.",
    color: "#FF8021", // brandOrange
    slug: "bangle-archives"
  },
  {
    id: "velvet-drawer",
    title: "Velvet Drawer Diaries",
    description: "Inside the rituals and routines that bring us calm.",
    color: "#FE5FA4", // brandLightPink
    slug: "velvet-drawer-diaries"
  },
  {
    id: "brown-girl-hacks",
    title: "Brown Girl Hacks",
    description: "South Asian organizing, done our way.",
    color: "#FFDCBD", // brandPeach
    slug: "brown-girl-hacks"
  },
  {
    id: "stacked-styled",
    title: "Stacked & Styled",
    description: "How to wear, layer, and show off your bangle game.",
    color: "#FFA51E", // brandGold
    slug: "stacked-styled"
  },
  {
    id: "ammas-shelf",
    title: "From Amma's Shelf",
    description: "Lessons, memories, and passed-down wisdom.",
    color: "#FF8021", // brandOrange
    slug: "ammas-shelf"
  },
  {
    id: "gifts",
    title: "Gifts That Hit",
    description: "What to give when you actually care.",
    color: "#E90064", // brandPink
    slug: "gifts-that-hit"
  },
  {
    id: "clutter-left",
    title: "Clutter We Left Behind",
    description: "What we stopped holding onto — and why.",
    color: "#F4F4F4", // brandGray
    slug: "clutter-left-behind",
    textDark: true // Flag to use dark text on light background
  },
  {
    id: "home-drawer",
    title: "Home Is a Drawer",
    description: "What "home" means when you're always making one.",
    color: "#FFDCBD", // brandPeach
    slug: "home-is-a-drawer",
    textDark: true // Flag to use dark text on light background
  },
  {
    id: "signal-boost",
    title: "Sister Signal Boost",
    description: "Spotlighting sisters doing beautiful things.",
    color: "#FFA51E", // brandGold
    slug: "sister-signal-boost"
  },
  {
    id: "made-look",
    title: "Made You Look",
    description: "Behind the designs, materials, and tiny details we obsessed over.",
    color: "#FE5FA4", // brandLightPink
    slug: "made-you-look"
  }
];

const categories = [
  "All", 
  "Organization Tips", 
  "Wellness", 
  "Small Spaces", 
  "Sustainability",
  "Kitchen & Pantry",
  "Bedroom Storage",
  "Kids' Rooms",
  "Office Organization",
  "Travel & Packing",
  "Seasonal Decor",
  "Collections" // Added new category for collections
];

// Add collection names to categories
collections.forEach(collection => {
  if (!categories.includes(collection.title)) {
    categories.push(collection.title);
  }
});

// Difficulty level colors
const difficultyColors = {
  "Beginner": "#22c55e", // Green
  "Intermediate": "#f59e0b", // Amber
  "Advanced": "#ef4444" // Red
};

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCollections, setShowAllCollections] = useState(false);
  
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);
  const trendingPosts = blogPosts.filter(post => post.trending);
  const editorsPickPosts = blogPosts.filter(post => post.editorsPick);
  const mostSharedPosts = blogPosts.filter(post => post.mostShared);
  
  // Determine which collections to display
  const displayedCollections = showAllCollections ? collections : collections.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pb-16 bg-[#F4F4F4]">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Organization & Inspiration</h1>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-10">
            Tips, strategies, and inspiration to help you create beautifully organized spaces that bring joy to your everyday life.
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.filter(cat => cat !== "Collections" && !collections.map(c => c.title).includes(cat)).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-[#E90064] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-[#FE5FA4] hover:text-white hover:border-[#FE5FA4]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-3">Sister Collections</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Explore our culturally inspired collections, featuring stories and organization tips that celebrate our heritage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
            {displayedCollections.map((collection) => (
              <div 
                key={collection.id}
                className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] cursor-pointer"
                onClick={() => setSelectedCategory(collection.title)}
              >
                <div 
                  style={{ backgroundColor: collection.color }} 
                  className="p-8 flex flex-col justify-between h-48"
                >
                  <h3 className={`text-xl font-bold ${collection.textDark ? "text-gray-800" : "text-white"}`}>
                    {collection.title}
                  </h3>
                  <p className={`text-sm mt-2 ${collection.textDark ? "text-gray-700" : "text-white"}`}>
                    {collection.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {collections.length > 6 && (
            <div className="text-center">
              <Button 
                onClick={() => setShowAllCollections(!showAllCollections)}
                variant="secondary"
                className="inline-flex items-center gap-2"
              >
                {showAllCollections ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show All Collections <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Featured Collection Story */}
      {selectedCategory !== "All" && collections.find(c => c.title === selectedCategory) && (
        <div className="bg-[#F4F4F4] py-12">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                {(() => {
                  const collection = collections.find(c => c.title === selectedCategory);
                  return collection ? (
                    <div className="rounded-lg overflow-hidden">
                      <div 
                        style={{ backgroundColor: collection.color }} 
                        className="aspect-square flex flex-col items-center justify-center p-8 text-center"
                      >
                        <h2 className={`text-3xl font-bold mb-4 ${collection.textDark ? "text-gray-800" : "text-white"}`}>
                          {collection.title}
                        </h2>
                        <p className={`${collection.textDark ? "text-gray-700" : "text-white"}`}>
                          {collection.description}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold mb-3">Featured Stories</h3>
                <p className="text-gray-600 mb-6">
                  Explore our curated collection of articles, tips, and stories related to {selectedCategory}.
                </p>
                <Button 
                  onClick={() => setSelectedCategory("All")} 
                  className="bg-[#E90064] hover:bg-[#FE5FA4]"
                >
                  Back to All Categories
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Blog Posts */}
      <div className="bg-white py-16">
        <div className="container-custom">
          {/* Featured Post */}
          {filteredPosts.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="overflow-hidden rounded-lg">
                  <div 
                    style={{ backgroundColor: filteredPosts[0].color }} 
                    className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 flex items-center justify-center"
                  >
                    <span className="text-white text-lg font-bold">Sister Storage</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-[#FE5FA4] text-white rounded-full text-sm font-medium">
                      {filteredPosts[0].category}
                    </span>
                    <span 
                      className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: difficultyColors[filteredPosts[0].difficulty] }}
                    >
                      {filteredPosts[0].difficulty}
                    </span>
                    <span className="text-xs text-gray-600">
                      {filteredPosts[0].readingTime} read
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold">{filteredPosts[0].title}</h2>
                  <p className="text-gray-700">{filteredPosts[0].excerpt}</p>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-600">
                      By {filteredPosts[0].author} • {filteredPosts[0].date}
                    </div>
                  </div>
                  <Button className="bg-[#E90064] hover:bg-[#FE5FA4] text-white mt-2">
                    Read Article
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Tabs for different content sections */}
          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="mb-8 w-full max-w-md mx-auto flex justify-between bg-[#F4F4F4]">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="editorsPick">Editor's Picks</TabsTrigger>
              <TabsTrigger value="mostShared">Most Shared</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(1).map((post) => (
                  <div key={post.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="overflow-hidden h-48">
                      <div 
                        style={{ backgroundColor: post.color }} 
                        className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform duration-500"
                      >
                        <span className="text-white text-sm font-bold">Sister Storage</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-3 py-1 bg-[#FE5FA4] text-white rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: difficultyColors[post.difficulty] }}
                          >
                            {post.difficulty}
                          </span>
                          <span className="text-xs text-gray-600">
                            {post.readingTime}
                          </span>
                        </div>
                      </div>
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
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingPosts.map((post) => (
                  <div key={post.id} className="border-l-4 border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: post.color }}>
                    <div className="overflow-hidden h-48">
                      <div 
                        style={{ backgroundColor: post.color }} 
                        className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform duration-500"
                      >
                        <span className="text-white text-sm font-bold">Sister Storage</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 bg-[#FE5FA4] text-white rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="text-xs bg-[#E90064] text-white px-2 py-0.5 rounded-full">Trending</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <Button variant="secondary" size="sm">Read More</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="editorsPick">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {editorsPickPosts.map((post) => (
                  <div key={post.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-md">
                    <div className="overflow-hidden h-48">
                      <div 
                        style={{ backgroundColor: post.color }} 
                        className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform duration-500"
                      >
                        <div className="bg-white/80 px-3 py-1 rounded-full">
                          <span className="text-sm font-bold" style={{ color: post.color }}>Editor's Choice</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 bg-[#FE5FA4] text-white rounded-full text-xs font-medium mb-3">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <Button variant="secondary" size="sm">Read More</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="mostShared">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mostSharedPosts.map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="h-16 w-16 rounded-full mb-4 flex items-center justify-center mx-auto" style={{ backgroundColor: post.color }}>
                      <span className="text-white text-sm font-bold">Top</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-center">{post.title}</h3>
                    <div className="flex justify-center mb-4">
                      <span className="inline-block px-3 py-1 bg-[#FE5FA4] text-white rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2 text-center">{post.excerpt}</p>
                    <div className="text-center">
                      <Button variant="secondary" size="sm">Read More</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Popular Tags Section */}
          <div className="py-12">
            <h2 className="text-2xl font-bold mb-6">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...blogPosts.map(post => post.category), ...collections.map(c => c.title)])).map((category) => {
                // Find a post with this category to get the color or use collection color
                const categoryPost = blogPosts.find(post => post.category === category);
                const categoryCollection = collections.find(c => c.title === category);
                const color = categoryCollection ? categoryCollection.color : 
                              categoryPost ? categoryPost.color : "#E90064";
                const textDark = categoryCollection?.textDark;
                
                return (
                  <span
                    key={category}
                    style={{ backgroundColor: color }}
                    className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${textDark ? "text-gray-800" : "text-white"}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="py-16 bg-[#FFDCBD]">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Get Organization Tips Delivered</h2>
          <p className="text-gray-700 mb-6">
            Join our newsletter to receive monthly organization tips, exclusive offers, and early access to new products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded-md border border-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-[#E90064]"
            />
            <Button className="bg-[#E90064] hover:bg-[#FE5FA4] text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
