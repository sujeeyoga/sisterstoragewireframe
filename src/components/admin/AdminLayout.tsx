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
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <header className="h-14 border-b bg-background flex items-center px-4 fixed top-0 left-0 right-0 z-50 md:sticky md:z-10">
            <SidebarTrigger className="mr-1">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <Link to="/admin">
              <Logo size="sm" />
            </Link>
          </header>
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden pt-14 md:pt-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
