import { PageRoot } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { CAMPAIGN_SUB_PAGE_NAME } from '@/constant';
import { CampaignSubPageGuard } from '../(guards)/CampaignSubPageGuard';
import PromotionsReuseHeader from './(components)/promotions-reuse-header/promotions-reuse-header';
import PromotionsReuseTable from './(components)/promotions-reuse-table/promotions-reuse-table';
import { PromotionsReuseTableSkeleton } from './(components)/promotions-reuse-table/promotions-reuse-table.loading';
import PromotionsReuseLoading from './loading';

interface PromotionsReusePageProps {
  params: Promise<{ id: string }>;
}

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('campaignManagement.promotionsReuse');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

export default async function PromotionsReusePage({ params }: PromotionsReusePageProps) {
  const { id } = await params;
  return (
    <CampaignSubPageGuard
      loader={<PromotionsReuseLoading />}
      campaignSubPageName={CAMPAIGN_SUB_PAGE_NAME.PROMOTIONS_REUSE}
    >
      <PageRoot>
        <PromotionsReuseHeader encodedCampaignId={id} />

        <Suspense fallback={<PromotionsReuseTableSkeleton />}>
          <PromotionsReuseTable encodedCampaignId={id} />
        </Suspense>
      </PageRoot>
    </CampaignSubPageGuard>
  );
}
