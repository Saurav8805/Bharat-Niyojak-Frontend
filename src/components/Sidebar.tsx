'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  UserCog, 
  Home, 
  PlusCircle, 
  LogOut, 
  User 
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

interface SidebarProps {
  role?: 'super_admin' | 'road_admin' | 'water_admin' | 'electricity_admin' | 'forest_admin' | 'citizen' | 'admin' | string;
  collapsed: boolean;
}

export default function Sidebar({ role, collapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.clear();
    router.push('/login');
  };

  // Navigation items based on role
  const getNavItems = (): NavItem[] => {
    if (role === 'super_admin') {
      return [
        { name: 'Overview', href: '/admin/super', icon: LayoutDashboard },
        { name: 'Manage Admins', href: '/admin/super/admins', icon: UserCog },
        { name: 'All Complaints', href: '/admin/super/complaints', icon: FileText },
        { name: 'Profile', href: '/admin/super/profile', icon: User },
      ];
    }

    if (role === 'admin' || (typeof role === 'string' && role.includes('admin'))) {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Department Issues', href: '/admin/issues', icon: FileText },
        { name: 'Profile', href: '/admin/profile', icon: User },
      ];
    }

    // Default to citizen
    return [
      { name: 'Dashboard', href: '/citizen/dashboard', icon: Home },
      { name: 'Report Issue', href: '/citizen/issues/new', icon: PlusCircle },
      { name: 'My Issues', href: '/citizen/issues', icon: FileText },
      { name: 'Profile', href: '/citizen/profile', icon: User },
    ];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href.includes('?')) return false;
    if (href !== '/' && pathname.startsWith(href + '/')) {
      const hasSpecificMatch = navItems.some(
        (item) => item.href !== href && (pathname === item.href || pathname.startsWith(item.href + '/'))
      );
      return !hasSpecificMatch;
    }
    return false;
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      } flex flex-col h-screen select-none shrink-0`}
    >
      {/* Logo Section */}
      <div className="h-14 px-2.5 sm:px-3 border-b border-gray-200 flex items-center justify-center">
        {collapsed ? (
          <img 
            src="/logo.png" 
            alt="Bharat Niyojak Logo" 
            className="h-9 w-auto object-contain"
          />
        ) : (
          <div className="flex items-center justify-center w-full px-0.5">
            <img 
              src="/logo.png" 
              alt="Bharat Niyojak Logo" 
              className="h-11 sm:h-12 w-auto max-w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-2.5">
        <ul className="space-y-1 px-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-xs font-medium ${
                    active
                      ? 'bg-primary-50 text-primary-700 border border-primary-200 font-semibold shadow-2xs'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/60 hover:border-primary-100 border border-transparent'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'}`} />
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">
                      {item.name}
                    </span>
                  )}
                  {!collapsed && item.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                      active ? 'bg-white text-primary-700' : 'bg-gray-100 text-gray-600'
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
      <div className="p-2.5 border-t border-gray-200">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-gray-600 hover:text-red-600 hover:bg-red-50/70 border border-transparent hover:border-red-100 text-xs font-medium ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Logout</span>}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-gray-200 p-5 max-w-xs w-full text-center animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-100">
              <LogOut className="w-5 h-5 ml-0.5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
              Confirm Logout
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Are you sure you want to log out of your Bharat Niyojak account?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-1.5 px-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-1.5 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition shadow-2xs"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
