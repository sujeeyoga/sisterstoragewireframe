import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, AlertTriangle } from "lucide-react";

const images = [
  { src: "/lovable-uploads/culture-bag-front.jpeg", alt: "Culture Bag front view with saree visible through clear window" },
  { src: "/lovable-uploads/culture-bag-stack.jpeg", alt: "Stack of Culture Bags filled with sarees" },
  { src: "/lovable-uploads/culture-bag-zippers.jpeg", alt: "Culture Bag zipper detail showing stacked bags" },
  { src: "/lovable-uploads/culture-bag-hand.jpeg", alt: "Hand opening Culture Bag back compartment" },
  { src: "/lovable-uploads/culture-bag-quilted.jpeg", alt: "Culture Bag quilted cotton blend texture" },
  { src: "/lovable-uploads/culture-bag-back.jpeg", alt: "Culture Bag back compartment open" },
  { src: "/lovable-uploads/culture-bag-side.jpeg", alt: "Culture Bag side view with quilted pattern" },
  { src: "/lovable-uploads/culture-bag-detail.jpeg", alt: "Culture Bag close-up fabric detail" },
];

const features = [
  "Designed specifically for folded sarees",
  "Cotton blend construction for breathability and structure",
  "Structured design for neat stacking",
  "Clear front window for visibility",
  "Back compartment for blouses, underskirts, and matching pieces",
  "42cm × 37cm — compact and closet-friendly",
];

const CultureBag = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: "culture-bag-saree-bundle-10",
      name: "Culture Bag – For Sarees (Bundle of 10)",
      price: 40,
      image: images[0].src,
    });
    toast({ title: "Added to cart", description: "Culture Bag – Bundle of 10 added to your cart" });
    setIsOpen(true);
  };

  return (
    <Layout>
      <Helmet>
        <title>Culture Bag for Sarees | Saree Storage Organizer | Sister Storage</title>
        <meta name="description" content="The Culture Bag is a cotton blend saree storage organizer with clear window and back compartment. 42cm × 37cm, olive green. Keep your sarees protected and organized." />
      </Helmet>

      <div className="pb-16 pt-12">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <nav className="text-xs text-muted-foreground mb-6">
            <a href="/shop" className="hover:text-foreground transition-colors">Shop</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">Culture Bag</span>
          </nav>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                      selectedImage === i ? "border-[hsl(var(--brand-pink))] ring-1 ring-[hsl(var(--brand-pink))]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>

              {/* Video Teaser */}
              <div className="rounded-lg overflow-hidden mt-4">
                <video
                  src="/lovable-uploads/culture-bag-teaser.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">For Sarees</p>
                <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground mb-2">
                  Culture Bag
                </h1>
                <p className="text-sm text-muted-foreground mb-3">42cm × 37cm | Olive Green</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground">$40</span>
                  <span className="text-sm text-muted-foreground">/ bundle of 10</span>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-3 text-foreground/80 text-[15px] leading-relaxed">
                <p>Designed specifically for folded sarees.</p>
                <p>
                  Made with a cotton blend for breathability and structure, it holds its shape, stacks neatly,
                  and helps create more closet space — and who doesn't want that?
                </p>
                <p>
                  Features a clear front window for easy visibility and a back compartment to keep your blouse,
                  underskirt, and matching pieces together.
                </p>
                <p className="font-semibold text-foreground">No searching. No separating. Just open and go.</p>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3 pt-2">
                <Button
                  size="lg"
                  className="flex-1 h-14 text-base font-bold uppercase tracking-wide"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 text-base font-bold uppercase tracking-wide"
                  onClick={() => {
                    handleAddToCart();
                    navigate("/checkout");
                  }}
                >
                  Buy Now
                </Button>
              </div>

              {/* Features */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
                  Features
                </h3>
                <ul className="space-y-2.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className="h-4 w-4 mt-0.5 text-[hsl(var(--brand-pink))] flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best Practice Tip */}
              <div className="bg-muted/50 rounded-lg p-5 border border-border">
                <h4 className="text-sm font-bold mb-2">
                  Best Practice Tip
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Regardless of how you store your sarees, it's recommended to take them out occasionally,
                  refold them, and allow them to air — especially heirloom silk pieces. This helps preserve
                  fabric quality and prevent long-term creasing.
                </p>
              </div>

              {/* Care Notes */}
              <div className="bg-destructive/5 rounded-lg p-5 border border-destructive/20">
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Care Notes
                </h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Avoid storing in moist, wet, or high-heat conditions</li>
                  <li>• Not recommended for very heavy brocade sarees</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Long Description Section */}
          <section className="max-w-3xl mx-auto space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-3xl font-black uppercase text-foreground text-center mb-8">
              Keep the culture. Store it with care.
            </h2>

            <p>
              Your sarees deserve a dedicated space that protects the fabric and keeps everything together.
            </p>
            <p>
              The Culture Bag is thoughtfully designed for folded sarees, giving them structure, visibility,
              and an intentional place in your closet.
            </p>
            <p>
              Made with a cotton blend for breathability and structure, it supports fabric integrity while
              holding its shape and stacking neatly. The compact design helps maximize your shelves and
              creates more closet space — and who doesn't want that?
            </p>
            <p>
              The clear front window lets you instantly see which saree is inside, and the additional back
              compartment keeps your blouse, underskirt, or matching pieces stored together in one place.
            </p>
            <p className="font-semibold text-foreground text-lg">No more pulling everything out to find the right blouse.</p>
            <p className="font-semibold text-foreground text-lg">No more last-minute searching before an event.</p>
            <p className="font-semibold text-foreground text-lg">Everything stays together — exactly how it should.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default CultureBag;
