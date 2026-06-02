import { Permission } from '@/constant/enums/permissions.enum';
import { UserRole } from '@/constant/enums/user.enums';
import { PROTECTED_ROUTES } from '@/constant/route';

export * from './capabilities/campaign.capabilities';
export * from './capabilities/capabilities';
export * from './capabilities/exception-request.capabilities';
export * from './capabilities/shipment.capabilities';
export * from './capabilities/survey.capabilities';

/**
 * Role-based access control (RBAC) definitions and helpers.
 *
 * Route-to-permission associations are co-located with the route definitions
 * in `src/constant/route.ts` (the `permission` field on each PROTECTED_ROUTES entry).
 * This module owns the role→permission grants and the helper functions used by
 * the Edge middleware (proxy.ts) and client/server components.
 */

// ─── Role → Permissions ───────────────────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.PLATFORM_ADMIN]: [
    Permission.VIEW_USER_MANAGEMENT,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_PSP_MANAGEMENT,
    Permission.VIEW_WEB_HOOKS,
    Permission.VIEW_ALERTS,
  ],

  [UserRole.PSP_ADMIN]: [
    Permission.VIEW_BRAND_MANAGEMENT,
    Permission.VIEW_USER_MANAGEMENT,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_CAMPAIGN_MANAGEMENT,
    Permission.VIEW_ALERTS,
    Permission.VIEW_SHIPMENTS,
    Permission.VIEW_INVENTORY_MANAGEMENT,
    Permission.VIEW_SURVEY_MANAGEMENT,
    Permission.VIEW_REPORTS,
    Permission.VIEW_WEB_HOOKS,
  ],
  [UserRole.PRODUCTION_OPERATOR]: [
    Permission.VIEW_CAMPAIGN_MANAGEMENT,
    Permission.VIEW_SHIPMENTS,
    Permission.VIEW_INVENTORY_MANAGEMENT,
    Permission.VIEW_ALERTS,
    Permission.VIEW_REPORTS,
  ],

  [UserRole.BRAND_ADMIN]: [
    Permission.VIEW_USER_MANAGEMENT,
    Permission.VIEW_STORE_MANAGEMENT,
    Permission.VIEW_CAMPAIGN_MANAGEMENT,
    Permission.VIEW_SHIPMENTS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_ALERTS,
    Permission.VIEW_SURVEY_MANAGEMENT,
    Permission.VIEW_EXCEPTION_REQUEST,
    Permission.VIEW_REPORTS,
  ],
  [UserRole.CAMPAIGN_MANAGER]: [
    Permission.VIEW_CAMPAIGN_MANAGEMENT,
    Permission.VIEW_SHIPMENTS,
    Permission.VIEW_EXCEPTION_REQUEST,
    Permission.VIEW_ALERTS,
    Permission.VIEW_REPORTS,
  ],

  [UserRole.STORE_ADMIN]: [
    Permission.VIEW_USER_MANAGEMENT,
    Permission.VIEW_CAMPAIGN_MANAGEMENT,
    Permission.VIEW_SHIPMENTS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_ALERTS,
    Permission.VIEW_SURVEY_MANAGEMENT,
    Permission.VIEW_EXCEPTION_REQUEST,
  ],
  [UserRole.STORE_OPERATOR]: [
    Permission.VIEW_CAMPAIGN_MANAGEMENT,
    Permission.VIEW_SHIPMENTS,
    Permission.VIEW_ALERTS,
    Permission.VIEW_SURVEY_MANAGEMENT,
    Permission.VIEW_EXCEPTION_REQUEST,
  ],
  [UserRole.REGIONAL_MANAGER]: [
    Permission.VIEW_CAMPAIGN_MANAGEMENT,
    Permission.VIEW_SHIPMENTS,
    Permission.VIEW_ALERTS,
    Permission.VIEW_SURVEY_MANAGEMENT,
    Permission.VIEW_EXCEPTION_REQUEST,
    Permission.VIEW_REPORTS,
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true when the supplied role holds the given permission.
 * Unknown roles (e.g. a stale cookie value) are treated as having no permissions.
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role as UserRole];
  return permissions?.includes(permission) ?? false;
}

/**
 * Returns the permission required to access the given pathname, or `null`
 * if the route has no specific permission gate (accessible to all authenticated users).
 */
export function getRequiredPermission(pathname: string): Permission | null {
  const match = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.href));
  return match !== undefined && 'permission' in match ? (match.permission as Permission) : null;
}
