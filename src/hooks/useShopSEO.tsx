import { useEffect } from "react";
import { getShopKeywords } from "@/config/seo-keywords";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export const useShopSEO = (products: Product[]) => {
  useEffect(() => {
    // Set page title
    document.title = "Shop Organizers & Bangle Boxes | Sister Storage";
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    const descriptionText = products.length > 0
      ? `Shop tangle-free, dust-proof bangle storage solutions. Browse ${products.length}+ premium organizers that protect your bangles and save space. Fast shipping across Canada, USA, and UK.`
      : "Shop tangle-free, dust-proof bangle storage from Sister Storage. Premium organizers designed with culture in mind.";
    metaDescription.content = descriptionText;

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = getShopKeywords();

    // Set canonical URL
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}/shop`;

    // Add structured data
    const id = "ld-shop";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.slice(0, 24).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Product",
          name: p.name,
          brand: "Sister Storage",
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "USD",
            availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        },
      })),
    };
    
    script.textContent = JSON.stringify(itemList);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [products]);
};