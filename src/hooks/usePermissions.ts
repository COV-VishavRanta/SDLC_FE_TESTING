import { Permission } from '@/constant/enums/permissions.enum';
import { UserRole } from '@/constant/enums/user.enums';
import { useGlobalProtected } from '@/contexts';
import { hasPermission, ROLE_PERMISSIONS } from '@/lib/permissions/route.permissions';
import { useMemo } from 'react';

interface UsePermissionsReturn {
  /** The current user's primary role name (e.g. "Platform Admin") */
  role: string;
  /** All permissions granted to the current role */
  permissions: Permission[];
  /** Check whether the current role holds a specific permission */
  has: (permission: Permission) => boolean;
  /** Check whether the current role holds *every* listed permission */
  hasAll: (permissions: Permission[]) => boolean;
  /** Check whether the current role holds *at least one* of the listed permissions */
  hasAny: (permissions: Permission[]) => boolean;
}

/**
 * Hook that derives the current user's RBAC permissions from `GlobalProtectedContext`.
 *
 * Usage:
 * ```tsx
 * const { has } = usePermissions();
 * if (has(Permission.VIEW_USER_MANAGEMENT)) { ... }
 * ```
 */
export function usePermissions(): UsePermissionsReturn {
  const { currentUserRole } = useGlobalProtected();

  return useMemo(() => {
    const permissions = ROLE_PERMISSIONS[currentUserRole as UserRole] ?? [];

    return {
      role: currentUserRole,
      permissions,
      has: (permission: Permission) => hasPermission(currentUserRole, permission),
      hasAll: (perms: Permission[]) => perms.every((p) => hasPermission(currentUserRole, p)),
      hasAny: (perms: Permission[]) => perms.some((p) => hasPermission(currentUserRole, p)),
    };
  }, [currentUserRole]);
}
