import { LayoutDashboard, Package, Layout, RefreshCw, Settings, Users, ShoppingCart, Image, FolderOpen, FileText, Sparkles, Truck, Video, Film, LogOut, DollarSign, Type, PackageCheck, Mail, TrendingUp, Globe, Ship, QrCode, Wallet, Search, MapPin, Zap, Star } from 'lucide-react';
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
import Logo from '@/components/ui/Logo';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, end: true },
      { title: 'Analytics', url: '/admin/analytics', icon: TrendingUp, end: false },
      { title: 'SEO Analytics', url: '/admin/analytics/seo', icon: Search, end: false },
      { title: 'Profit Analytics', url: '/admin/analytics/profit', icon: Wallet, end: false },
      { title: 'Visitor Analytics', url: '/admin/analytics/visitors', icon: Globe, end: false },
      { title: 'Shipping Analytics', url: '/admin/analytics/shipping', icon: Ship, end: false },
    ]
  },
  {
    label: 'Store',
    items: [
      { title: 'Orders', url: '/admin/orders', icon: ShoppingCart, end: false },
      { title: 'Email Campaigns', url: '/admin/emails', icon: Mail, end: false },
      { title: 'Products', url: '/admin/products', icon: Package, end: false },
      { title: 'Customers', url: '/admin/customers', icon: Users, end: false },
      { title: 'Reviews', url: '/admin/reviews', icon: Star, end: false },
      { title: 'Flash Sales', url: '/admin/flash-sales', icon: Zap, end: false },
      { title: 'Shipping Thresholds', url: '/admin/shipping-thresholds', icon: Truck, end: false },
      { title: 'Bulk Shipping Refund', url: '/admin/bulk-shipping-refund', icon: DollarSign, end: false },
    ]
  },
  {
    label: 'Content',
    items: [
      { title: 'Pages', url: '/admin/pages', icon: FileText, end: false },
      { title: 'Sections', url: '/admin/sections', icon: Layout, end: false },
      { title: 'Site Content', url: '/admin/texts', icon: Type, end: false },
      { title: 'QR Codes', url: '/admin/qr-codes', icon: QrCode, end: false },
    ]
  },
  {
    label: 'Settings',
    items: [
      { title: 'Admin Settings', url: '/admin/admin-settings', icon: Settings, end: false },
      { title: 'Store Settings', url: '/admin/store-settings', icon: Package, end: false },
      { title: 'Email Testing', url: '/admin/email-testing', icon: Mail, end: false },
      { title: 'Location Debug', url: '/admin/location-debug', icon: MapPin, end: false },
    ]
  },
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
    isActive ? 'bg-pink-100 text-pink-600 font-medium border-l-4 border-pink-500' : 'text-muted-foreground hover:bg-muted/50';

  return (
    <Sidebar className={`bg-white border-r border-border ${isCollapsed ? 'w-14' : 'w-60'}`} collapsible="icon">
      <div className="p-4 border-b bg-white flex items-center justify-center">
        <Logo size="sm" onClick={handleNavClick} />
      </div>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!isCollapsed && <SidebarGroupLabel className="text-xs text-muted-foreground">{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.end} 
                        className={getNavCls}
                        onClick={handleNavClick}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
