'use client';

import { PageSearch, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { useCapabilities } from '@/hooks';
import { DEFAULT_SURVEY_CAPABILITIES, SURVEY_CAPABILITIES_MAP } from '@/lib';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { SurveyManagementContext } from '../../context/SurveyManagementContext';
import { SurveyFilters } from '../survey-filters/survey-filters';
import { SurveyTable } from '../survey-table/survey-table';
import { TemplateTable } from '../template-table/template-table';

export function SurveyManagementTabs() {
  const { activeTab, setActiveTab, templateSearch, updateTemplateSearch, clearTemplateSearch } =
    useContext(SurveyManagementContext);

  const t = useTranslations('surveyManagement');
  const caps = useCapabilities(SURVEY_CAPABILITIES_MAP, DEFAULT_SURVEY_CAPABILITIES);

  // Brand Admin and Store Admin see surveys only — no tab wrapper needed
  if (!caps.showTabs) {
    return (
      <>
        <div className='mb-4 mt-4'>
          <SurveyFilters />
        </div>
        <SurveyTable />
      </>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList variant='line' className='h-12 w-full justify-start border-b border-border pb-px'>
          <TabsTrigger
            value='templates'
            className='w-auto flex-none px-5 text-sm font-semibold text-[var(--neutral-500)] after:bg-[var(--primary-400)] data-active:font-medium data-active:text-[var(--primary-400)]'
          >
            {t('page.tabs.templates')}
          </TabsTrigger>

          <TabsTrigger
            value='surveys'
            className='w-auto flex-none px-5 text-sm font-semibold text-[var(--neutral-500)] after:bg-[var(--primary-400)] data-active:font-medium data-active:text-[var(--primary-400)]'
          >
            {t('page.tabs.surveys')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='templates'>
          <div className="flex justify-end mb-4 mt-4">

            <PageSearch
              className='w-full max-w-[400px]'
              inputClassName='bg-white'
              placeholder={t('template.table.searchPlaceholder')}
              aria-label={t('template.table.searchAriaLabel')}
              value={templateSearch}
              onChange={(e) => {
                updateTemplateSearch(e.target.value);
              }}
              onClear={clearTemplateSearch}
              />
              </div>
          <TemplateTable />
        </TabsContent>

        <TabsContent value='surveys'>
          <div className='mb-4 mt-4'>
            <SurveyFilters />
          </div>
          <SurveyTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
