'use client';

import { SectionErrorBoundary, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { BRAND_VIEW_INSTALLATION_PROOF_TAB_CAMPAIGN_STATUSES } from '@/constant';
import { useCapabilities } from '@/hooks';
import {
  CAMPAIGN_CAPABILITIES_MAP,
  DEFAULT_CAMPAIGN_CAPABILITIES,
} from '@/lib/permissions/route.permissions';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { Suspense, useContext } from 'react';

import { OrdersTabSkeleton } from '../(order-tabs)/order-tab-content.loading';
import OrdersTabContent from '../(order-tabs)/orders-tab/orders-tab';
import ReordersTabContent from '../(order-tabs)/reorders-tab/reorders-tab';
import { CampaignDetailsContext } from '../../context/CampaignDetailsContext';
import InstallationProofTabContent from '../installation-proof-tab/installation-proof-tab';
import { InstallationProofTabSkeleton } from '../installation-proof-tab/installation-proof-tab.loading';

interface CampaignDetailTabsProps {
  detailsContent: React.ReactNode;
}

export function CampaignDetailTabs({ detailsContent }: CampaignDetailTabsProps) {
  const { campaignData } = useContext(CampaignDetailsContext);
  const t = useTranslations('campaignManagement.details');

  const { canReviewInstallationProof, orderTabStatuses } = useCapabilities(
    CAMPAIGN_CAPABILITIES_MAP,
    DEFAULT_CAMPAIGN_CAPABILITIES,
  );

  const canViewOrders = campaignData?.status ? orderTabStatuses.has(campaignData.status) : false;

  const canViewInstallationProof =
    canReviewInstallationProof &&
    (campaignData?.status
      ? BRAND_VIEW_INSTALLATION_PROOF_TAB_CAMPAIGN_STATUSES.has(campaignData.status)
      : false);

  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'details',
    clearOnDefault: true,
  });

  const currentTab =
    (activeTab === 'order' && !canViewOrders) ||
    (activeTab === 'reorder' && !canViewOrders) ||
    (activeTab === 'installation-proof' && !canViewInstallationProof)
      ? 'details'
      : activeTab;

  return (
    <Tabs value={currentTab} onValueChange={(val) => setActiveTab(val)}>
      <TabsList variant='line' className='h-12 w-full justify-start border-b border-border pb-px'>
        <TabsTrigger
          value='details'
          className='w-auto flex-none px-5 text-sm font-semibold text-[var(--neutral-500)] after:bg-[var(--primary-400)] data-active:font-medium data-active:text-[var(--primary-400)]'
        >
          {t('tabs.details')}
        </TabsTrigger>
        {canViewOrders && (
          <TabsTrigger
            value='order'
            className='w-auto flex-none px-5 text-sm font-semibold text-[var(--neutral-500)] after:bg-[var(--primary-400)] data-active:font-medium data-active:text-[var(--primary-400)]'
          >
            {t('tabs.order')}
          </TabsTrigger>
        )}
        {canViewOrders && (
          <TabsTrigger
            value='reorder'
            className='w-auto flex-none px-5 text-sm font-semibold text-[var(--neutral-500)] after:bg-[var(--primary-400)] data-active:font-medium data-active:text-[var(--primary-400)]'
          >
            {t('tabs.reorder')}
          </TabsTrigger>
        )}
        {canViewInstallationProof && (
          <TabsTrigger
            value='installation-proof'
            className='w-auto flex-none px-5 text-sm font-semibold text-[var(--neutral-500)] after:bg-[var(--primary-400)] data-active:font-medium data-active:text-[var(--primary-400)]'
          >
            {t('tabs.installationProof')}
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value='details'>{detailsContent}</TabsContent>

      {canViewOrders && (
        <TabsContent value='order'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <h3 className='text-base font-semibold text-text-heading sm:text-xl'>
                {t('ordersTab.title')}
              </h3>
              <p className='text-xs font-normal leading-[18px] tracking-[-0.15px] text-text-secondary sm:text-sm sm:leading-[21px]'>
                {t('ordersTab.description')}
              </p>
            </div>
            <SectionErrorBoundary
              title={t('ordersTab.errorTitle')}
              description={t('ordersTab.errorDescription')}
            >
              <Suspense fallback={<OrdersTabSkeleton />}>
                <OrdersTabContent />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </TabsContent>
      )}

      {canViewOrders && (
        <TabsContent value='reorder'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <h3 className='text-base font-semibold text-text-heading sm:text-xl'>
                {t('reordersTab.title')}
              </h3>
              <p className='text-xs font-normal leading-[18px] tracking-[-0.15px] text-text-secondary sm:text-sm sm:leading-[21px]'>
                {t('reordersTab.description')}
              </p>
            </div>
            <SectionErrorBoundary
              title={t('reordersTab.errorTitle')}
              description={t('reordersTab.errorDescription')}
            >
              <Suspense fallback={<OrdersTabSkeleton />}>
                <ReordersTabContent />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </TabsContent>
      )}

      {canViewInstallationProof && (
        <TabsContent value='installation-proof'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <h3 className='text-base font-semibold text-text-heading sm:text-xl'>
                {t('installationProofTab.title')}
              </h3>
              <p className='text-xs font-normal leading-[18px] tracking-[-0.15px] text-text-secondary sm:text-sm sm:leading-[21px]'>
                {t('installationProofTab.description')}
              </p>
            </div>
            <SectionErrorBoundary
              title={t('installationProofTab.errorTitle')}
              description={t('installationProofTab.errorDescription')}
            >
              <Suspense fallback={<InstallationProofTabSkeleton />}>
                <InstallationProofTabContent />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
