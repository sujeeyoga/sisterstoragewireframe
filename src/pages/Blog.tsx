
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Sister Storage Blog",
    "description": "Tips, stories, and guides for organizing your bangles and jewelry with cultural wisdom",
    "url": "https://attczdhexkpxpyqyasgz.lovable.app/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Sister Storage",
      "logo": {
        "@type": "ImageObject",
        "url": "https://attczdhexkpxpyqyasgz.lovable.app/favicon.ico"
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://attczdhexkpxpyqyasgz.lovable.app/blog/${post.id}`,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.date
    }))
  };

  return (
    <Layout>
      <Helmet>
        <title>Blog - Bangle Storage Tips & Cultural Organization Stories | Sister Storage</title>
        <meta name="description" content="Explore our collection of guides, tips, and stories about organizing bangles, jewelry care, and maintaining cultural traditions. From Amma-approved hacks to modern storage solutions." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://attczdhexkpxpyqyasgz.lovable.app/blog" />
        <meta property="og:title" content="Sister Storage Blog - Bangle Organization & Cultural Wisdom" />
        <meta property="og:description" content="Tips, stories, and guides for organizing your bangles and jewelry with cultural wisdom" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://attczdhexkpxpyqyasgz.lovable.app/blog" />
        <meta name="twitter:title" content="Sister Storage Blog - Bangle Organization & Cultural Wisdom" />
        <meta name="twitter:description" content="Tips, stories, and guides for organizing your bangles and jewelry with cultural wisdom" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
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
