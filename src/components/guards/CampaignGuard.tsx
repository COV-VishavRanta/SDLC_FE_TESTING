'use client';

import { CampaignStatusEnum, EDITABLE_PROMOTION_STATUSES, PROTECTED_ROOT_ROUTE } from '@/constant';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

interface CampaignGuardProps {
  /** Campaign status to check against EDITABLE_PROMOTION_STATUSES */
  status: CampaignStatusEnum | undefined;
  children: ReactNode;
}

/**
 * Guards promotion sub-pages (store-distribution, import-promotions, promotions-reuse)
 * by checking if the campaign status allows editing promotions.
 *
 * If the status is not in EDITABLE_PROMOTION_STATUSES the user is redirected to the
 * dashboard and nothing is rendered.
 */
export function CampaignGuard({ status, children }: CampaignGuardProps) {
  const router = useRouter();
  const isAllowed = EDITABLE_PROMOTION_STATUSES.has(status as CampaignStatusEnum);
  useEffect(() => {
    if (!isAllowed) {
      router.replace(PROTECTED_ROOT_ROUTE);
    }
  }, [isAllowed, router]);

  if (status === undefined) {
    // If status is undefined, we can assume the campaign is still loading.
    // In this case, we render nothing to avoid a flash of the "not allowed" state.
    return null;
  }

  if (!isAllowed) return null;

  return <>{children}</>;
}
