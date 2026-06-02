import { PageRoot } from '@/components';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { CampaignSubPageGuard } from '../(guards)/CampaignSubPageGuard';

import { CAMPAIGN_SUB_PAGE_NAME, ProtectedRoute } from '@/constant';
import StoreDistributionForm from './(components)/store-distribution-form';
import StoreDistributionSkeleton from './loading';

interface StoreDistributionPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pId?: string }>;
}

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('campaignManagement.storeDistribution');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

export default async function StoreDistributionPage({
  params,
  searchParams,
}: StoreDistributionPageProps) {
  const { id } = await params;
  const { pId: encodedPromotionId } = await searchParams;

  if (!encodedPromotionId) {
    redirect(ProtectedRoute.DASHBOARD);
  }

  const promotionId = decodeId(encodedPromotionId);
  const campaignId = decodeId(id);

  if (!promotionId || !campaignId) {
    redirect(ProtectedRoute.DASHBOARD);
  }

  return (
    <CampaignSubPageGuard
      loader={<StoreDistributionSkeleton />}
      campaignSubPageName={CAMPAIGN_SUB_PAGE_NAME.STORE_DISTRIBUTION}
    >
      <PageRoot>
        <Suspense fallback={<StoreDistributionSkeleton />}>
          <StoreDistributionForm
            encodedCampaignId={id}
            campaignId={campaignId}
            promotionId={promotionId}
          />
        </Suspense>
      </PageRoot>
    </CampaignSubPageGuard>
  );
}
