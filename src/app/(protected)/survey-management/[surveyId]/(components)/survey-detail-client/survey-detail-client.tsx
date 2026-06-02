'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ArrowLeftIcon,
  Button,
} from '@/components';
import { ProtectedRoute, SurveyStatusEnum } from '@/constant';
import { CLOSE_SURVEY, GET_SURVEY_DETAIL, SurveyDetailData, SurveyDetailVars } from '@/graphql';
import { useCapabilities } from '@/hooks';
import { DEFAULT_SURVEY_CAPABILITIES, SURVEY_CAPABILITIES_MAP } from '@/lib';
import { SurveyBrandDetailGroup } from '@/types';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { CloseSurveyDialog } from '../../../(components)/dialog/close-survey-dialog/close-survey-dialog';
import { BrandStoreTable } from '../brand-store-table/brand-store-table';

interface SurveyBrandAccordionProps {
  brandGroups: SurveyBrandDetailGroup[];
  surveyName: string;
}

function SurveyBrandAccordion({ brandGroups }: SurveyBrandAccordionProps) {
  const t = useTranslations('surveyManagement.details');

  if (brandGroups.length === 0) {
    return <p className='text-[14px] text-(--neutral-500)'>{t('responses.empty')}</p>;
  }

  return (
    <Accordion
      defaultValue={brandGroups.map((bg) => bg.brandId)}
      multiple
      className='overflow-hidden rounded-lg border border-(--neutral-300)'
    >
      {brandGroups.map((group) => (
        <AccordionItem
          key={group.brandId}
          value={group.brandId}
          className='border-b border-(--neutral-300) bg-white last:border-b-0'
        >
          <AccordionTrigger className='p-5 text-[16px] font-semibold text-(--neutral-900) hover:no-underline'>
            {group.brandName}
          </AccordionTrigger>
          <AccordionContent className='p-0'>
            <div className='flex flex-col gap-3 bg-(--neutral-200) p-5'>
              <p className='text-[12px] font-semibold text-(--neutral-900)'>
                {t('storesOf', { brandName: group.brandName })}
              </p>
              <BrandStoreTable stores={group.stores} brandName={group.brandName} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

interface SurveyDetailClientProps {
  surveyId: string;
}

export function SurveyDetailClient({ surveyId }: SurveyDetailClientProps) {
  const t = useTranslations('surveyManagement');
  const tDetails = useTranslations('surveyManagement.details');

  const { data, refetch } = useSuspenseQuery<SurveyDetailData, SurveyDetailVars>(
    GET_SURVEY_DETAIL,
    {
      variables: { surveyId },
    },
  );

  const { canCloseSurvey } = useCapabilities(SURVEY_CAPABILITIES_MAP, DEFAULT_SURVEY_CAPABILITIES);

  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const [closeSurveyMutation, { loading: isClosing }] = useMutation<
    {
      closeSurvey: {
        success: boolean;
        message: string;
        survey: { id: string; name: string; status: SurveyStatusEnum };
      };
    },
    { surveyId: string }
  >(CLOSE_SURVEY);

  const handleCloseSurvey = () => {
    closeSurveyMutation({
      variables: { surveyId },
      onCompleted: () => {
        setShowCloseDialog(false);
        toast.success(t('actions.markAsClosedSuccess'));
        refetch().catch(() => undefined);
      },
    }).catch(() => undefined);
  };

  const survey = data?.surveyDetail?.survey;

  return (
    <>
      {/* Back link */}
      <Link
        href={`${ProtectedRoute.SURVEY_MANAGEMENT}?tab=surveys`}
        className='flex w-fit items-center gap-1.5 text-[14px] font-medium text-(--primary-400) hover:underline'
        aria-label={tDetails('backLink')}
      >
        <ArrowLeftIcon className='size-4' aria-hidden='true' />
        {tDetails('backLink')}
      </Link>

      {/* Title row */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-[20px] font-semibold leading-normal text-(--neutral-900) sm:text-[24px] lg:text-[28px]'>
            {survey?.name}
          </h1>
          {survey?.description ? (
            <p className='text-[14px] leading-5.25 text-(--neutral-500)'>{survey.description}</p>
          ) : null}
        </div>

        {canCloseSurvey && survey?.status === SurveyStatusEnum.ACTIVE && (
          <Button
            variant='default'
            disabled={isClosing}
            onClick={() => setShowCloseDialog(true)}
            className='h-11.75 w-full shrink-0 rounded-lg border-(--neutral-300) px-6 text-[16px] font-medium sm:w-auto'
          >
            {t('actions.markAsClosed')}
          </Button>
        )}
      </div>

      {showCloseDialog && (
        <CloseSurveyDialog
          surveyName={survey?.name ?? ''}
          isClosing={isClosing}
          onConfirm={handleCloseSurvey}
          onCancel={() => setShowCloseDialog(false)}
        />
      )}

      {/* Stores section */}
      <div className='flex flex-col gap-4'>
        <h2 className='text-[16px] font-semibold leading-normal text-(--neutral-900) sm:text-[18px]'>
          {tDetails('storesAssignedByBrands')}
        </h2>
        <SurveyBrandAccordion
          brandGroups={survey?.brandGroups ?? []}
          surveyName={survey?.name ?? ''}
        />
      </div>
    </>
  );
}
