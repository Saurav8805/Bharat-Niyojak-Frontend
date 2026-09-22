'use client';

/**
 * AuthProvider - Minimal provider, no automatic redirects
 * Auth checks should be done in individual pages
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
