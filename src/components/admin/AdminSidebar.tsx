import { LayoutDashboard, Package, Layout, RefreshCw, Settings, Users, ShoppingCart, Image, FolderOpen, FileText } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
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
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, end: true },
  { title: 'Orders', url: '/admin/orders', icon: ShoppingCart, end: false },
  { title: 'Products', url: '/admin/products', icon: Package, end: false },
  { title: 'Customers', url: '/admin/customers', icon: Users, end: false },
  { title: 'Sections', url: '/admin/sections', icon: Layout, end: false },
  { title: 'Pages', url: '/admin/pages', icon: FileText, end: false },
  { title: 'WooCommerce Sync', url: '/admin/sync', icon: RefreshCw, end: false },
  { title: 'Settings', url: '/admin/settings', icon: Settings, end: false },
  { title: 'Images', url: '/admin/images', icon: Image, end: false },
  { title: 'Uploads', url: '/admin/uploads', icon: FolderOpen, end: false },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-pink-50 text-pink-700 font-medium' : 'text-muted-foreground hover:bg-muted/50';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <div className="p-4 border-b">
        {!isCollapsed && (
          <h2 className="text-xl font-bold">Admin Panel</h2>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.end} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
