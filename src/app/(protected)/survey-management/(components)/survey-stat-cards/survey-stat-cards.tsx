'use client';

import { CheckCircleIcon, ClockIcon, SurveyIcon } from '@/components';
import { StatCard } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { SurveyManagementContext } from '../../context/SurveyManagementContext';
import { SurveyStatCardsSkeleton } from './survey-stat-cards.loading';

export function SurveyStatCards() {
  const { totalSurveys, activeSurveys, closedSurveys, isSurveyCardsLoading } =
    useContext(SurveyManagementContext);
  const t = useTranslations('surveyManagement');

  if (isSurveyCardsLoading) {
    return <SurveyStatCardsSkeleton />;
  }

  return (
    <div className='mt-6 grid xs:grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
      {/* aria-hidden on all icons: StatCard label text is the accessible name (WCAG 1.1.1) */}
      <StatCard
        label={t('stats.totalSurveys')}
        value={totalSurveys}
        icon={<SurveyIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />}
        iconBgClass='bg-[var(--primary-300)]'
      />
      <StatCard
        label={t('stats.activeSurveys')}
        value={activeSurveys}
        icon={
          <ClockIcon className='size-[18px] text-[var(--badge-active-text)]' aria-hidden='true' />
        }
        iconBgClass='bg-[var(--badge-active-bg)]'
        valueClassName='text-[var(--badge-active-text)]'
      />
      <StatCard
        label={t('stats.closedSurveys')}
        value={closedSurveys}
        icon={
          <CheckCircleIcon className='size-[18px] text-[var(--neutral-600)]' aria-hidden='true' />
        }
        iconBgClass='bg-[var(--neutral-300)]'
        valueClassName='text-[var(--neutral-600)]'
      />
    </div>
  );
}
