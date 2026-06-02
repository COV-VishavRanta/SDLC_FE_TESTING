import {
  PageDescription,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { BRAND_DASHBOARD_CAMPAIGN_DISPLAY_ORDER } from '@/constant';
import AlertsSection, { AlertsSkeleton } from '../(components)/alerts-section/alerts-section';
import CampaignsProgress from '../(components)/campaigns-progress/campaigns-progress';
import { CampaignsProgressSkeleton } from '../(components)/campaigns-progress/campaigns-progress-skeleton';
import ExceptionRequests, {
  ExceptionRequestsSkeleton,
} from './(components)/exception-requests/exception-requests';
import OverviewCards from './(components)/overview-card/overview-card';
import OverviewCardsSkeleton from './(components)/overview-card/overview-card-skeleton';

export default function CampaignAdminDashboard() {
  const t = useTranslations('dashboard');

  return (
    <PageRoot>
      {/* ── Page Header ── */}
      <PageHeader>
        <PageTitle>{t('campaign-admin-title')}</PageTitle>
        <PageDescription>{t('campaign-admin-description')}</PageDescription>
      </PageHeader>

      {/* ── Overview Cards (Active Stores + Ongoing Campaigns) ── */}
      <SectionErrorBoundary
        title={t('errors.overviewCards.title')}
        description={t('errors.overviewCards.description')}
      >
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCards />
        </Suspense>
      </SectionErrorBoundary>
      {/* Alerts Section */}
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
          <CampaignsProgress displayOrder={BRAND_DASHBOARD_CAMPAIGN_DISPLAY_ORDER} />
        </Suspense>
      </SectionErrorBoundary>

      {/* ── Exception Requests Table ── */}
      <SectionErrorBoundary
        title={t('errors.exceptionRequests.title')}
        description={t('errors.exceptionRequests.description')}
      >
        <Suspense fallback={<ExceptionRequestsSkeleton />}>
          <ExceptionRequests />
        </Suspense>
      </SectionErrorBoundary>
    </PageRoot>
  );
}
