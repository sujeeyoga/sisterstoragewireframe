import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";
import { seoGuides } from "@/data/seo-guides";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SEOGuide = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const guide = seoGuides.find((g) => g.slug === guideId);

  if (!guide) {
    return <Navigate to="/404" replace />;
  }

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: guide.title,
          text: guide.excerpt,
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.metaDescription,
    "author": {
      "@type": "Organization",
      "name": "Sister Storage"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sister Storage",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.sisterstorage.com/lovable-uploads/sister-storage-logo-new.jpg"
      }
    },
    "datePublished": guide.publishDate,
    "dateModified": guide.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.sisterstorage.com/guides/${guide.slug}`
    },
    "image": `https://www.sisterstorage.com${guide.featuredImage}`,
    "articleSection": guide.category,
    "keywords": guide.keywords
  };

  return (
    <>
      <Helmet>
        <title>{guide.metaTitle}</title>
        <meta name="description" content={guide.metaDescription} />
        <meta name="keywords" content={guide.keywords} />
        <link rel="canonical" href={`https://www.sisterstorage.com/guides/${guide.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={guide.metaTitle} />
        <meta property="og:description" content={guide.metaDescription} />
        <meta property="og:image" content={`https://www.sisterstorage.com${guide.featuredImage}`} />
        <meta property="og:url" content={`https://www.sisterstorage.com/guides/${guide.slug}`} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={guide.metaTitle} />
        <meta name="twitter:description" content={guide.metaDescription} />
        <meta name="twitter:image" content={`https://www.sisterstorage.com${guide.featuredImage}`} />
        
        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      {/* FAQ Schema */}
      <FAQSchema faqs={guide.faqs} />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container max-w-4xl py-8">
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
            
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {guide.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{guide.title}</h1>
            
            <p className="text-lg text-muted-foreground mb-6">{guide.excerpt}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {guide.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {guide.readTime}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="container max-w-4xl py-8">
          <img
            src={guide.featuredImage}
            alt={guide.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="container max-w-4xl pb-16">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          {/* FAQs Section */}
          {guide.faqs && guide.faqs.length > 0 && (
            <div className="mt-16 pt-16 border-t border-border">
              <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {guide.faqs.map((faq, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-foreground/80 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 pt-16 border-t border-border text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Organize Your Collection?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our thoughtfully designed storage solutions created specifically for South Asian jewelry.
            </p>
            <Link to="/shop">
              <Button size="lg" className="text-lg px-8 py-6">
                Shop Sister Storage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEOGuide;
