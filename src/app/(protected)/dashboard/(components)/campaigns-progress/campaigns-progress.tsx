'use client';

import { Card, SectionErrorBoundary } from '@/components';
import { CampaignStatusEnum } from '@/constant';
import { useTranslations } from 'next-intl';

import { CampaignStatusColumn } from './campaign-status-column';

export default function CampaignsProgress({
  displayOrder,
}: {
  displayOrder: CampaignStatusEnum[];
}) {
  const t = useTranslations('dashboard.campaigns-progress');

  return (
    <Card className='rounded-[8px] border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:p-6'>
      <h2 className='mb-5 text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
        {t('title')}
      </h2>
      <div
        className='flex gap-5 overflow-x-auto pb-3 min-w-[200px]'
        role='region'
        aria-label={t('scroll-region-aria')}
      >
        {displayOrder?.map((status) => {
          const displayName = t(`statuses.${status}`);
          return (
            <section
              key={status}
              aria-label={displayName}
              className='w-[320px] shrink-0 rounded-[12px] border border-[var(--neutral-300)] bg-[var(--neutral-200)] p-6'
            >
              <SectionErrorBoundary
                title='Campaigns progress failed to load'
                description='Unable to load campaign status.'
              >
                <CampaignStatusColumn status={status} />
              </SectionErrorBoundary>
            </section>
          );
        })}
      </div>
    </Card>
  );
}
