import { LayoutDashboard, Package, Layout, RefreshCw, Settings, Users, ShoppingCart, Image, FolderOpen, FileText, Sparkles, Truck, Video, Film, LogOut, DollarSign } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, end: true },
  { title: 'Orders', url: '/admin/orders', icon: ShoppingCart, end: false },
  { title: 'Products', url: '/admin/products', icon: Package, end: false },
  { title: 'Customers', url: '/admin/customers', icon: Users, end: false },
  { title: 'Shipping', url: '/admin/shipping', icon: Truck, end: false },
  { title: 'Shipping Settings', url: '/admin/shipping-settings', icon: DollarSign, end: false },
  { title: 'Sections', url: '/admin/sections', icon: Layout, end: false },
  { title: 'Pages', url: '/admin/pages', icon: FileText, end: false },
  { title: 'Hero Images', url: '/admin/hero-images', icon: Image, end: false },
  { title: 'Optimize Images', url: '/admin/optimize-images', icon: Sparkles, end: false },
  { title: 'WooCommerce Sync', url: '/admin/sync', icon: RefreshCw, end: false },
  { title: 'Settings', url: '/admin/settings', icon: Settings, end: false },
  { title: 'Images', url: '/admin/images', icon: Image, end: false },
  { title: 'Videos', url: '/admin/videos', icon: Video, end: false },
  { title: 'Sister Stories', url: '/admin/sister-stories', icon: Film, end: false },
  { title: 'Uploads', url: '/admin/uploads', icon: FolderOpen, end: false },
];

export function AdminSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCollapsed = state === 'collapsed';

  const handleNavClick = () => {
    // Close sidebar on mobile when nav item is clicked
    setOpenMobile(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/admin-setup');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-pink-50 text-pink-700 font-medium' : 'text-muted-foreground hover:bg-muted/50';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <div className="p-4 border-b">
        {!isCollapsed && (
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.end} 
                      className={getNavCls}
                      onClick={handleNavClick}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="text-xl">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
