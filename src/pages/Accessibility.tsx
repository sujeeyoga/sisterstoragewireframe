import BaseLayout from '@/components/layout/BaseLayout';
import { EnhancedScrollFade } from '@/components/ui/enhanced-scroll-fade';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

const Accessibility = () => {
  return (
    <BaseLayout>
      <main className="min-h-screen bg-background">
        <div className="container-custom py-16 px-4">
          <EnhancedScrollFade>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Accessibility Statement</h1>
              <p className="text-muted-foreground text-center mb-12">Last updated: January 2025</p>
              
              <div className="prose prose-gray max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Our Commitment</h2>
                  <p className="mb-4">
                    Sister Storage is committed to ensuring digital accessibility for people with disabilities. 
                    We are continually improving the user experience for everyone and applying the relevant 
                    accessibility standards to ensure we provide equal access to all of our users.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Accessibility Features</h2>
                  <p className="mb-4">Our website includes the following accessibility features:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Alternative text for images</li>
                    <li>Keyboard navigation support</li>
                    <li>Screen reader compatibility</li>
                    <li>High contrast color schemes</li>
                    <li>Resizable text without loss of functionality</li>
                    <li>Clear and consistent navigation structure</li>
                    <li>Descriptive page titles and headings</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Conformance Status</h2>
                  <p className="mb-4">
                    We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA standards. 
                    These guidelines explain how to make web content more accessible to people with disabilities.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Ongoing Efforts</h2>
                  <p className="mb-4">
                    We regularly review our website to identify and fix any accessibility barriers. 
                    Our team works with accessibility experts to ensure our site meets current standards and best practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Feedback and Support</h2>
                  <p className="mb-4">
                    We welcome your feedback on the accessibility of our website. If you encounter any 
                    accessibility barriers or have suggestions for improvement, please let us know:
                  </p>
                  
                  <div className="bg-muted/50 p-6 rounded-lg mt-6">
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <span>accessibility@sisterstorage.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>1-800-SISTERS</span>
                      </div>
                    </div>
                    <Button className="mt-4" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Accessibility Feedback
                    </Button>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Alternative Assistance</h2>
                  <p className="mb-4">
                    If you need assistance with any part of our website or would prefer to place an order 
                    over the phone, our customer service team is ready to help during business hours.
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

export default Accessibility;