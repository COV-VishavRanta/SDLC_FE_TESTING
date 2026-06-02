import { PageRoot } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SurveyManagementHeader from './(components)/survey-management-header/survey-management-header';
import { SurveyManagementTabs } from './(components)/survey-management-tabs/survey-management-tabs';
import { SurveyStatCards } from './(components)/survey-stat-cards/survey-stat-cards';
import { SurveyManagementProvider } from './context/SurveyManagementContext';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('surveyManagement');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

export default function SurveyManagementPage() {
  return (
    <PageRoot>
      <SurveyManagementProvider>
        {/* ── Page Header ── */}
        <SurveyManagementHeader />

        <SurveyStatCards />

        {/* ── Tab Navigation ── */}

        <SurveyManagementTabs />
      </SurveyManagementProvider>
    </PageRoot>
  );
}
