'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Bell,
  Building2,
  UserCog,
  ClipboardList,
  FolderKanban,
  Home,
  PlusCircle,
  History,
  Shield,
  Activity,
  LogOut
} from 'lucide-react';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

interface SidebarProps {
  role: 'super_admin' | 'road_admin' | 'water_admin' | 'electricity_admin' | 'forest_admin' | 'citizen';
  collapsed: boolean;
}

export default function Sidebar({ role, collapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation items based on role
  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'super_admin':
        return [
          { name: 'Overview', href: '/admin/super', icon: LayoutDashboard },
          { name: 'Manage Admins', href: '/admin/super/admins', icon: UserCog },
          { name: 'All Complaints', href: '/admin/super/complaints', icon: FileText },
          { name: 'Department Stats', href: '/admin/super/departments', icon: Building2 },
          { name: 'Analytics', href: '/admin/super/analytics', icon: BarChart3 },
          { name: 'Activity Logs', href: '/admin/super/logs', icon: Activity },
          { name: 'Settings', href: '/admin/super/settings', icon: Settings },
        ];

      case 'road_admin':
      case 'water_admin':
      case 'electricity_admin':
      case 'forest_admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Complaints', href: '/admin/complaints', icon: FileText },
          { name: 'Pending', href: '/admin/complaints?status=pending', icon: ClipboardList },
          { name: 'In Progress', href: '/admin/complaints?status=in_progress', icon: FolderKanban },
          { name: 'Resolved', href: '/admin/complaints?status=resolved', icon: Shield },
          { name: 'Statistics', href: '/admin/stats', icon: BarChart3 },
          { name: 'Profile', href: '/admin/profile', icon: Settings },
        ];

      case 'citizen':
      default:
        return [
          { name: 'Home', href: '/dashboard', icon: Home },
          { name: 'Submit Complaint', href: '/submit-complaint', icon: PlusCircle },
          { name: 'My Complaints', href: '/my-complaints', icon: FileText },
          { name: 'Track Status', href: '/track', icon: Activity },
          { name: 'History', href: '/history', icon: History },
          { name: 'Notifications', href: '/notifications', icon: Bell },
          { name: 'Profile', href: '/profile', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === pathname) return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } flex flex-col h-screen`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-center">
        {collapsed ? (
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img 
              src="/LOGO-2.png" 
              alt="Bharat Niyojak" 
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback if image not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden">
              <Shield className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Bharat Niyojak</h2>
              <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    active
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
                  {!collapsed && (
                    <span className="flex-1 text-left font-medium text-sm">
                      {item.name}
                    </span>
                  )}
                  {!collapsed && item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      active ? 'bg-white text-primary-600' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            localStorage.clear();
            router.push('/login');
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-red-600 hover:bg-red-50 ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-left font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
