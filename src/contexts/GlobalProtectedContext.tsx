'use client';

import {
  BRAND_ID_COOKIE_NAME,
  IS_IMPERSONATING_COOKIE_NAME,
  PROTECTED_ROOT_ROUTE,
  PSP_ID_COOKIE_NAME,
  STORE_ID_COOKIE_NAME,
  TopbarEntity,
  USER_ROLE_COOKIE_NAME,
} from '@/constant';
import {
  CurrentUserResponse,
  GET_CURRENT_USER,
  GET_IMPERSONATION_STATUS,
  GET_ROLES_LIST,
  type GetImpersonationStatusResponse,
  RolesListResponse,
  START_IMPERSONATION,
  type StartImpersonationResponse,
  type StartImpersonationVariables,
  STOP_IMPERSONATION,
  type StopImpersonationResponse,
} from '@/graphql';
import { getCookie } from '@/lib/utils';
import { BrandType, PSPType, RoleType, StoreType, UserType } from '@/types';
import { ApolloClient, OperationVariables } from '@apollo/client';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

/* ─── Types ─── */
interface GlobalProtectedContextValue {
  allRoles: RoleType[];
  currentUserData?: CurrentUserResponse;
  isCurrentUserDataLoading: boolean;
  /** The current user's selected PSP ID.
   * Seeded from the PSP_ID cookie server-side (fast, no waterfall),
   * then confirmed/updated once the `me` query resolves client-side. */
  selectedPspId?: string;
  /** The current user's selected Brand ID.
   * Seeded from the BRAND_ID cookie server-side (fast, no waterfall),
   * then confirmed/updated once the `me` query resolves client-side. */
  selectedBrandId?: string;
  /** The current user's selected Store ID.
   * Seeded from the STORE_ID cookie server-side (fast, no waterfall),
   * then confirmed/updated once the `me` query resolves client-side. */
  selectedStoreId?: string;
  /** Whether the current session is impersonating another user. */
  isImpersonating: boolean;
  /** The user being impersonated (target). */
  impersonatedUser?: UserType;
  /** The original admin who initiated impersonation. */
  impersonatorUser?: UserType;
  /** Start impersonating a target user. Redirects to dashboard on success. */
  startImpersonation: (targetUserId: string) => Promise<void>;
  /** Stop the active impersonation session. Redirects to dashboard on success. */
  stopImpersonation: () => Promise<void>;
  /** True while a start/stop impersonation mutation is in flight. */
  isImpersonationLoading: boolean;

  /** The current user's role, read from cookies for immediate access. */
  currentUserRole: string;
  /** All PSPs the current user is assigned to (from the ME query). */
  availablePsps: PSPType[];
  /** All Brands the current user is assigned to (from the ME query). */
  availableBrands: BrandType[];
  /** All Stores the current user is assigned to (from the ME query). */
  availableStores: StoreType[];
  /**
   * Switch the active entity. Sets the entity cookie, cascade-clears child
   * entity cookies, and forces a full page reload to the dashboard so the
   * server receives the updated cookie context.
   */
  switchEntity: (entityType: TopbarEntity, entityId: string) => void;

  /** Refetch the current user data from the ME API. Useful to sync latest data after updates. */
  refetchCurrentUser: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloClient.QueryResult<CurrentUserResponse>>;
}

/* ─── Context ─── */
const GlobalProtectedContext = createContext<GlobalProtectedContextValue | null>(null);

/* ─── Provider Props ─── */
interface GlobalProtectedProviderProps {
  children: ReactNode;
  /** Server-side seed: value of the PSP_ID, BRAND_ID, and STORE_ID cookies read in the layout.
   * Passed straight into context so child components have it on first render
   * without waiting for the Apollo `me` query to complete. */
  initialEntityData?: {
    initialSelectedPspId?: string;
    initialSelectedBrandId?: string;
    initialSelectedStoreId?: string;
  };
  /** Server-side seed: the USER_ROLE cookie value read in the layout.
   * Prevents hydration mismatches in Client Components that derive column
   * visibility / capabilities from the current user's role. */
  initialUserRole?: string;
  /** Server-side seed: the IS_IMPERSONATING cookie value read in the layout.
   * Prevents the impersonation banner from flickering on hard refresh
   * by providing the initial value before GET_IMPERSONATION_STATUS resolves. */
  initialIsImpersonating?: boolean;
}

/* ─── Provider ─── */
export function GlobalProtectedProvider({
  children,
  initialEntityData,
  initialUserRole,
  initialIsImpersonating,
}: GlobalProtectedProviderProps) {
  const router = useRouter();
  const client = useApolloClient();
  const t = useTranslations('common.impersonation');
  const { data: rolesData, refetch: refetchRoles } = useQuery<RolesListResponse>(GET_ROLES_LIST);
  const {
    data: currentUserData,
    loading: isCurrentUserDataLoading,
    refetch: refetchCurrentUser,
  } = useQuery<CurrentUserResponse>(GET_CURRENT_USER);
  const { data: impersonationData, refetch: refetchImpersonationStatus } =
    useQuery<GetImpersonationStatusResponse>(GET_IMPERSONATION_STATUS);

  const [isImpersonationLoading, setIsImpersonationLoading] = useState(false);

  const currentUserRole = getCookie(USER_ROLE_COOKIE_NAME) ?? initialUserRole ?? '';
  const selectedPspId = getCookie(PSP_ID_COOKIE_NAME);
  const selectedBrandId = getCookie(BRAND_ID_COOKIE_NAME);
  const selectedStoreId = getCookie(STORE_ID_COOKIE_NAME);

  const [startImpersonationMutation] = useMutation<
    StartImpersonationResponse,
    StartImpersonationVariables
  >(START_IMPERSONATION);

  const [stopImpersonationMutation] = useMutation<StopImpersonationResponse>(STOP_IMPERSONATION);

  const isImpersonating =
    impersonationData !== undefined
      ? !!impersonationData.impersonationStatus?.isImpersonating
      : (initialIsImpersonating ?? false);
  const impersonatedUser = impersonationData?.impersonationStatus?.targetUser;
  const impersonatorUser = impersonationData?.impersonationStatus?.impersonator;

  const updateCookiesFromUser = useCallback((user: UserType | undefined) => {
    if (!user) return;

    const setCookie = (name: string, value: string) => {
      document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    };
    const clearCookie = (name: string) => {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    };

    const role = user.roles?.[0]?.name;
    if (role) setCookie(USER_ROLE_COOKIE_NAME, role);

    const pspId = user.psps?.[0]?.id;
    if (pspId) setCookie(PSP_ID_COOKIE_NAME, pspId);
    else clearCookie(PSP_ID_COOKIE_NAME);

    const brandId = user.brands?.[0]?.id;
    if (brandId) setCookie(BRAND_ID_COOKIE_NAME, brandId);
    else clearCookie(BRAND_ID_COOKIE_NAME);

    const storeId = user.stores?.[0]?.id;
    if (storeId) setCookie(STORE_ID_COOKIE_NAME, storeId);
    else clearCookie(STORE_ID_COOKIE_NAME);
  }, []);

  const startImpersonation = useCallback(
    async (targetUserId: string) => {
      setIsImpersonationLoading(true);
      try {
        const { data } = await startImpersonationMutation({
          variables: { input: { targetUserId } },
        });

        if (data?.startImpersonation.success) {
          // Refetch impersonation status so the banner appears
          const { data: impersonationResult } = await refetchImpersonationStatus();

          // Refetch current user to sync latest data
          await refetchCurrentUser();

          // Refetch roles list to update any role-based UI changes (e.g., column visibility)
          await refetchRoles();

          // Immediately sync cookies from the impersonated (target) user
          updateCookiesFromUser(impersonationResult?.impersonationStatus?.targetUser);

          // Set impersonation cookie so server components can access it
          document.cookie = `${IS_IMPERSONATING_COOKIE_NAME}=true; path=/; max-age=31536000; SameSite=Lax`;

          toast.success(t('startSuccess'));

          //  Clear all cached data and reload with the new user's context

          await client.clearStore();
          router.push(PROTECTED_ROOT_ROUTE);
          router.refresh();
        }
      } finally {
        setIsImpersonationLoading(false);
      }
    },
    [
      startImpersonationMutation,
      refetchImpersonationStatus,
      refetchCurrentUser,
      refetchRoles,
      updateCookiesFromUser,
      t,
      client,
      router,
    ],
  );

  const stopImpersonation = useCallback(async () => {
    setIsImpersonationLoading(true);
    try {
      const { data } = await stopImpersonationMutation();

      if (data?.stopImpersonation.success) {
        // Immediately sync cookies from the original admin (impersonator)
        updateCookiesFromUser(impersonationData?.impersonationStatus?.impersonator);

        // Clear impersonation cookie
        document.cookie = `${IS_IMPERSONATING_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;

        // Using window.location.href to force a full reload and bypass Apollo cache, ensuring all state is reset.
        window.location.href = PROTECTED_ROOT_ROUTE;
      }
    } finally {
      setIsImpersonationLoading(false);
    }
  }, [stopImpersonationMutation, impersonationData, updateCookiesFromUser]);

  /**
   * Switch the active entity. Sets the chosen entity ID cookie, cascade-clears
   * child entity cookies (PSP → clears Brand + Store; Brand → clears Store),
   * then forces a full page reload to the dashboard so the server re-renders
   * with the updated cookie context and Apollo cache is fully reset.
   */
  const switchEntity = useCallback((entityType: TopbarEntity, entityId: string) => {
    const setCookie = (name: string, value: string) => {
      document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    };
    const clearCookie = (name: string) => {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    };

    if (entityType === TopbarEntity.PSP) {
      setCookie(PSP_ID_COOKIE_NAME, entityId);
      clearCookie(BRAND_ID_COOKIE_NAME);
      clearCookie(STORE_ID_COOKIE_NAME);
    } else if (entityType === TopbarEntity.BRAND) {
      setCookie(BRAND_ID_COOKIE_NAME, entityId);
      clearCookie(STORE_ID_COOKIE_NAME);
    } else {
      setCookie(STORE_ID_COOKIE_NAME, entityId);
    }

    window.location.href = PROTECTED_ROOT_ROUTE;
  }, []);

  // Sync the IS_IMPERSONATING cookie whenever GET_IMPERSONATION_STATUS resolves.
  // If the API says we are impersonating, set the cookie; otherwise clear it.
  // This mirrors how entity cookies are validated against the ME API data.
  useEffect(() => {
    if (!impersonationData) return;

    const apiIsImpersonating = !!impersonationData.impersonationStatus?.isImpersonating;
    const cookieIsImpersonating = getCookie(IS_IMPERSONATING_COOKIE_NAME) === 'true';

    if (apiIsImpersonating && !cookieIsImpersonating) {
      document.cookie = `${IS_IMPERSONATING_COOKIE_NAME}=true; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    } else if (!apiIsImpersonating && cookieIsImpersonating) {
      document.cookie = `${IS_IMPERSONATING_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
      router.refresh();
    }
  }, [impersonationData, router]);

  // Validate entity cookies against resolved ME API data.
  // If a stored cookie ID is not found in the ME entity array (stale/tampered),
  // it is reset to the first element and the page is soft-refreshed so server
  // components re-render with the corrected cookie.
  useEffect(() => {
    if (isCurrentUserDataLoading) return;

    let shouldRefresh = false;

    const setCookie = (name: string, value: string) => {
      document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
      shouldRefresh = true;
    };
    const clearCookie = (name: string) => {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
      shouldRefresh = true;
    };

    // 1. User Role
    const updatedUserRole = currentUserData?.me?.roles?.[0]?.name;
    if (updatedUserRole) {
      const currentRoleCookie = getCookie(USER_ROLE_COOKIE_NAME);
      if (currentRoleCookie !== updatedUserRole) {
        setCookie(USER_ROLE_COOKIE_NAME, updatedUserRole);
      }
    }

    // 2. Entity IDs — validate that the stored cookie ID exists in the ME array.
    // If not (e.g., user was unassigned or cookie was tampered), reset to [0].
    const validateEntityCookie = (cookieName: string, entities: { id: string }[] | undefined) => {
      const currentCookie = getCookie(cookieName);
      const ids = entities?.map((e) => e.id) ?? [];

      if (ids.length === 0) {
        if (currentCookie) clearCookie(cookieName);
        return;
      }

      if (!currentCookie || !ids.includes(currentCookie)) {
        setCookie(cookieName, ids[0]);
      }
    };

    validateEntityCookie(PSP_ID_COOKIE_NAME, currentUserData?.me?.psps);
    validateEntityCookie(BRAND_ID_COOKIE_NAME, currentUserData?.me?.brands);
    validateEntityCookie(STORE_ID_COOKIE_NAME, currentUserData?.me?.stores);

    if (shouldRefresh) {
      router.refresh();
    }
  }, [currentUserData, isCurrentUserDataLoading, router]);

  return (
    <GlobalProtectedContext.Provider
      value={{
        allRoles: rolesData?.rolesList ?? [],
        currentUserData,
        isCurrentUserDataLoading,
        selectedPspId: selectedPspId ?? initialEntityData?.initialSelectedPspId,
        selectedBrandId: selectedBrandId ?? initialEntityData?.initialSelectedBrandId,
        selectedStoreId: selectedStoreId ?? initialEntityData?.initialSelectedStoreId,
        availablePsps: currentUserData?.me?.psps ?? [],
        availableBrands: currentUserData?.me?.brands ?? [],
        availableStores: currentUserData?.me?.stores ?? [],
        isImpersonating,
        impersonatedUser,
        impersonatorUser,
        startImpersonation,
        stopImpersonation,
        isImpersonationLoading,
        currentUserRole,
        switchEntity,
        refetchCurrentUser,
      }}
    >
      {children}
    </GlobalProtectedContext.Provider>
  );
}

/* ─── Hook ─── */
export function useGlobalProtected() {
  const context = useContext(GlobalProtectedContext);

  if (!context) {
    throw new Error('useGlobalProtected must be used within GlobalProtectedProvider');
  }

  return context;
}
