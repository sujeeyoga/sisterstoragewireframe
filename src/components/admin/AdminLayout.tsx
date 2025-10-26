import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { Menu } from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-background flex items-center px-4 fixed top-0 left-0 right-0 z-50 gap-3 md:sticky md:z-10">
            <SidebarTrigger className="mr-1">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <Logo size="sm" />
            <Link to="/admin" className="ml-2">
              <h1 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">Admin Dashboard</h1>
            </Link>
          </header>
          <main className="flex-1 overflow-auto pt-14 md:pt-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
