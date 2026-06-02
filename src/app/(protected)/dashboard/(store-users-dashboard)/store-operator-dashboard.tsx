import {
  PageDescription,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import { STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER } from '@/constant';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import AlertsSection, { AlertsSkeleton } from '../(components)/alerts-section/alerts-section';
import CampaignsProgress from '../(components)/campaigns-progress/campaigns-progress';
import { CampaignsProgressSkeleton } from '../(components)/campaigns-progress/campaigns-progress-skeleton';
import StoreAdminOverviewCard from './(components)/store-admin-overview-card/store-admin-overview-card';
import { StoreAdminOverviewCardSkeleton } from './(components)/store-admin-overview-card/store-admin-overview-card-skeleton';

export default function StoreOperatorDashboard() {
  const t = useTranslations('dashboard');
  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('store-operator-title')}</PageTitle>
        <PageDescription>{t('store-operator-description')}</PageDescription>
      </PageHeader>

      {/* ── Overview Metrics Row ── */}
      <SectionErrorBoundary
        title={t('errors.overviewCards.title')}
        description={t('errors.overviewCards.description')}
      >
        <Suspense fallback={<StoreAdminOverviewCardSkeleton />}>
          <StoreAdminOverviewCard />
        </Suspense>
      </SectionErrorBoundary>

      {/* ──Quick Actions & Alerts Row ── */}

      <SectionErrorBoundary
        title={t('errors.alerts.title')}
        description={t('errors.alerts.description')}
      >
        <Suspense fallback={<AlertsSkeleton />}>
          <AlertsSection />
        </Suspense>
      </SectionErrorBoundary>

      {/* ── Campaigns Progress (horizontal scrollable Kanban) ── */}
      <SectionErrorBoundary
        title={t('errors.campaignsProgress.title')}
        description={t('errors.campaignsProgress.description')}
      >
        <Suspense fallback={<CampaignsProgressSkeleton />}>
          <CampaignsProgress displayOrder={STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER} />
        </Suspense>
      </SectionErrorBoundary>
    </PageRoot>
  );
}
