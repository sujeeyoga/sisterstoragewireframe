import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminVisitorAnalytics from '@/pages/AdminVisitorAnalytics';
import AdminAbandonedCheckouts from '@/pages/AdminAbandonedCheckouts';
import AdminSalesReports from '@/pages/AdminSalesReports';
import AdminProductReports from '@/pages/AdminProductReports';
import AdminCustomerReports from '@/pages/AdminCustomerReports';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductForm } from '@/components/admin/ProductForm';
import { SectionsManager } from '@/components/admin/SectionsManager';
import { AdminSync } from '@/components/admin/AdminSync';
import { CustomersTable } from '@/components/admin/CustomersTable';
import { OrdersList } from '@/components/admin/OrdersList';
import { StoreSettings } from '@/components/admin/StoreSettings';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { VideoUploader } from '@/components/admin/VideoUploader';
import { SisterStoriesManager } from '@/components/admin/SisterStoriesManager';
import { PagesManager } from '@/components/admin/PagesManager';
import { HeroImagesManager } from '@/components/admin/HeroImagesManager';
import { BulkImageOptimizer } from '@/components/admin/BulkImageOptimizer';
import ImageMigrationTool from '@/components/admin/ImageMigrationTool';
import { StallionDashboard } from '@/components/admin/StallionDashboard';
import ShippingSettings from '@/components/admin/ShippingSettings';
import { TextsManager } from '@/components/admin/TextsManager';
import { QuickOptimizer } from '@/components/admin/QuickOptimizer';
import { ShippingZonesManager } from '@/components/admin/ShippingZonesManager';
import LaunchCardsManager from '@/components/admin/LaunchCardsManager';
import WaitlistSignups from '@/components/admin/WaitlistSignups';
import Uploads from '@/pages/Uploads';
import { BulkShippingRefundTool } from '@/components/admin/BulkShippingRefundTool';

const Admin = () => {
  // TODO: Re-enable admin role check when ready
  // const { data: hasAdminRole, isLoading } = useQuery({
  //   queryKey: ['user-role'],
  //   queryFn: async () => {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (!user) return false;
  //     const { data } = await supabase
  //       .from('user_roles')
  //       .select('role')
  //       .eq('user_id', user.id)
  //       .eq('role', 'admin')
  //       .single();
  //     return !!data;
  //   },
  // });

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="analytics/visitors" element={<AdminVisitorAnalytics />} />
        <Route path="analytics/abandoned-checkouts" element={<AdminAbandonedCheckouts />} />
        <Route path="analytics/sales" element={<AdminSalesReports />} />
        <Route path="analytics/products" element={<AdminProductReports />} />
        <Route path="analytics/customers" element={<AdminCustomerReports />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="products" element={<ProductsTable />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="customers" element={<CustomersTable />} />
        <Route path="shipping" element={<StallionDashboard />} />
        <Route path="shipping-settings" element={<ShippingSettings />} />
        <Route path="shipping-zones" element={<ShippingZonesManager />} />
        <Route path="bulk-shipping-refund" element={<BulkShippingRefundTool />} />
        <Route path="sections" element={<SectionsManager />} />
        <Route path="pages" element={<PagesManager />} />
        <Route path="texts" element={<TextsManager />} />
        <Route path="hero-images" element={<HeroImagesManager />} />
        <Route path="optimize-images" element={<BulkImageOptimizer />} />
        <Route path="quick-optimize" element={<QuickOptimizer />} />
        <Route path="migrate-images" element={<ImageMigrationTool />} />
        <Route path="sync" element={<AdminSync />} />
        <Route path="admin-settings" element={<AdminSettings />} />
        <Route path="store-settings" element={<StoreSettings />} />
        <Route path="images" element={<ImageUploader />} />
        <Route path="videos" element={<VideoUploader />} />
          <Route path="sister-stories" element={<SisterStoriesManager />} />
          <Route path="launch-cards" element={<LaunchCardsManager />} />
          <Route path="waitlist-signups" element={<WaitlistSignups />} />
          <Route path="uploads" element={<Uploads />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
