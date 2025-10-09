import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Layers, AlertCircle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [productsResult, sectionsResult] = await Promise.all([
        supabase.from('woocommerce_products').select('*', { count: 'exact', head: true }),
        supabase.from('shop_sections').select('*', { count: 'exact', head: true }),
      ]);

      const { count: outOfStockCount } = await supabase
        .from('woocommerce_products')
        .select('*', { count: 'exact', head: true })
        .eq('in_stock', false);

      const { data: categories } = await supabase
        .from('woocommerce_products')
        .select('categories');

      const categoryCount = new Set(
        categories?.flatMap(p => (p.categories as any[])?.map(c => c.slug) || [])
      ).size;

      return {
        totalProducts: productsResult.count || 0,
        totalSections: sectionsResult.count || 0,
        outOfStock: outOfStockCount || 0,
        categories: categoryCount,
      };
    },
  });

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts,
      icon: Package,
      link: '/admin/products',
      color: 'text-blue-600',
    },
    {
      title: 'Shop Sections',
      value: stats?.totalSections,
      icon: Layers,
      link: '/admin/sections',
      color: 'text-purple-600',
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStock,
      icon: AlertCircle,
      link: '/admin/products',
      color: 'text-red-600',
    },
    {
      title: 'Categories',
      value: stats?.categories,
      icon: TrendingUp,
      link: '/admin/products',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin panel. Manage products, sections, and sync data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/admin/products">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/admin/sections">
                <Layers className="mr-2 h-4 w-4" />
                Edit Sections
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/admin/sync">
                <TrendingUp className="mr-2 h-4 w-4" />
                Sync WooCommerce
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
