
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import BlogHero from "@/components/blog/BlogHero";
import BlogCollection from "@/components/blog/BlogCollection";
import FeaturedCollectionStory from "@/components/blog/FeaturedCollectionStory";
import BlogPosts from "@/components/blog/BlogPosts";
import PopularTags from "@/components/blog/PopularTags";
import Newsletter from "@/components/blog/Newsletter";
import { blogPosts, collections, categories, difficultyColors } from "@/components/blog/blogData";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section with Categories */}
      <BlogHero 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Collections Section */}
      <BlogCollection 
        collections={collections}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Featured Collection Story */}
      <FeaturedCollectionStory 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        collections={collections}
      />
      
      {/* Blog Posts Section */}
      <BlogPosts 
        posts={filteredPosts}
        difficultyColors={difficultyColors}
      />
      
      {/* Popular Tags Section */}
      <div className="container-custom">
        <PopularTags 
          blogPosts={blogPosts}
          collections={collections}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      
      {/* Newsletter Section */}
      <Newsletter />
    </Layout>
  );
};

export default Blog;
