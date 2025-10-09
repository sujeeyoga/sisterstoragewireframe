import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Home, ShoppingBag, Users, Heart, Mail, Info, BookOpen, Palette, Gift, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const pages = [
  { title: 'Home', path: '/', icon: Home, description: 'Main landing page with hero and featured products' },
  { title: 'Shop', path: '/shop', icon: ShoppingBag, description: 'Product catalog with filters and categories' },
  { title: 'Our Story', path: '/our-story', icon: Heart, description: 'About the brand and mission' },
  { title: 'Gallery', path: '/gallery', icon: Image, description: 'Product and lifestyle image gallery' },
  { title: 'Blog', path: '/blog', icon: BookOpen, description: 'Articles and stories' },
  { title: 'Contact', path: '/contact', icon: Mail, description: 'Contact form and information' },
  { title: 'Gift', path: '/gift', icon: Gift, description: 'Gift options and bundles' },
  { title: 'Brand Guide', path: '/brand', icon: Palette, description: 'Brand guidelines and design system' },
  { title: 'Community', path: '/community', icon: Users, description: 'Community stories and engagement' },
];

export const PagesManager = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pages</h1>
        <p className="text-muted-foreground">
          View and navigate to all pages in your application
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.path} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <page.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {page.path}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {page.description}
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link to={page.path}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Page
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
