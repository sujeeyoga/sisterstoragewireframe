import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductForm } from '@/components/admin/ProductForm';
import { SectionsManager } from '@/components/admin/SectionsManager';
import { AdminSync } from '@/components/admin/AdminSync';
import { CustomersTable } from '@/components/admin/CustomersTable';
import { OrdersList } from '@/components/admin/OrdersList';
import { StoreSettings } from '@/components/admin/StoreSettings';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { VideoUploader } from '@/components/admin/VideoUploader';
import { PagesManager } from '@/components/admin/PagesManager';
import { HeroImagesManager } from '@/components/admin/HeroImagesManager';
import { BulkImageOptimizer } from '@/components/admin/BulkImageOptimizer';
import ShippingManager from '@/components/admin/ShippingManager';
import Uploads from '@/pages/Uploads';

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
        <Route index element={<AnalyticsDashboard />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="products" element={<ProductsTable />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="customers" element={<CustomersTable />} />
        <Route path="shipping" element={<ShippingManager />} />
        <Route path="sections" element={<SectionsManager />} />
        <Route path="pages" element={<PagesManager />} />
        <Route path="hero-images" element={<HeroImagesManager />} />
        <Route path="optimize-images" element={<BulkImageOptimizer />} />
        <Route path="sync" element={<AdminSync />} />
        <Route path="settings" element={<StoreSettings />} />
        <Route path="images" element={<ImageUploader />} />
        <Route path="videos" element={<VideoUploader />} />
        <Route path="uploads" element={<Uploads />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
