import BaseLayout from '@/components/layout/BaseLayout';
import { EnhancedScrollFade } from '@/components/ui/enhanced-scroll-fade';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift as GiftIcon, Heart, Sparkles, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const giftSets = [
  {
    id: 1,
    name: "The Starter Sister Set",
    price: "$89",
    originalPrice: "$125",
    image: "/lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png",
    description: "Perfect for someone starting their organization journey",
    includes: ["2 Jewelry organizers", "1 Small storage box", "Cultural care guide", "Gift wrapping"]
  },
  {
    id: 2,
    name: "The Complete Culture Collection",
    price: "$189",
    originalPrice: "$245",
    image: "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png",
    description: "Our premium set for the organization enthusiast",
    includes: ["4 Premium organizers", "2 Display cases", "Cultural styling tips", "Luxury gift box"]
  },
  {
    id: 3,
    name: "The Sister's Choice Bundle",
    price: "$129",
    originalPrice: "$160",
    image: "/lovable-uploads/e60a5afe-c0c9-4913-bf6a-eff94188c606.png",
    description: "Hand-curated selection by our sister team",
    includes: ["3 Best-selling items", "Surprise cultural accessory", "Personal note", "Beautiful packaging"]
  }
];

const Gift = () => {
  return (
    <BaseLayout>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="container-custom px-4">
            <EnhancedScrollFade>
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <GiftIcon className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">Gift with Culture</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Give the Gift of <span className="text-primary">Organization</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Share the beauty of organized living with thoughtfully curated gift sets that celebrate culture and style.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="px-8">
                    <GiftIcon className="h-4 w-4 mr-2" />
                    Shop Gift Sets
                  </Button>
                  <Button variant="outline" size="lg" className="px-8">
                    Gift Cards Available
                  </Button>
                </div>
              </div>
            </EnhancedScrollFade>
          </div>
        </section>

        {/* Gift Sets */}
        <section className="py-16">
          <div className="container-custom px-4">
            <EnhancedScrollFade>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Curated Gift Collections</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Each gift set is thoughtfully assembled to bring joy, organization, and cultural celebration to your loved ones.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {giftSets.map((giftSet) => (
                  <Card key={giftSet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={giftSet.image} 
                        alt={giftSet.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{giftSet.name}</CardTitle>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Save ${parseInt(giftSet.originalPrice.slice(1)) - parseInt(giftSet.price.slice(1))}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-primary">{giftSet.price}</span>
                        <span className="text-sm line-through text-muted-foreground">{giftSet.originalPrice}</span>
                      </div>
                      <CardDescription>{giftSet.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">What's Included:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {giftSet.includes.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button className="w-full">Add to Cart</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </EnhancedScrollFade>
          </div>
        </section>

        {/* Gift Features */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom px-4">
            <EnhancedScrollFade>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Sister Storage Gifts?</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center border-none shadow-none bg-transparent">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thoughtfully Curated</h3>
                    <p className="text-muted-foreground">
                      Every item is hand-selected by our team to ensure quality, beauty, and cultural significance.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-none shadow-none bg-transparent">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Beautiful Packaging</h3>
                    <p className="text-muted-foreground">
                      Arrives in elegant, reusable packaging that's as beautiful as what's inside.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-none shadow-none bg-transparent">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Cultural Celebration</h3>
                    <p className="text-muted-foreground">
                      Each gift celebrates heritage while bringing practical organization solutions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </EnhancedScrollFade>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container-custom px-4">
            <EnhancedScrollFade>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Give the Perfect Gift?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Can't decide? Our gift cards let your loved ones choose exactly what speaks to them.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/shop">Shop All Gifts</Link>
                  </Button>
                  <Button variant="outline" size="lg">Purchase Gift Card</Button>
                </div>
              </div>
            </EnhancedScrollFade>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
};

export default Gift;