'use client';

import { Bell, LogOut, User, Menu, Shield } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
  onToggleSidebar?: () => void;
}

export default function DashboardHeader({ 
  userName = 'User', 
  userRole = 'Citizen',
  onToggleSidebar 
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu Toggle & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3">
              <img 
                src="/LOGO-2.png" 
                alt="Bharat Niyojak" 
                className="h-10 w-auto"
                onError={(e) => {
                  // Fallback to shield icon if logo not found
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <Shield className="w-10 h-10 text-primary-600 hidden" />
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500">{userRole} Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-300">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
