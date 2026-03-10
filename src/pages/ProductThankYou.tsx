
import { useParams, Link } from "react-router-dom";
import { useProductBySlug } from "@/hooks/useProductsCatalog";
import { Loader2, ShoppingBag, Instagram, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { Helmet } from "react-helmet-async";

export default function ProductThankYou() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { data: product, isLoading, error } = useProductBySlug(productSlug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center gap-4">
        <Logo size="md" />
        <h1 className="text-2xl font-bold text-foreground mt-6">Product Not Found</h1>
        <p className="text-muted-foreground">
          We couldn't find the product you're looking for.
        </p>
        <Button asChild variant="default" className="mt-4">
          <Link to="/shop">Browse Our Shop</Link>
        </Button>
      </div>
    );
  }

  const mainImage = product.images?.[0] || "";
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();
  const cleanDescription = stripHtml(product.description || product.shortDescription || "");

  return (
    <>
      <Helmet>
        <title>{`Thank You | ${product.name} – Sister Storage`}</title>
        <meta name="description" content={`Thank you for purchasing ${product.name} from Sister Storage.`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="flex items-center justify-center py-6 px-4 border-b border-border">
          <Logo size="md" />
        </header>

        <main className="max-w-lg mx-auto px-5 py-8 space-y-8">
          {/* Thank You Hero */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
              <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Thank You!
            </h1>
            <p className="text-muted-foreground text-base">
              We're so happy you chose Sister Storage. Here's everything you need to know about your product.
            </p>
          </div>

          {/* Product Card */}
          <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
            {mainImage && (
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            <div className="p-5 space-y-4">
              <h2 className="text-xl font-bold text-card-foreground">{product.name}</h2>

              {cleanDescription && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cleanDescription}
                </p>
              )}

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Features
                  </h3>
                  <ul className="space-y-1.5">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sizing / Dimensions */}
              {(product.length || product.width || product.height) && (
                <div>
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Dimensions
                  </h3>
                  <div className="flex gap-4 text-sm text-card-foreground">
                    {product.length != null && (
                      <div className="flex flex-col items-center bg-muted rounded-lg px-3 py-2">
                        <span className="text-xs text-muted-foreground">L</span>
                        <span className="font-semibold">{product.length} cm</span>
                      </div>
                    )}
                    {product.width != null && (
                      <div className="flex flex-col items-center bg-muted rounded-lg px-3 py-2">
                        <span className="text-xs text-muted-foreground">W</span>
                        <span className="font-semibold">{product.width} cm</span>
                      </div>
                    )}
                    {product.height != null && (
                      <div className="flex flex-col items-center bg-muted rounded-lg px-3 py-2">
                        <span className="text-xs text-muted-foreground">H</span>
                        <span className="font-semibold">{product.height} cm</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Care Tips */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-card-foreground uppercase tracking-wider">
              Care & Usage Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Wipe with a damp cloth to keep it looking fresh
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Store in a cool, dry place when not in use
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Use the included rods for maximum organization
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Button asChild variant="default" size="full">
              <Link to="/shop" className="inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Shop More Products
              </Link>
            </Button>

            <Button asChild variant="primary-inverse" size="full">
              <a
                href="https://www.instagram.com/sisterstorageinc/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Instagram className="h-4 w-4" />
                Follow Us on Instagram
              </a>
            </Button>

            <Button asChild variant="ghost" size="full">
              <Link to="/contact" className="inline-flex items-center gap-2">
                Questions? Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground pt-4 pb-8">
            © {new Date().getFullYear()} Sister Storage Inc. All rights reserved.
          </p>
        </main>
      </div>
    </>
  );
}
