import BaseLayout from '@/components/layout/BaseLayout';
import { EnhancedScrollFade } from '@/components/ui/enhanced-scroll-fade';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { useSiteTexts } from '@/hooks/useSiteTexts';
import { EditableText } from '@/components/admin/EditableText';

const Contact = () => {
  const { texts: heroTexts } = useSiteTexts('contact_hero');
  const { texts: phoneTexts } = useSiteTexts('contact_phone');
  const { texts: locationTexts } = useSiteTexts('contact_location');
  
  const heroText = heroTexts as any;
  const phoneText = phoneTexts as any;
  const locationText = locationTexts as any;
  
  return (
    <BaseLayout>
      <main className="min-h-screen bg-background">
        <div className="container-custom py-16 px-4">
          <EnhancedScrollFade>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-primary font-medium">Get in Touch</span>
                {heroText && (
                  <>
                    <EditableText
                      siteTextId={heroText.id}
                      field="title"
                      value={heroText.title}
                      as="h1"
                      className="text-4xl md:text-5xl font-bold mt-2 mb-4"
                    />
                    <EditableText
                      siteTextId={heroText.id}
                      field="description"
                      value={heroText.description}
                      as="p"
                      className="text-muted-foreground max-w-2xl mx-auto"
                    />
                  </>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Send us a Message
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">First Name</label>
                        <Input placeholder="Your first name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Last Name</label>
                        <Input placeholder="Your last name" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input type="email" placeholder="your.email@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input placeholder="How can we help you?" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea 
                        placeholder="Tell us more about your inquiry..." 
                        className="min-h-32"
                      />
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-6">
                  {phoneText && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-primary" />
                          <EditableText
                            siteTextId={phoneText.id}
                            field="title"
                            value={phoneText.title}
                            as="span"
                          />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <EditableText
                          siteTextId={phoneText.id}
                          field="subtitle"
                          value={phoneText.subtitle}
                          as="p"
                          className="font-semibold text-lg mb-2"
                        />
                        <EditableText
                          siteTextId={phoneText.id}
                          field="description"
                          value={phoneText.description}
                          as="p"
                          className="text-muted-foreground whitespace-pre-line"
                        />
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Email Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium">General Inquiries</p>
                        <p className="text-muted-foreground">hello@sisterstorage.com</p>
                      </div>
                      <div>
                        <p className="font-medium">Order Support</p>
                        <p className="text-muted-foreground">orders@sisterstorage.com</p>
                      </div>
                      <div>
                        <p className="font-medium">Wholesale & Partnerships</p>
                        <p className="text-muted-foreground">wholesale@sisterstorage.com</p>
                      </div>
                    </CardContent>
                  </Card>

                  {locationText && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          Our Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <EditableText
                          siteTextId={locationText.id}
                          field="title"
                          value={locationText.title}
                          as="p"
                          className="font-medium mb-2"
                        />
                        <EditableText
                          siteTextId={locationText.id}
                          field="description"
                          value={locationText.description}
                          as="p"
                          className="text-muted-foreground whitespace-pre-line"
                        />
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Response Times
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Email:</span> Within 24 hours</p>
                      <p><span className="font-medium">Phone:</span> Immediate during business hours</p>
                      <p><span className="font-medium">Live Chat:</span> 2-5 minutes (when available)</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </EnhancedScrollFade>
        </div>
      </main>
    </BaseLayout>
  );
};

export default Contact;