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
    // Set page title - front-loaded with keywords
    document.title = "Shop Bangle Storage Boxes & Organizers | Sister Storage Canada";
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    const descriptionText = products.length > 0
      ? `Shop Sister Storage's premium bangle storage boxes. Browse ${products.length}+ dust-free, stackable organizers perfect for Indian, Pakistani & South Asian jewelry. Free shipping in Canada over $50.`
      : "Shop premium bangle storage boxes from Sister Storage. Dust-free, stackable organizers designed for South Asian jewelry. Free shipping in Canada over $50.";
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
    link.href = "https://sisterstorage.ca/shop";

    // Add structured data with ItemList and BreadcrumbList
    const itemListId = "ld-shop";
    const breadcrumbId = "ld-shop-breadcrumb";
    
    // Remove existing scripts
    const existingItemList = document.getElementById(itemListId);
    if (existingItemList) existingItemList.remove();
    const existingBreadcrumb = document.getElementById(breadcrumbId);
    if (existingBreadcrumb) existingBreadcrumb.remove();
    
    // Create ItemList schema
    const itemListScript = document.createElement("script");
    itemListScript.type = "application/ld+json";
    itemListScript.id = itemListId;
    
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.slice(0, 24).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Product",
          name: p.name,
          brand: {
            "@type": "Brand",
            name: "Sister Storage"
          },
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "CAD",
            availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        },
      })),
    };
    
    itemListScript.textContent = JSON.stringify(itemList);
    document.head.appendChild(itemListScript);
    
    // Create BreadcrumbList schema
    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.type = "application/ld+json";
    breadcrumbScript.id = breadcrumbId;
    
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://sisterstorage.ca"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shop Bangle Storage",
          item: "https://sisterstorage.ca/shop"
        }
      ]
    };
    
    breadcrumbScript.textContent = JSON.stringify(breadcrumbList);
    document.head.appendChild(breadcrumbScript);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.getElementById(itemListId);
      if (scriptToRemove) scriptToRemove.remove();
      const breadcrumbToRemove = document.getElementById(breadcrumbId);
      if (breadcrumbToRemove) breadcrumbToRemove.remove();
    };
  }, [products]);
};
