import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductForm } from '@/components/admin/ProductForm';
import { SectionsManager } from '@/components/admin/SectionsManager';
import { AdminSync } from '@/components/admin/AdminSync';

const Admin = () => {
  // Check if user has admin role
  const { data: hasAdminRole, isLoading } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      return !!data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!hasAdminRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsTable />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="sections" element={<SectionsManager />} />
        <Route path="sync" element={<AdminSync />} />
        <Route path="settings" element={<div className="p-8"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
