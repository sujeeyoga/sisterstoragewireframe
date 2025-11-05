import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Package, Truck, Globe, MapPin, Clock, DollarSign, Shield, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ShippingFAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'domestic', label: 'Canada Shipping', icon: MapPin },
    { id: 'international', label: 'International', icon: Globe },
    { id: 'costs', label: 'Costs & Rates', icon: DollarSign },
    { id: 'tracking', label: 'Tracking & Delivery', icon: Truck },
  ];

  const faqs = [
    {
      category: 'domestic',
      question: 'Do you offer free shipping in Canada?',
      answer: 'Yes! We offer free shipping on orders over $50 CAD to most areas in the Greater Toronto Area (GTA). For Toronto proper, we offer flat-rate shipping at just $3.99. Orders outside the GTA have shipping calculated based on your location and order weight.'
    },
    {
      category: 'domestic',
      question: 'How long does domestic shipping take?',
      answer: 'Orders within the GTA typically arrive within 2-5 business days. Other Canadian locations can expect delivery within 5-10 business days, depending on your province and proximity to major centers.'
    },
    {
      category: 'domestic',
      question: 'Which areas qualify for GTA free shipping?',
      answer: 'The GTA free shipping zone includes Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, and surrounding areas. Your shipping cost will be calculated automatically at checkout based on your postal code.'
    },
    {
      category: 'international',
      question: 'Do you ship to the United States?',
      answer: 'Yes, we ship to all 50 US states! Shipping typically takes 7-14 business days for delivery. Rates are calculated based on your location and package weight, starting from around $12 USD for individual items.'
    },
    {
      category: 'international',
      question: 'Do you ship to the United Kingdom?',
      answer: 'Absolutely! We ship to the UK with full tracking. Delivery typically takes 10-14 business days, though our carrier quotes 7-27 business days to account for customs processing. Shipping costs start from $11 CAD for individual items, with heavier bundles ranging from $26-$102 CAD.'
    },
    {
      category: 'international',
      question: 'Do you ship to other countries?',
      answer: 'Currently, we ship to Canada, the United States, and the United Kingdom. We\'re working on expanding to additional countries. If you\'re located elsewhere, please contact us and we\'ll do our best to accommodate your order.'
    },
    {
      category: 'international',
      question: 'Will I have to pay customs duties on international orders?',
      answer: 'For international orders (outside Canada), customs duties and taxes may apply depending on your country\'s import regulations and the order value. These fees are the responsibility of the customer and are not included in our shipping costs. The package will be declared accurately for customs purposes.'
    },
    {
      category: 'costs',
      question: 'How is shipping cost calculated?',
      answer: 'Shipping is calculated based on your delivery address, package weight, and package dimensions. We use a zone-based system that ensures you get the best available rate for your location. The exact cost will be shown during checkout before you complete your purchase.'
    },
    {
      category: 'costs',
      question: 'Can I get free shipping on international orders?',
      answer: 'Yes! International orders over $200 CAD qualify for free shipping to the US and UK. This is a great way to save on larger orders or when purchasing multiple items.'
    },
    {
      category: 'costs',
      question: 'Why does shipping cost more for bundles?',
      answer: 'Bundles contain multiple bangle organizer boxes, which increases both the weight and size of your package. Larger, heavier packages cost more to ship internationally. However, buying bundles is still more economical than buying items separately when you factor in the per-item cost and shipping savings.'
    },
    {
      category: 'tracking',
      question: 'Will I receive tracking information?',
      answer: 'Yes! All orders include full tracking. You\'ll receive a shipping confirmation email with your tracking number once your order has been fulfilled. You can use this number to monitor your package\'s journey from our facility to your door.'
    },
    {
      category: 'tracking',
      question: 'When will my order ship?',
      answer: 'Orders are typically processed and shipped within 1-3 business days. During busy periods or promotions, this may extend to 3-5 business days. You\'ll receive an email notification as soon as your order ships with tracking details.'
    },
    {
      category: 'tracking',
      question: 'What if my package is lost or damaged?',
      answer: 'All our shipments include tracking and insurance coverage. If your package is lost in transit or arrives damaged, please contact us immediately at hello@sisterstoragesolutions.com with your order number and photos (if damaged). We\'ll work quickly to resolve the issue, either by filing a claim or sending a replacement.'
    },
    {
      category: 'tracking',
      question: 'My tracking hasn\'t updated in several days. Should I be worried?',
      answer: 'Not necessarily. Tracking can sometimes experience delays in updating, especially during customs processing for international orders or during high-volume shipping periods. If your tracking hasn\'t updated for more than 7 business days (or 14 days for international), please contact us and we\'ll investigate.'
    },
    {
      category: 'tracking',
      question: 'Can I change my shipping address after placing an order?',
      answer: 'If your order hasn\'t shipped yet, we can update your address. Please contact us immediately at hello@sisterstoragesolutions.com with your order number and new address. Once an order has shipped, we cannot change the delivery address.'
    },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Header */}
        <div className="bg-primary/5 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Package className="h-8 w-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold">Shipping FAQ</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about shipping your Sister Storage Solutions order
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setActiveCategory(category.id)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>

            {/* FAQ Accordion */}
            <Card className="p-6 md:p-8">
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-semibold pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No questions found in this category.</p>
                </div>
              )}
            </Card>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Processing Time</h3>
                <p className="text-sm text-muted-foreground">1-3 business days</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Shield className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Fully Tracked</h3>
                <p className="text-sm text-muted-foreground">All orders include tracking</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">Over $50 CAD (GTA) or $200 CAD (International)</p>
              </Card>
            </div>

            {/* Still Have Questions */}
            <Card className="mt-8 p-8 bg-primary/5 border-primary/20 text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                We're here to help! Reach out to our support team for personalized assistance.
              </p>
              <Link to="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingFAQ;