'use client';

import { Bell, User, Menu, Shield } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

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
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
      <div className="px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Left: Menu Toggle & Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Bharat Niyojak" 
                className="h-7 sm:h-8 w-auto object-contain"
                onError={(e) => {
                  if (e.currentTarget.src.includes('logo.png')) {
                    e.currentTarget.src = '/logo2.png';
                  }
                }}
              />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-gray-900 tracking-tight">
                  भारत नियोजक
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] sm:text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <button className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-2 pl-2.5 border-l border-gray-200">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-900 leading-tight">{userName}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{userRole}</p>
              </div>
              <div className="w-7 h-7 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-600">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
