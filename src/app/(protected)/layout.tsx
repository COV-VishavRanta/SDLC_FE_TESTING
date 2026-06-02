import { AuthGuard, IdleTimeoutGuard, ImpersonationBanner, ScrollToTop } from '@/components';
import AppSidebar from '@/components/app-sidebar/app-sidebar';
import AppTopbar from '@/components/app-topbar/app-topbar';
import {
  BRAND_ID_COOKIE_NAME,
  IS_IMPERSONATING_COOKIE_NAME,
  PSP_ID_COOKIE_NAME,
  STORE_ID_COOKIE_NAME,
  USER_ROLE_COOKIE_NAME,
} from '@/constant';
import { GlobalProtectedProvider } from '@/contexts';
import { cookies } from 'next/headers';

/**
 * Protected layout with authentication guard
 *
 * Security layers:
 * 1. Middleware (proxy.ts) - Server-side protection for initial requests
 * 2. AuthGuard - Client-side protection for all navigation types
 *
 * Global data fetching:
 * - Fetches assignable roles at server level for all protected routes
 * - Provides data via GlobalProtectedContext for client components
 * - Reads PSP_ID cookie server-side once for all PSP-admin child routes
 */
export default async function ProtectedRootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const initialSelectedPspId = cookieStore.get(PSP_ID_COOKIE_NAME)?.value;
  const initialSelectedBrandId = cookieStore.get(BRAND_ID_COOKIE_NAME)?.value;
  const initialSelectedStoreId = cookieStore.get(STORE_ID_COOKIE_NAME)?.value;
  const initialUserRole = cookieStore.get(USER_ROLE_COOKIE_NAME)?.value;
  const initialIsImpersonating = cookieStore.get(IS_IMPERSONATING_COOKIE_NAME)?.value === 'true';
  return (
    <GlobalProtectedProvider
      initialEntityData={{
        initialSelectedPspId,
        initialSelectedBrandId,
        initialSelectedStoreId,
      }}
      initialUserRole={initialUserRole}
      initialIsImpersonating={initialIsImpersonating}
    >
      <ScrollToTop />
      <ImpersonationBanner />
      <AppSidebar initialIsImpersonating={initialIsImpersonating}>
        <AuthGuard />
        <IdleTimeoutGuard />

        <AppTopbar />
        {children}
      </AppSidebar>
    </GlobalProtectedProvider>
  );
}
