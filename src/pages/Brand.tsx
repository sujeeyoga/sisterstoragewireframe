
import Layout from "@/components/layout/Layout";
import { SisterBrand } from '@/config/sister-brand.config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Heart, Star, Package, Mail } from 'lucide-react';
import { useState } from 'react';
import AnimatedText from '@/components/ui/animated-text';

const Brand = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-[#E90064] text-white py-20 px-6">
          <div className="container-custom text-center">
            <AnimatedText
              as="h1"
              className="text-5xl md:text-7xl font-bold mb-6"
              animation="breath-fade-up-1"
              words
            >
              Our Brand Story
            </AnimatedText>
            <AnimatedText
              as="p"
              className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
              animation="breath-fade-up-2"
            >
              Sister Storage's visual identity celebrates the beauty of organized living while honoring our cultural heritage. Every color, every curve, every choice reflects our mission: Culture Without Clutter.
            </AnimatedText>
            <AnimatedText
              as="div"
              className="flex flex-wrap justify-center gap-3"
              animation="breath-fade-up-3"
              container
            >
              {SisterBrand.brandVoice.personality.map((trait) => (
                <Badge key={trait} variant="secondary" className="bg-white text-[#E90064] px-4 py-2 text-sm font-medium">
                  {trait}
                </Badge>
              ))}
            </AnimatedText>
          </div>
        </section>

        {/* Brand Colors */}
        <section className="py-16 px-6 bg-white">
          <div className="container-custom">
            <AnimatedText
              as="h2"
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              animation="breath-fade-up"
            >
              Brand Colors
            </AnimatedText>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Object.entries(SisterBrand.colors).map(([name, value]) => (
                <Card key={name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => copyToClipboard(value, name)}>
                  <div className="h-24 relative" style={{ backgroundColor: value }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20">
                      {copiedColor === name ? (
                        <Check className="h-6 w-6 text-white" />
                      ) : (
                        <Copy className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-gray-600 font-mono">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="container-custom">
            <AnimatedText
              as="h2"
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              animation="breath-fade-up"
            >
              Typography — Poppins
            </AnimatedText>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Display / Hero</p>
                <h1 className="text-4xl md:text-6xl font-bold text-[#E90064] leading-tight">
                  Culture Without Clutter
                </h1>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Heading</p>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Designed by us — for us
                </h2>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Body Text</p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Made by sisters, for sisters. Sister Storage was created for the women who celebrate their culture boldly, live beautifully, and organize powerfully. We believe in honoring our traditions while designing for our modern lives.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Small Text / Captions</p>
                <p className="text-sm text-gray-600">
                  Clutter never had a place in our culture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons & Components */}
        <section className="py-16 px-6 bg-white">
          <div className="container-custom">
            <AnimatedText
              as="h2"
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              animation="breath-fade-up"
            >
              Buttons & Components
            </AnimatedText>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Button Styles */}
              <Card>
                <CardHeader>
                  <CardTitle>Button Styles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-black text-white hover:bg-[#FF8021] px-6 py-3 font-semibold" style={{ borderRadius: '0px' }}>
                      Primary Button
                    </Button>
                    <Button variant="secondary" className="border-[#E90064] text-[#E90064] hover:bg-[#E90064] px-6 py-3 font-semibold" style={{ borderRadius: '0px' }}>
                      Secondary Button
                    </Button>
                    <Button variant="outline" className="border-black text-black hover:bg-black px-6 py-3 font-semibold" style={{ borderRadius: '0px' }}>
                      Outline Button
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Component Examples */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Delivery Card */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-[#FF8021]" />
                      <h3 className="font-bold text-lg">Free Delivery</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Get your Sister Storage products delivered free on orders over $75.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-black text-white" style={{ borderRadius: '0px' }}>
                        DELIVERY INFO →
                      </Button>
                      <Button variant="outline" size="sm" style={{ borderRadius: '0px' }}>
                        TRACK ORDER
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Testimonial Card */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#FFA51E] text-[#FFA51E]" />
                      ))}
                    </div>
                    <p className="text-sm italic text-gray-700">
                      "Perfect blend of beauty and practicality. These storage solutions honor my heritage while keeping my modern home organized."
                    </p>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-[#E90064]" />
                      <p className="text-xs font-semibold">— Priya S., Interior Designer</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Applications */}
        <section className="py-16 px-6 bg-[#F4F4F4]">
          <div className="container-custom">
            <AnimatedText
              as="h2"
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              animation="breath-fade-up"
            >
              Brand Applications
            </AnimatedText>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-[#E90064] mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '0px' }}>
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Digital Communications</h3>
                <p className="text-sm text-gray-600">
                  Email campaigns, social media, and website design following our bold, cultural aesthetic.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-[#FF8021] mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '0px' }}>
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Product Packaging</h3>
                <p className="text-sm text-gray-600">
                  Clean, minimal packaging with bold brand colors and zero-radius design elements.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-[#FFA51E] mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '0px' }}>
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Brand Experience</h3>
                <p className="text-sm text-gray-600">
                  Every touchpoint reflects our commitment to cultural celebration and organized living.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Brand Voice */}
        <section className="py-16 px-6 bg-black text-white">
          <div className="container-custom text-center">
            <AnimatedText
              as="h2"
              className="text-3xl md:text-4xl font-bold mb-8"
              animation="breath-fade-up"
            >
              Our Voice
            </AnimatedText>
            <div className="max-w-3xl mx-auto space-y-6">
              <AnimatedText
                as="p"
                className="text-xl italic mb-8"
                animation="breath-fade-up-2"
              >
                "{SisterBrand.brandVoice.tone}"
              </AnimatedText>
              
              <div className="bg-[#E90064] p-8 rounded-lg">
                <AnimatedText
                  as="h3"
                  className="text-2xl font-bold mb-4"
                  animation="breath-fade-up-3"
                >
                  {SisterBrand.brandVoice.tagline}
                </AnimatedText>
                <AnimatedText
                  as="p"
                  className="text-lg"
                  animation="breath-fade-up-4"
                >
                  {SisterBrand.brandVoice.mission}
                </AnimatedText>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Brand;
