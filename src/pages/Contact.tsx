import BaseLayout from '@/components/layout/BaseLayout';
import { EnhancedScrollFade } from '@/components/ui/enhanced-scroll-fade';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <BaseLayout>
      <main className="min-h-screen bg-background">
        <div className="container-custom py-16 px-4">
          <EnhancedScrollFade>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-primary font-medium">Get in Touch</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Contact Our Sister Team</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We're here to help with any questions about our products, orders, or organization tips. 
                  Reach out to our sisterhood of support specialists.
                </p>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        Phone Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-lg mb-2">1-800-SISTERS</p>
                      <p className="text-muted-foreground">Monday-Friday: 8AM-8PM EST</p>
                      <p className="text-muted-foreground">Saturday: 9AM-6PM EST</p>
                      <p className="text-muted-foreground">Sunday: 10AM-4PM EST</p>
                    </CardContent>
                  </Card>

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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Our Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium mb-2">Sister Storage Headquarters</p>
                      <p className="text-muted-foreground">123 Organization Avenue</p>
                      <p className="text-muted-foreground">Culture District</p>
                      <p className="text-muted-foreground">New York, NY 10001</p>
                    </CardContent>
                  </Card>

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