import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ClipboardList,
  User,
  Users,
  FolderOpen,
  HelpCircle,
  BarChart3,
  Shield,
  GraduationCap,
  PieChart,
  Calendar,
  History,
} from 'lucide-react';

const lecturerItems = [
  { title: 'Tổng quan', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Đánh giá', url: '/assessment', icon: ClipboardList },
  { title: 'Tra cứu', url: '/history', icon: History },
  { title: 'Hồ sơ', url: '/profile', icon: User },
];

const adminItems = [
  { title: 'Giảng viên', url: '/admin/staff', icon: Users },
  { title: 'Nhóm', url: '/admin/groups', icon: FolderOpen },
  { title: 'Câu hỏi', url: '/admin/questions', icon: HelpCircle },
  { title: 'Đợt đánh giá', url: '/admin/periods', icon: Calendar },
  { title: 'Kết quả', url: '/admin/results', icon: BarChart3 },
  { title: 'Biểu đồ', url: '/admin/charts', icon: PieChart },
  { title: 'Phân quyền', url: '/admin/roles', icon: Shield },
];

const moderatorItems = [
  { title: 'Nhóm', url: '/admin/groups', icon: FolderOpen },
];

export function AppSidebar() {
  const { isAdmin, isModerator } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-sm">
                Đánh giá chéo
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Evaluation
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Giảng viên
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {lecturerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60">
              Quản trị
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-primary"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {!isAdmin && isModerator && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60">
              Quản lý
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {moderatorItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-primary"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/40 text-center">
            © 2026 Hệ thống đánh giá chéo
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
