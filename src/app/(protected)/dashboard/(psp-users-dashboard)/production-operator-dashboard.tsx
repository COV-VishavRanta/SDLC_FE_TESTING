import {
  PageDescription,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import { PSP_DASHBOARD_CAMPAIGN_DISPLAY_ORDER } from '@/constant';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import AlertsSection, { AlertsSkeleton } from '../(components)/alerts-section/alerts-section';
import CampaignsProgress from '../(components)/campaigns-progress/campaigns-progress';
import { CampaignsProgressSkeleton } from '../(components)/campaigns-progress/campaigns-progress-skeleton';
import PspAdminOverviewCard from './(components)/psp-admin-overview-card';
import { PspAdminOverviewCardSkeleton } from './(components)/psp-admin-overview-card-skeleton';

export default function ProductionOperatorDashboard() {
  const t = useTranslations('dashboard');
  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('production-operator-title')}</PageTitle>
        <PageDescription>{t('production-operator-description')}</PageDescription>
      </PageHeader>

      {/* ── Campaigns Overview Row ── */}

      {/* Campaigns Summary Card */}
      <div className='w-1/2'>
        <SectionErrorBoundary
          title={t('errors.pspAdminOverview.title')}
          description={t('errors.pspAdminOverview.description')}
        >
          <Suspense fallback={<PspAdminOverviewCardSkeleton />}>
            <PspAdminOverviewCard />
          </Suspense>
        </SectionErrorBoundary>
      </div>

      {/* ── Campaigns Progress (horizontal scrollable Kanban) ── */}
      <SectionErrorBoundary
        title={t('errors.campaignsProgress.title')}
        description={t('errors.campaignsProgress.description')}
      >
        <Suspense fallback={<CampaignsProgressSkeleton />}>
          <CampaignsProgress displayOrder={PSP_DASHBOARD_CAMPAIGN_DISPLAY_ORDER} />
        </Suspense>
      </SectionErrorBoundary>

      {/* ── Alerts Row ── */}
      <SectionErrorBoundary
        title={t('errors.alerts.title')}
        description={t('errors.alerts.description')}
      >
        <Suspense fallback={<AlertsSkeleton />}>
          <AlertsSection />
        </Suspense>
      </SectionErrorBoundary>
    </PageRoot>
  );
}
