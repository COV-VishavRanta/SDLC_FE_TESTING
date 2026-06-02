'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components';
import { useTranslations } from 'next-intl';

import { DetailInfoCards } from './detail-info-cards';
import { DetailOverviewCard } from './detail-overview-card';

export function CampaignDetailsAccordion() {
  const t = useTranslations('campaignManagement.details');

  return (
    <Accordion defaultValue={['campaign-details']}>
      <AccordionItem
        value='campaign-details'
        className='overflow-hidden rounded-lg border border-border'
      >
        <AccordionTrigger className='items-center rounded-none border-0 bg-white px-3 py-2.5 text-xs font-semibold text-text-heading hover:no-underline sm:px-5 sm:py-3 sm:text-sm'>
          {t('campaignDetailsSection')}
        </AccordionTrigger>
        <AccordionContent className='border-t border-border bg-[var(--neutral-200)] p-3 sm:p-5'>
          <div className='flex flex-col gap-3'>
            <DetailInfoCards />
            <DetailOverviewCard />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
