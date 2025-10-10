import React from "react";
import { useParams, Link } from "react-router-dom";
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

  return (
    <Layout>
      <article className="container-custom py-12 max-w-4xl mx-auto">
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
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{post.difficulty}</span>
            </div>
            <span>{post.date}</span>
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
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
          
          <div className="space-y-8" dangerouslySetInnerHTML={{ __html: content }} />
        </div>

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
