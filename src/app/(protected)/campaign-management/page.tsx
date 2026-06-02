import { PageRoot, SectionErrorBoundary } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { CampaignFilters } from './(components)/campaign-filters/campaign-filters';
import { CampaignStatCards } from './(components)/campaign-stat-cards/campaign-stat-cards';
import { CampaignStatCardsSkeleton } from './(components)/campaign-stat-cards/campaign-stat-cards.loading';
import { CampaignTable } from './(components)/campaign-table/campaign-table';
import { CampaignTableSkeleton } from './(components)/campaign-table/campaign-table.loading';
import CampaignPageHeader from './(components)/page-header/page-header';
import { CampaignManagementProvider } from './context/CampaignManagementContext';
import CampaignManagementLoading from './loading';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('campaignManagement.page');
  return {
    title: `${t('title')} — Pop Logic`,
    description: t('description'),
  };
}

interface CampaignManagementPageProps {
  searchParams: Promise<{ status?: string }>;
}

/* ── Main Page ── */
export default async function CampaignManagementPage({
  searchParams,
}: CampaignManagementPageProps) {
  const params = await searchParams;
  const initialStatus = params.status;
  const t = await getTranslations('campaignManagement');

  return (
    <PageRoot>
      <Suspense fallback={<CampaignManagementLoading />}>
        <CampaignManagementProvider initialStatus={initialStatus}>
          {/* Page Header with Create Campaign Button */}
          <CampaignPageHeader />

          {/* Stat Cards */}
          <SectionErrorBoundary
            title={t('errors.statCards.title')}
            description={t('errors.statCards.description')}
          >
            <Suspense fallback={<CampaignStatCardsSkeleton />}>
              <CampaignStatCards />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary
            title={t('errors.campaignListing.title')}
            description={t('errors.campaignListing.description')}
          >
            {/* Filters Section */}
            <CampaignFilters />

            {/* Campaigns Table */}
            <Suspense fallback={<CampaignTableSkeleton />}>
              <CampaignTable />
            </Suspense>
          </SectionErrorBoundary>
        </CampaignManagementProvider>
      </Suspense>
    </PageRoot>
  );
}
