'use client';

import { PUBLIC_ROOT_ROUTE } from '@/constant';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Client-side authentication guard for protected routes
 *
 * This component runs on every navigation (including back/forward buttons)
 * to ensure authenticated access. It's included in the Server Component layout
 * to protect all routes under (protected)/*.
 *
 * Security layers:
 * 1. Middleware (proxy.ts) - Server-side protection for initial requests
 * 2. This AuthGuard - Client-side protection for all navigation types
 * 3. Router Cache staleTimes - Minimizes cache duration
 */
export function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    /**
     * Check for authentication token on every navigation
     * This runs when:
     * - Component mounts (initial load or route change)
     * - User navigates via browser back/forward buttons
     * - User navigates via Link or router.push()
     */
    const checkAuth = () => {
      const cookies = document.cookie;
      const hasAccessToken = cookies.includes('accessToken');

      if (!hasAccessToken) {
        // No token found - redirect to login
        const currentPath = window.location.pathname;
        const loginUrl = `${PUBLIC_ROOT_ROUTE}?redirect=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
        // Force a server request to clear any cached data
        router.refresh();
      }
    };

    // Check on mount
    checkAuth();

    // Listen for browser navigation events (back/forward buttons)
    window.addEventListener('popstate', checkAuth);

    return () => {
      window.removeEventListener('popstate', checkAuth);
    };
  }, [router]);

  // This component doesn't render anything - it's just for the side effect
  return null;
}
