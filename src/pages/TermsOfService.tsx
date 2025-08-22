import BaseLayout from '@/components/layout/BaseLayout';
import { EnhancedScrollFade } from '@/components/ui/enhanced-scroll-fade';

const TermsOfService = () => {
  return (
    <BaseLayout>
      <main className="min-h-screen bg-background">
        <div className="container-custom py-16 px-4">
          <EnhancedScrollFade>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Terms of Service</h1>
              <p className="text-muted-foreground text-center mb-12">Last updated: January 2025</p>
              
              <div className="prose prose-gray max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Acceptance of Terms</h2>
                  <p className="mb-4">
                    By accessing and using Sister Storage's website and services, you accept and agree to be bound by 
                    the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Products and Services</h2>
                  <p className="mb-4">
                    Sister Storage provides culturally-inspired organization and storage solutions. All product descriptions, 
                    pricing, and availability are subject to change without notice. We reserve the right to limit quantities 
                    and refuse service to anyone.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Orders and Payment</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All orders are subject to availability and confirmation</li>
                    <li>Payment must be received before shipment</li>
                    <li>We accept major credit cards and PayPal</li>
                    <li>Prices are in USD and include applicable taxes</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Shipping and Returns</h2>
                  <p className="mb-4">
                    We ship within the United States and select international locations. Return policy allows for returns 
                    within 30 days of purchase in original condition. Custom or personalized items may not be returnable.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Intellectual Property</h2>
                  <p className="mb-4">
                    All content on this website, including but not limited to text, graphics, logos, and images, 
                    is the property of Sister Storage and protected by copyright and trademark laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Limitation of Liability</h2>
                  <p className="mb-4">
                    Sister Storage shall not be liable for any indirect, incidental, or consequential damages arising 
                    from the use of our products or services. Our liability is limited to the purchase price of the product.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Information</h2>
                  <p className="mb-4">
                    For questions about these Terms of Service, please contact us at:
                  </p>
                  <p className="font-medium">
                    Sister Storage<br />
                    Email: legal@sisterstorage.com<br />
                    Phone: 1-800-SISTERS
                  </p>
                </section>
              </div>
            </div>
          </EnhancedScrollFade>
        </div>
      </main>
    </BaseLayout>
  );
};

export default TermsOfService;