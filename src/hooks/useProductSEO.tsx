import { useEffect } from "react";
import { getProductKeywords } from "@/config/seo-keywords";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  images?: string[];
  categories?: string[];
}

interface ProductAttributes {
  rodCount?: string | string[];
  size?: string | string[];
  useCase?: string[];
  bundleSize?: string;
  removableRods?: boolean;
  stackable?: boolean;
}

export const useProductSEO = (
  product: Product | null | undefined,
  attributes?: ProductAttributes
) => {
  useEffect(() => {
    if (!product) return;

    // Set page title
    document.title = `${product.name} | Sister Storage`;
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    
    const descriptionText = product.description 
      ? `${product.description.substring(0, 140)}...` 
      : `Shop ${product.name} - Tangle-free, dust-proof bangle storage from Sister Storage. Premium organizers that protect your bangles. Fast shipping to Canada, USA, and UK.`;
    metaDescription.content = descriptionText;

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = getProductKeywords(product.name, product.categories, attributes);

    // Set canonical URL
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}/product/${product.id}`;

    // Add Product structured data
    const id = "ld-product";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description || descriptionText,
      image: product.images?.[0] || "",
      brand: {
        "@type": "Brand",
        name: "Sister Storage"
      },
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "CAD",
        availability: (product.stock ?? 1) > 0 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        url: `https://www.sisterstorage.com/product/${product.id}`,
        seller: {
          "@type": "Organization",
          name: "Sister Storage"
        }
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "127"
      }
    };
    
    script.textContent = JSON.stringify(productSchema);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [product, attributes]);
};
