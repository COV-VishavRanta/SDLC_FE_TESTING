import { UserRole } from '@/constant/enums/user.enums';

/**
 * Maps each admin role to the role(s) it can impersonate.
 * Only one level down in the hierarchy is allowed.
 */
const IMPERSONATION_TARGETS: Partial<Record<UserRole, UserRole[]>> = {
  [UserRole.PLATFORM_ADMIN]: [UserRole.PSP_ADMIN],
  [UserRole.PSP_ADMIN]: [UserRole.BRAND_ADMIN],
  [UserRole.BRAND_ADMIN]: [UserRole.STORE_ADMIN],
};

/**
 * Returns true when `currentRole` is allowed to impersonate `targetRole`.
 */
export function canImpersonate(currentRole: string, targetRole: string): boolean {
  const targets = IMPERSONATION_TARGETS[currentRole as UserRole];
  return targets?.includes(targetRole as UserRole) ?? false;
}
