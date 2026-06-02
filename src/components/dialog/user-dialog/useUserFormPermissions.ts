import { UserRole } from '@/constant/enums/user.enums';
import { RoleType } from '@/types';

/* ─── Creatable-roles matrix ──────────────────────────────────────────────────
 *  Defines which roles a given admin tier is allowed to assign to new users.
 *  Roles omitted from this map (e.g. BRAND_ADMIN, STORE_ADMIN) are on-hold;
 *  their allowedRoles will be an empty array, causing the role dropdown to be
 *  hidden in the dialog.
 * ─────────────────────────────────────────────────────────────────────────── */
const ALLOWED_CREATABLE_ROLES: Partial<Record<UserRole, UserRole[]>> = {
  [UserRole.PLATFORM_ADMIN]: [UserRole.PLATFORM_ADMIN, UserRole.PSP_ADMIN],
  [UserRole.PSP_ADMIN]: [UserRole.PSP_ADMIN, UserRole.PRODUCTION_OPERATOR, UserRole.BRAND_ADMIN],
  [UserRole.BRAND_ADMIN]: [
    UserRole.BRAND_ADMIN,
    UserRole.CAMPAIGN_MANAGER,
    UserRole.REGIONAL_MANAGER,
    UserRole.STORE_ADMIN,
  ],
  [UserRole.STORE_ADMIN]: [UserRole.STORE_ADMIN, UserRole.STORE_OPERATOR],
};

/* ─── Types ─── */
export interface UserFormPermissions {
  /** Roles the current user is allowed to assign (empty → hide role dropdown) */
  allowedRoles: RoleType[];
  /** Show the PSP dropdown – Platform Admin assigning PSP Admin */
  showPspDropdown: boolean;
  /** Show the Brand dropdown – PSP Admin assigning Brand Admin */
  showBrandDropdown: boolean;
  /** Auto-inject selectedPspId as pspId on submit (PSP Admin creates any user) */
  autoAssignPspId: boolean;
  /** Show the Store dropdown – Brand Admin assigning Regional Manager or Store Admin */
  showStoreDropdown: boolean;
  /** Multi-select stores (Regional Manager) vs single store (Store Admin) */
  isStoreMultiSelect: boolean;
  /** Auto-inject selectedBrandId as brandIds on submit (Brand Admin creates any user) */
  autoAssignBrandId: boolean;
  /** Auto-inject selectedStoreId as storeIds on submit (Store Admin creates users for their store) */
  autoAssignStoreId: boolean;
}

/* ─── Pure helper – no React hooks, easy to unit-test ─── */
export function getUserFormPermissions(
  currentUserRole: string | undefined,
  selectedRoleName: string | undefined,
  allRoles: RoleType[],
): UserFormPermissions {
  const creatableNames = ALLOWED_CREATABLE_ROLES[currentUserRole as UserRole] ?? [];

  const allowedRoles = allRoles.filter(
    (r) => r.assignable && (creatableNames as string[]).includes(r.name),
  );

  const showPspDropdown =
    currentUserRole === UserRole.PLATFORM_ADMIN && selectedRoleName === UserRole.PSP_ADMIN;

  const showBrandDropdown =
    currentUserRole === UserRole.PSP_ADMIN && selectedRoleName === UserRole.BRAND_ADMIN;

  const autoAssignPspId = currentUserRole === UserRole.PSP_ADMIN;

  const showStoreDropdown =
    currentUserRole === UserRole.BRAND_ADMIN &&
    (selectedRoleName === UserRole.REGIONAL_MANAGER || selectedRoleName === UserRole.STORE_ADMIN);

  const isStoreMultiSelect =
    currentUserRole === UserRole.BRAND_ADMIN && selectedRoleName === UserRole.REGIONAL_MANAGER;

  const autoAssignBrandId = currentUserRole === UserRole.BRAND_ADMIN;

  const autoAssignStoreId = currentUserRole === UserRole.STORE_ADMIN;

  return {
    allowedRoles,
    showPspDropdown,
    showBrandDropdown,
    autoAssignPspId,
    showStoreDropdown,
    isStoreMultiSelect,
    autoAssignBrandId,
    autoAssignStoreId,
  };
}
