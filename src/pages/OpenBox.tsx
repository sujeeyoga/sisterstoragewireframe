import React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useProducts } from "@/hooks/useProducts";
import SimpleProductCard from "@/components/shop/SimpleProductCard";
import { Package } from "lucide-react";

const OpenBox = () => {
  const { data: products = [], isLoading } = useProducts();
  
  // Filter products by checking if categories array includes open-box slug
  const openBoxProducts = products.filter(p => 
    Array.isArray(p.categories) && 
    (p.categories.includes('open-box') || p.categories.includes('open-box-deals'))
  );

  return (
    <Layout>
      <Helmet>
        <title>Open Box Deals - Sister Storage | Quality Products at Discounted Prices</title>
        <meta 
          name="description" 
          content="Shop our open box deals for quality bangle storage boxes at unbeatable prices. Limited quantities available on like-new condition organizers." 
        />
        <meta name="keywords" content="open box deals, discounted bangle boxes, clearance storage, jewelry organizer deals" />
      </Helmet>
      
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Hero Section */}
        <header className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-12 h-12 text-[#ff6b35]" aria-hidden="true" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 uppercase">
                Open Box Deals
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Quality products at unbeatable prices. Limited quantities available - these deals won&apos;t last long!
            </p>
          </div>
        </header>

        {/* Products Grid */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8" aria-label="Open box products">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <p className="text-xl text-gray-600">Loading open box deals...</p>
              </div>
            ) : openBoxProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                <h2 className="text-xl text-gray-600 mb-2 font-semibold">No open box products available right now</h2>
                <p className="text-gray-500">Check back soon for new deals!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
                {openBoxProducts.map((product) => (
                  <SimpleProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default OpenBox;
