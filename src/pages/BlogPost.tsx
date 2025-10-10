import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import { blogPosts } from "@/components/blog/blogData";
import { blogPostContent } from "@/data/blogContent";

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);
  const content = blogPostContent[id || ""];

  if (!post || !content) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const pageUrl = `https://attczdhexkpxpyqyasgz.lovable.app/blog/${id}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.date,
    "publisher": {
      "@type": "Organization",
      "name": "Sister Storage",
      "logo": {
        "@type": "ImageObject",
        "url": "https://attczdhexkpxpyqyasgz.lovable.app/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "articleSection": post.category,
    "keywords": `${post.category}, bangle storage, jewelry organization, South Asian culture`
  };

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | Sister Storage Blog</title>
        <meta name="description" content={post.excerpt} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:section" content={post.category} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <article className="container-custom py-12 max-w-4xl mx-auto" itemScope itemType="https://schema.org/BlogPosting">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <span 
            className="inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4"
            style={{ backgroundColor: post.color }}
          >
            {post.category}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6" itemProp="headline">{post.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span itemProp="author" itemScope itemType="https://schema.org/Person">
                <span itemProp="name">{post.author}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{post.difficulty}</span>
            </div>
            <time dateTime={post.date} itemProp="datePublished">{post.date}</time>
          </div>
        </div>

        {/* Featured Image */}
        <div 
          className="w-full h-96 rounded-lg mb-12 flex items-center justify-center"
          style={{ backgroundColor: post.color }}
        >
          <span className="text-white text-2xl font-bold">Sister Storage</span>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none" itemProp="articleBody">
          <p className="text-xl text-muted-foreground mb-8" itemProp="description">{post.excerpt}</p>
          
          <div className="space-y-8" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        
        {/* Hidden meta for SEO */}
        <meta itemProp="articleSection" content={post.category} />
        <meta itemProp="wordCount" content={content.split(' ').length.toString()} />

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-primary/5 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to organize your bangles?</h3>
          <p className="text-muted-foreground mb-6">
            Check out our beautiful storage solutions designed specifically for South Asian jewelry.
          </p>
          <Button asChild size="lg">
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/blog">View All Posts</Link>
          </Button>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
