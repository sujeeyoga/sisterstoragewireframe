import BaseLayout from '@/components/layout/BaseLayout';
import { EnhancedScrollFade } from '@/components/ui/enhanced-scroll-fade';

const PrivacyPolicy = () => {
  return (
    <BaseLayout>
      <main className="min-h-screen bg-background">
        <div className="container-custom py-16 px-4">
          <EnhancedScrollFade>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Privacy Policy</h1>
              <p className="text-muted-foreground text-center mb-12">Last updated: January 2025</p>
              
              <div className="prose prose-gray max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Information We Collect</h2>
                  <p className="mb-4">
                    At Sister Storage, we collect information you provide directly to us, such as when you create an account, 
                    make a purchase, or contact us for support. This may include your name, email address, shipping address, 
                    and payment information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">How We Use Your Information</h2>
                  <p className="mb-4">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your purchases</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Improve our products and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Information Sharing</h2>
                  <p className="mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                    except as described in this policy. We may share information with service providers who assist us in operating 
                    our website and conducting our business.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Data Security</h2>
                  <p className="mb-4">
                    We implement appropriate security measures to protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Your Rights</h2>
                  <p className="mb-4">
                    You have the right to access, update, or delete your personal information. You may also opt out of 
                    marketing communications at any time. To exercise these rights, please contact us at privacy@sisterstorage.com.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
                  <p className="mb-4">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <p className="font-medium">
                    Sister Storage<br />
                    Email: privacy@sisterstorage.com<br />
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

export default PrivacyPolicy;