import { AuditLogsIcon } from '@/components/icons/AuditLogsIcon';
import { BrandsIcon } from '@/components/icons/BrandsIcon';
import { CampaignIcon } from '@/components/icons/CampaignIcon';
import { DashboardIcon } from '@/components/icons/DashboardIcon';
import { InventoryIcon } from '@/components/icons/InventoryIcon';
import { NotificationIcon } from '@/components/icons/NotificationIcon';
import { PSPManagementIcon } from '@/components/icons/PSPManagementIcon';
import { ShipmentsIcon } from '@/components/icons/ShipmentsIcon';
import { StoreIcon } from '@/components/icons/StoreIcon';
import { SurveyIcon } from '@/components/icons/SurveyIcon';
import { UserManagementIcon } from '@/components/icons/UserManagementIcon';

import { ReportsIcon } from '@/components';
import { WebhookIcon } from '@/components/icons/WebhookIcon';
import { Permission } from './enums/permissions.enum';
import { AuthRoute, ProtectedRoute, PublicRoute } from './enums/route.enum';
import { UserRole } from './enums/user.enums';

interface RouteProps {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Permission required to access this route. Omit for routes accessible to all authenticated users. */
  permission?: Permission;
}

export const PROTECTED_ROUTES = [
  {
    name: 'Dashboard',
    href: ProtectedRoute.DASHBOARD,
    icon: DashboardIcon,
  },
  {
    name: 'User Management',
    href: ProtectedRoute.USER_MANAGEMENT,
    icon: UserManagementIcon,
    permission: Permission.VIEW_USER_MANAGEMENT,
  },
  {
    name: 'PSP Management',
    href: ProtectedRoute.PSP_MANAGEMENT,
    icon: PSPManagementIcon,
    permission: Permission.VIEW_PSP_MANAGEMENT,
  },
  {
    name: 'Brand Management',
    href: ProtectedRoute.BRAND_MANAGEMENT,
    icon: BrandsIcon,
    permission: Permission.VIEW_BRAND_MANAGEMENT,
  },
  {
    name: 'Store Management',
    href: ProtectedRoute.STORE_MANAGEMENT,
    icon: StoreIcon,
    permission: Permission.VIEW_STORE_MANAGEMENT,
  },
  {
    name: 'Campaign Management',
    href: ProtectedRoute.CAMPAIGN_MANAGEMENT,
    icon: CampaignIcon,
    permission: Permission.VIEW_CAMPAIGN_MANAGEMENT,
  },
  {
    name: 'Shipments',
    href: ProtectedRoute.SHIPMENTS,
    icon: ShipmentsIcon,
    permission: Permission.VIEW_SHIPMENTS,
  },
  {
    name: 'Inventory Management',
    href: ProtectedRoute.INVENTORY_MANAGEMENT,
    icon: InventoryIcon,
    permission: Permission.VIEW_INVENTORY_MANAGEMENT,
  },
  {
    name: 'Exception Requests',
    href: ProtectedRoute.EXCEPTION_REQUEST,
    icon: AuditLogsIcon,
    permission: Permission.VIEW_EXCEPTION_REQUEST,
  },
  {
    name: 'Audit Logs',
    href: ProtectedRoute.AUDIT_LOGS,
    icon: AuditLogsIcon,
    permission: Permission.VIEW_AUDIT_LOGS,
  },
  {
    name: 'Alerts',
    href: ProtectedRoute.ALERTS,
    icon: NotificationIcon,
    permission: Permission.VIEW_ALERTS,
  },
  {
    name: 'Survey Management',
    href: ProtectedRoute.SURVEY_MANAGEMENT,
    icon: SurveyIcon,
    permission: Permission.VIEW_SURVEY_MANAGEMENT,
  },
  {
    name: 'Reports',
    href: ProtectedRoute.REPORTS,
    icon: ReportsIcon,
    permission: Permission.VIEW_REPORTS,
  },
  {
    name: 'Web Hooks',
    href: ProtectedRoute.WEB_HOOKS,
    icon: WebhookIcon,
    permission: Permission.VIEW_WEB_HOOKS,
  },
] as const satisfies RouteProps[];

export type ProtectedRouteHref = (typeof PROTECTED_ROUTES)[number]['href'];

export const AUTH_ROUTES: RouteProps[] = [
  {
    name: 'Login',
    href: AuthRoute.LOGIN,
  },
];

export const PUBLIC_ROUTES: RouteProps[] = [
  {
    name: 'Root',
    href: PublicRoute.ROOT,
  },
];

export const PUBLIC_ROOT_ROUTE = AuthRoute.LOGIN;
export const PROTECTED_ROOT_ROUTE = ProtectedRoute.DASHBOARD;

/**
 * Per-item sidebar configuration.
 * - `href` must be a valid protected route.
 * - `translationKeyOverride` replaces the default `sidebar.navigation.*` key for this role.
 */
export interface SidebarItemConfig {
  href: ProtectedRouteHref;
  translationKeyOverride?: string;
}

/**
 * Role-specific sidebar ordering and display-name overrides.
 *
 * IMPORTANT: `PROTECTED_ROUTES` and the security layer (proxy.ts, hasPermission)
 * remain the authoritative source for route access control.
 * This config controls *presentation only* — ordering & label per role.
 * Routes missing from this config for a given role are silently omitted.
 * Roles not listed here fall back to the default `PROTECTED_ROUTES` order.
 *
 * Security: hasPermission is still enforced inside `app-sidebar-nav.tsx` for
 * every item in this config to prevent misconfiguration from leaking UI links.
 */
export const ROLE_SIDEBAR_CONFIG: Partial<Record<UserRole, SidebarItemConfig[]>> = {
  [UserRole.PLATFORM_ADMIN]: [
    { href: ProtectedRoute.DASHBOARD },
    { href: ProtectedRoute.USER_MANAGEMENT },
    { href: ProtectedRoute.PSP_MANAGEMENT },
    { href: ProtectedRoute.AUDIT_LOGS },
    { href: ProtectedRoute.WEB_HOOKS },
    { href: ProtectedRoute.ALERTS },
  ],

  [UserRole.PSP_ADMIN]: [
    { href: ProtectedRoute.DASHBOARD },
    { href: ProtectedRoute.USER_MANAGEMENT },
    { href: ProtectedRoute.BRAND_MANAGEMENT },
    { href: ProtectedRoute.CAMPAIGN_MANAGEMENT, translationKeyOverride: 'campaigns' },
    { href: ProtectedRoute.SHIPMENTS },
    { href: ProtectedRoute.INVENTORY_MANAGEMENT },
    { href: ProtectedRoute.SURVEY_MANAGEMENT },
    { href: ProtectedRoute.AUDIT_LOGS },
    { href: ProtectedRoute.WEB_HOOKS },
    { href: ProtectedRoute.REPORTS },
    { href: ProtectedRoute.ALERTS },
  ],
  [UserRole.PRODUCTION_OPERATOR]: [
    { href: ProtectedRoute.DASHBOARD },
    { href: ProtectedRoute.CAMPAIGN_MANAGEMENT, translationKeyOverride: 'campaigns' },
    { href: ProtectedRoute.SHIPMENTS },
    { href: ProtectedRoute.INVENTORY_MANAGEMENT },
    { href: ProtectedRoute.REPORTS },
    { href: ProtectedRoute.ALERTS },
  ],

  [UserRole.BRAND_ADMIN]: [
    { href: ProtectedRoute.DASHBOARD },
    { href: ProtectedRoute.USER_MANAGEMENT },
    { href: ProtectedRoute.STORE_MANAGEMENT },
    { href: ProtectedRoute.CAMPAIGN_MANAGEMENT },
    { href: ProtectedRoute.SHIPMENTS },
    { href: ProtectedRoute.SURVEY_MANAGEMENT },
    { href: ProtectedRoute.EXCEPTION_REQUEST },
    { href: ProtectedRoute.AUDIT_LOGS },
    { href: ProtectedRoute.REPORTS },
    { href: ProtectedRoute.ALERTS },
  ],
  [UserRole.CAMPAIGN_MANAGER]: [
    { href: ProtectedRoute.DASHBOARD },
    { href: ProtectedRoute.CAMPAIGN_MANAGEMENT },
    { href: ProtectedRoute.SHIPMENTS },
    { href: ProtectedRoute.EXCEPTION_REQUEST },
    { href: ProtectedRoute.REPORTS },
    { href: ProtectedRoute.ALERTS },
  ],

  [UserRole.STORE_ADMIN]: [
    { href: ProtectedRoute.DASHBOARD },
    { href: ProtectedRoute.USER_MANAGEMENT },
    { href: ProtectedRoute.CAMPAIGN_MANAGEMENT },
    { href: ProtectedRoute.SHIPMENTS },
    { href: ProtectedRoute.SURVEY_MANAGEMENT },
    { href: ProtectedRoute.EXCEPTION_REQUEST },
    { href: ProtectedRoute.AUDIT_LOGS },
    { href: ProtectedRoute.ALERTS },
  ],
  [UserRole.STORE_OPERATOR]: [
    { href: ProtectedRoute.DASHBOARD },
    { href: ProtectedRoute.CAMPAIGN_MANAGEMENT },
    { href: ProtectedRoute.SHIPMENTS },
    { href: ProtectedRoute.SURVEY_MANAGEMENT },
    { href: ProtectedRoute.EXCEPTION_REQUEST },
    { href: ProtectedRoute.ALERTS },
  ],
  [UserRole.REGIONAL_MANAGER]: [
    { href: ProtectedRoute.DASHBOARD },
    { href: ProtectedRoute.CAMPAIGN_MANAGEMENT },
    { href: ProtectedRoute.SHIPMENTS },
    { href: ProtectedRoute.SURVEY_MANAGEMENT },
    { href: ProtectedRoute.EXCEPTION_REQUEST },
    { href: ProtectedRoute.REPORTS },
    { href: ProtectedRoute.ALERTS },
  ],
};
