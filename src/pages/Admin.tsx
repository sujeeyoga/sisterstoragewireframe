import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import AdminAnalytics from '@/pages/AdminAnalytics';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { OrderNotificationPopup } from '@/components/admin/OrderNotificationPopup';
import AdminConversionAnalytics from '@/pages/AdminConversionAnalytics';
import AdminVisitorAnalytics from '@/pages/AdminVisitorAnalytics';
import AdminAbandonedCheckouts from '@/pages/AdminAbandonedCheckouts';
import AdminActiveCarts from '@/pages/AdminActiveCarts';
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
import { QRCodesManager } from '@/components/admin/QRCodesManager';
import Uploads from '@/pages/Uploads';
import { BulkShippingRefundTool } from '@/components/admin/BulkShippingRefundTool';
import AdminShippingAnalytics from '@/pages/AdminShippingAnalytics';
import AdminProfitAnalytics from '@/pages/AdminProfitAnalytics';
import AdminSEOAnalytics from '@/pages/AdminSEOAnalytics';
import { ResendConfirmationEmails } from '@/components/admin/ResendConfirmationEmails';
import { BulkShippingNotificationTool } from '@/components/admin/BulkShippingNotificationTool';
import { ManualCarrierCostEntry } from '@/components/admin/ManualCarrierCostEntry';
import LocationDebugPanel from '@/components/admin/LocationDebugPanel';
import { QuickRateUpdate } from '@/components/admin/QuickRateUpdate';

const Admin = () => {
  const { notification, clearNotification } = useOrderNotifications();
  
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
    <>
      <QuickRateUpdate />
      <AdminLayout>
        <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="analytics/conversion" element={<AdminConversionAnalytics />} />
        <Route path="analytics/visitors" element={<AdminVisitorAnalytics />} />
        <Route path="analytics/abandoned-checkouts" element={<AdminAbandonedCheckouts />} />
        <Route path="analytics/active-carts" element={<AdminActiveCarts />} />
        <Route path="analytics/sales" element={<AdminSalesReports />} />
        <Route path="analytics/products" element={<AdminProductReports />} />
        <Route path="analytics/customers" element={<AdminCustomerReports />} />
        <Route path="analytics/shipping" element={<AdminShippingAnalytics />} />
        <Route path="analytics/profit" element={<AdminProfitAnalytics />} />
        <Route path="analytics/seo" element={<AdminSEOAnalytics />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/resend-emails" element={<AdminLayout><ResendConfirmationEmails /></AdminLayout>} />
        <Route path="orders/shipping-notifications" element={<AdminLayout><BulkShippingNotificationTool /></AdminLayout>} />
        <Route path="orders/carrier-costs" element={<AdminLayout><ManualCarrierCostEntry /></AdminLayout>} />
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
          <Route path="qr-codes" element={<QRCodesManager />} />
          <Route path="waitlist-signups" element={<WaitlistSignups />} />
          <Route path="uploads" element={<Uploads />} />
          <Route path="location-debug" element={<LocationDebugPanel />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>

    {/* Order Notification Popup */}
    {notification && (
      <OrderNotificationPopup
        orderNumber={notification.orderNumber}
        customerName={notification.customerName}
        total={notification.total}
        itemCount={notification.itemCount}
        onClose={clearNotification}
      />
    )}
  </>
  );
};

export default Admin;
