import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  PROTECTED_ROUTES,
  ProtectedRoute,
  ROLE_SIDEBAR_CONFIG,
  USER_ROLE_COOKIE_NAME,
} from '@/constant';
import { UserRole } from '@/constant/enums/user.enums';
import { getRequiredPermission, hasPermission } from '@/lib/permissions/route.permissions';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { SidebarMobileCloseTrigger } from '../ui/sidebar';
import { AppSideBarNavItem } from './app-sidebar-nav-item';

// Default mapping of route href to translation key
const ROUTE_TRANSLATION_KEYS: Record<string, string> = {
  [ProtectedRoute.DASHBOARD]: 'dashboard',
  [ProtectedRoute.USER_MANAGEMENT]: 'userManagement',
  [ProtectedRoute.PSP_MANAGEMENT]: 'pspManagement',
  [ProtectedRoute.BRAND_MANAGEMENT]: 'brandManagement',
  [ProtectedRoute.STORE_MANAGEMENT]: 'storeManagement',
  [ProtectedRoute.CAMPAIGN_MANAGEMENT]: 'campaignManagement',
  [ProtectedRoute.SHIPMENTS]: 'shipments',
  [ProtectedRoute.AUDIT_LOGS]: 'auditLogs',
  [ProtectedRoute.ALERTS]: 'alerts',
  [ProtectedRoute.INVENTORY_MANAGEMENT]: 'inventoryManagement',
  [ProtectedRoute.SURVEY_MANAGEMENT]: 'surveyManagement',
  [ProtectedRoute.EXCEPTION_REQUEST]: 'exceptionRequests',
  [ProtectedRoute.REPORTS]: 'reports',
};

export async function AppSidebarNav({
  initialIsImpersonating,
}: {
  initialIsImpersonating: boolean;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get(USER_ROLE_COOKIE_NAME)?.value ?? '';
  const t = await getTranslations('sidebar.navigation');

  const roleConfig = ROLE_SIDEBAR_CONFIG[role as UserRole];

  // Build the sidebar nav items.
  // If ROLE_SIDEBAR_CONFIG defines an ordered list for this role, use it — this
  // allows per-role ordering and display-name overrides (translationKeyOverride).
  // hasPermission is re-applied here as a UI safety guard against misconfiguration.
  // Roles without a config entry fall back to the default PROTECTED_ROUTES order.
  const allowedRoutes = roleConfig
    ? roleConfig
        .filter((item) => {
          const requiredPermission = getRequiredPermission(item.href);
          return requiredPermission === null || hasPermission(role, requiredPermission);
        })
        .map((item) => {
          const route = PROTECTED_ROUTES.find((r) => r.href === item.href);
          const translationKey = item.translationKeyOverride ?? ROUTE_TRANSLATION_KEYS[item.href];
          return {
            href: item.href,
            name: route?.name ?? item.href,
            displayName: translationKey ? t(translationKey as never) : (route?.name ?? item.href),
            icon: route?.icon ? (
              <route.icon className='size-5 shrink-0 group-data-[collapsible=icon]:size-5' />
            ) : undefined,
          };
        })
    : PROTECTED_ROUTES.filter((route) => {
        const requiredPermission = getRequiredPermission(route.href);
        return requiredPermission === null || hasPermission(role, requiredPermission);
      }).map((route) => ({
        href: route.href,
        name: route.name,
        displayName: ROUTE_TRANSLATION_KEYS[route.href]
          ? t(ROUTE_TRANSLATION_KEYS[route.href] as never)
          : route.name,
        // Render the icon on the server — functions cannot be passed to Client Components
        icon: route.icon ? (
          <route.icon className='size-5 shrink-0 group-data-[collapsible=icon]:size-5' />
        ) : undefined,
      }));

  return (
    <Sidebar
      collapsible='icon'
      className={cn(initialIsImpersonating ? 'h-[calc(100vh-60px)] top-[60px]' : 'h-screen')}
    >
      {/* Desktop header: logo */}
      <SidebarHeader className='hidden wide:flex h-16 justify-center  px-5 py-0'>
        <Image
          src='/logo.svg'
          alt='POPLogic'
          width={163}
          height={43}
          priority
          className='transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden'
        />
        <Image
          src='/logo-small.svg'
          alt='PL'
          width={40}
          height={40}
          priority
          className='hidden transition-opacity duration-200 group-data-[collapsible=icon]:block group-data-[collapsible=icon]:opacity-100'
        />
      </SidebarHeader>

      {/* Mobile header: close button aligned right */}
      <SidebarHeader className='flex h-14 flex-row items-center justify-end border-b border-sidebar-border px-4 py-0 wide:hidden'>
        <SidebarMobileCloseTrigger />
      </SidebarHeader>

      <SidebarContent className='border-t border-r border-[var(--neutral-300)] pt-4'>
        <SidebarGroup className='p-0'>
          <SidebarGroupContent>
            <SidebarMenu className='gap-0'>
              {allowedRoutes.map((item) => (
                <AppSideBarNavItem key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Toggle Trigger for desktop */}
      <div className='absolute right-[0] top-1/2 -translate-y-1/2 z-10'>
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
}
