'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components';
import type { TemplateQuestion } from '@/components/survey-creator';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_SURVEY_RESPONSE, type SurveyResponseData, type SurveyResponseVars } from '@/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

// ─── Answer resolver ─────────────────────────────────────────────────────────

function resolveAnswer(question: TemplateQuestion, value: string): string {
  if (!value) return '—';

  switch (question.type) {
    case 'text_input':
    case 'text_area':
      return value;

    case 'multiple_choice':
    case 'conditional_multiple_choice':
    case 'dropdown':
      return question.options?.find((o) => o.id === value)?.label ?? value;

    case 'checkbox': {
      const ids = value.split(',').filter(Boolean);
      return ids.map((id) => question.options?.find((o) => o.id === id)?.label ?? id).join(', ');
    }

    case 'date':
      return format(new Date(value), 'PPP');

    default:
      return value;
  }
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function ViewResponseBodyLoading() {
  return (
    <div className='flex flex-col gap-4 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-5 py-6'>
      <Skeleton className='h-5 w-36' />
      <div className='flex flex-col gap-5'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='flex flex-col gap-1.5'>
            <Skeleton className='h-3 w-48' />
            <Skeleton className='h-4 w-32' />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inner data-fetching component ──────────────────────────────────────────

interface ViewResponseBodyProps {
  surveyResponseId: string;
}

function ViewResponseBody({ surveyResponseId }: ViewResponseBodyProps) {
  const t = useTranslations('surveyManagement.viewResponseDialog');

  const { data } = useSuspenseQuery<SurveyResponseData, SurveyResponseVars>(GET_SURVEY_RESPONSE, {
    variables: { surveyResponseId },
  });

  const surveyResponse = data?.surveyResponse?.surveyResponse;

  const questions: TemplateQuestion[] = surveyResponse
    ? (JSON.parse(surveyResponse.schemaJson) as TemplateQuestion[])
    : [];
  const responses: Record<string, string> = surveyResponse?.responseJson
    ? (JSON.parse(surveyResponse.responseJson) as Record<string, string>)
    : {};

  const topLevelQuestions = questions?.filter((q) => !q.parentId);

  const getVisibleSubQuestions = (parentId: string): TemplateQuestion[] => {
    const parentResponse = responses[parentId];
    if (!parentResponse) return [];
    const triggerValue = parentResponse === 'yes' ? 'yes' : 'no';
    return questions.filter(
      (q) => q.parentId === parentId && q.parentTriggerValue === triggerValue,
    );
  };

  return (
    <div className='flex flex-col gap-4 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-5 py-6'>
      <p className='text-[16px] font-semibold text-(--neutral-900)'>{t('surveyResponses')}</p>

      <div className='flex flex-col gap-5'>
        {/* Submitted date */}
        {surveyResponse?.submittedAt && (
          <div className='flex flex-col gap-1'>
            <p className='text-[12px] uppercase tracking-wide text-(--neutral-500)'>
              {t('submittedAt')}
            </p>
            <p className='text-[14px] font-medium text-(--neutral-900)'>
              {format(new Date(surveyResponse.submittedAt), 'PPP')}
            </p>
          </div>
        )}

        {/* Question + answer rows */}
        {topLevelQuestions?.map((question) => (
          <div key={question.id} className='flex flex-col gap-2'>
            <div className='flex flex-col gap-1'>
              <p className='text-[12px] uppercase tracking-wide text-(--neutral-500) break-words'>
                {question.label}
              </p>
              <p className='text-[14px] font-medium text-(--neutral-900) break-words'>
                {resolveAnswer(question, responses[question.id] ?? '')}
              </p>
            </div>

            {/* Visible conditional sub-questions */}
            {question.type === 'conditional_multiple_choice' &&
              getVisibleSubQuestions(question.id).map((sub) => (
                <div key={sub.id} className='flex flex-col gap-1 rounded-lg bg-white p-3'>
                  <div className='flex flex-col text-[12px] text-(--neutral-500)'>
                    <p className='uppercase'>{t('followUp')}</p>
                    <p className='break-words'>{sub.label}</p>
                  </div>
                  <p className='text-[14px] font-medium text-(--neutral-900) break-words'>
                    {resolveAnswer(sub, responses[sub.id] ?? '')}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

interface ViewResponseDialogProps {
  storeName?: string;
  surveyResponseId: string;
  onClose: () => void;
}

export function ViewResponseDialog({
  storeName,
  surveyResponseId,
  onClose,
}: ViewResponseDialogProps) {
  const t = useTranslations('surveyManagement.viewResponseDialog');

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 sm:max-w-[800px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex flex-col gap-1 border-b border-[#e5e7eb] px-8 py-6'>
          <DialogTitle className='text-[20px] font-semibold leading-7.5 text-(--neutral-900)'>
            {t('title')}
          </DialogTitle>
          {storeName && (
            <p className='text-[14px] font-semibold text-(--primary-400)'>{storeName}</p>
          )}
        </DialogHeader>

        {/* ── Body ── */}
        <div className='flex max-h-[60vh] flex-col gap-5 overflow-y-auto px-8 py-6 break-words'>
          <Suspense fallback={<ViewResponseBodyLoading />}>
            <ViewResponseBody surveyResponseId={surveyResponseId} />
          </Suspense>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className='px-8 pb-6 border-0'>
          <Button
            className='h-11 w-full rounded-lg bg-linear-to-b from-(--primary-500) to-(--primary-600) text-[16px] font-medium text-white hover:opacity-90'
            onClick={onClose}
          >
            {t('closeButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
