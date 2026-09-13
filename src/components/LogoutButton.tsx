'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { clearAuthState } from '@/lib/auth';

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
  variant?: 'button' | 'link';
}

export default function LogoutButton({ 
  className = '', 
  showIcon = true,
  variant = 'button'
}: LogoutButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    // Clear all authentication data
    clearAuthState();
    
    // Redirect to login
    router.push('/login');
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  const buttonClass = variant === 'button'
    ? `flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all ${className}`
    : `flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors ${className}`;

  return (
    <>
      <button onClick={handleLogout} className={buttonClass}>
        {showIcon && <LogOut className="w-4 h-4" />}
        <span>Logout</span>
      </button>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelLogout}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            
            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
              Confirm Logout
            </h3>
            
            {/* Message */}
            <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
              Are you sure you want to logout? You will need to login again to access your dashboard.
            </p>
            
            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={cancelLogout}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
