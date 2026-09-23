'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'super_admin') {
          router.replace('/admin/super');
          return;
        } else if (user.role === 'admin' || (user.role && user.role.includes('admin'))) {
          router.replace('/admin/dashboard');
          return;
        }
      } catch (e) {
        // Ignore error
      }
    }

    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
