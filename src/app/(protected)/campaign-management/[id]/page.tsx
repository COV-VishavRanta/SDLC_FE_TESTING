import { PageRoot, SectionErrorBoundary } from '@/components';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { CampaignDetailHeader } from './(components)/campaign-detail-header/campaign-detail-header';
import { CampaignDetailTabs } from './(components)/campaign-detail-tabs/campaign-detail-tabs';
import { CampaignDetailsAccordion } from './(components)/details-tab/campaign-details-accordion';
import PromotionsSection from './(components)/promotions-section/promotions-section';
import { PromotionsTableSkeleton } from './(components)/promotions-section/promotions-table/promotions-table.loading';
import { CampaignDetailsProvider } from './context/CampaignDetailsContext';
import CampaignDetailsLoading from './loading';

interface CampaignDetailsProps {
  params: Promise<{ id: string }>;
}

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('campaignManagement.details');
  return {
    title: `${t('pageTitle')} — Pop Logic`,
    description: t('pageDescription'),
  };
}

export default async function CampaignDetailsPage({ params }: CampaignDetailsProps) {
  const { id } = await params;
  const campaignId = decodeId(id);

  if (!campaignId) {
    notFound();
  }

  const t = await getTranslations('campaignManagement.details');

  return (
    <PageRoot>
      <Suspense fallback={<CampaignDetailsLoading />}>
        <CampaignDetailsProvider campaignId={campaignId} encodedCampaignId={id}>
          {/* Header: Back link, Title, Status badge, Type */}
          <CampaignDetailHeader />

          <CampaignDetailTabs
            detailsContent={
              <div className='flex flex-col gap-5 sm:gap-8'>
                {/* Campaign Details Accordion: Info Cards + Overview */}
                <CampaignDetailsAccordion />

                {/* Promotions Table */}
                <SectionErrorBoundary
                  title={t('errors.promotionListing.title')}
                  description={t('errors.promotionListing.description')}
                >
                  <Suspense fallback={<PromotionsTableSkeleton />}>
                    <PromotionsSection />
                  </Suspense>
                </SectionErrorBoundary>
              </div>
            }
          />
        </CampaignDetailsProvider>
      </Suspense>
    </PageRoot>
  );
}
