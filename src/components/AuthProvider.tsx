'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthState, getRedirectPath } from '@/lib/auth';

/**
 * AuthProvider - Handles automatic login redirect
 * Checks if user is already logged in and redirects to appropriate dashboard
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for public pages
    const publicPaths = ['/', '/login', '/register', '/about', '/contact', '/features', '/how-it-works'];
    const isPublicPath = publicPaths.some(path => pathname === path);
    
    if (isPublicPath) {
      // If user is logged in and on login page, redirect to dashboard
      if (pathname === '/login' || pathname === '/register') {
        const { isAuthenticated, user } = getAuthState();
        if (isAuthenticated && user) {
          const redirectPath = getRedirectPath(user.role);
          router.replace(redirectPath);
        }
      }
      return;
    }

    // Check authentication for protected routes
    const { isAuthenticated, user } = getAuthState();
    
    if (!isAuthenticated) {
      // Not logged in - redirect to login
      router.replace('/login');
      return;
    }

    // Check if user is accessing correct dashboard
    if (user) {
      const requiredRole = pathname.startsWith('/admin') ? 'admin' : 'citizen';
      
      if (user.role !== requiredRole) {
        // User is on wrong dashboard - redirect to correct one
        const redirectPath = getRedirectPath(user.role);
        router.replace(redirectPath);
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}
