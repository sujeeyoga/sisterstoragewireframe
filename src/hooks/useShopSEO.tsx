import { useEffect } from "react";

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
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Shop bangle boxes, bundles, and organizers. Filter by rod count, size, and use case to find your perfect storage solution.";

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