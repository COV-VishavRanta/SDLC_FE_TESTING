'use client';

import { Permission } from '@/constant/enums/permissions.enum';
import { usePermissions } from '@/hooks';
import type { ReactNode } from 'react';

interface PermissionGateProps {
  /** Single permission that must be satisfied */
  permission?: Permission;
  /** Multiple permissions — behaviour controlled by `match` */
  permissions?: Permission[];
  /** When `permissions` is provided, require "all" (default) or "any" */
  match?: 'all' | 'any';
  /** Content rendered when the user has the required permission(s) */
  children: ReactNode;
  /** Optional fallback rendered when access is denied (defaults to nothing) */
  fallback?: ReactNode;
}

/**
 * Conditionally renders children based on the current user's permissions.
 *
 * @example
 * ```tsx
 * <PermissionGate permission={Permission.VIEW_USER_MANAGEMENT}>
 *   <UserManagementSection />
 * </PermissionGate>
 *
 * <PermissionGate
 *   permissions={[Permission.VIEW_AUDIT_LOGS, Permission.VIEW_PSP_MANAGEMENT]}
 *   match="any"
 *   fallback={<NoAccessBanner />}
 * >
 *   <AdminPanel />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  permission,
  permissions,
  match = 'all',
  children,
  fallback = null,
}: PermissionGateProps) {
  const { has, hasAll, hasAny } = usePermissions();

  let allowed = false;

  if (permission) {
    allowed = has(permission);
  } else if (permissions) {
    allowed = match === 'all' ? hasAll(permissions) : hasAny(permissions);
  }

  return allowed ? <>{children}</> : <>{fallback}</>;
}
