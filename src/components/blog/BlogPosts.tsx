
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BlogPostCard from "./BlogPostCard";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  color: string;
  readingTime: string;
  difficulty: string;
  featured?: boolean;
  trending?: boolean;
  editorsPick?: boolean;
  mostShared?: boolean;
}

interface BlogPostsProps {
  posts: BlogPost[];
  difficultyColors: Record<string, string>;
}

const BlogPosts = ({ posts, difficultyColors }: BlogPostsProps) => {
  const featuredPosts = posts.filter(post => post.featured);
  const trendingPosts = posts.filter(post => post.trending);
  const editorsPickPosts = posts.filter(post => post.editorsPick);
  const mostSharedPosts = posts.filter(post => post.mostShared);
  
  return (
    <div className="bg-white py-16">
      <div className="container-custom">
        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="overflow-hidden rounded-lg">
                <div 
                  style={{ backgroundColor: posts[0].color }} 
                  className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 flex items-center justify-center"
                >
                  <span className="text-white text-lg font-bold">Sister Storage</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-[#FE5FA4] text-white rounded-full text-sm font-medium">
                    {posts[0].category}
                  </span>
                  <span 
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: difficultyColors[posts[0].difficulty] }}
                  >
                    {posts[0].difficulty}
                  </span>
                  <span className="text-xs text-gray-600">
                    {posts[0].readingTime} read
                  </span>
                </div>
                <h2 className="text-3xl font-bold">{posts[0].title}</h2>
                <p className="text-gray-700">{posts[0].excerpt}</p>
                <div className="flex items-center">
                  <div className="text-sm text-gray-600">
                    By {posts[0].author} • {posts[0].date}
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
              {posts.slice(1).map((post) => (
                <BlogPostCard key={post.id} post={post} difficultyColors={difficultyColors} />
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
      </div>
    </div>
  );
};

export default BlogPosts;
