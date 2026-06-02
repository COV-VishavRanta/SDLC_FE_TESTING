'use client';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { NoRecordFound } from '@/components/ui/no-record-found';
import { TemplateQuestion } from '../survey-creator.types';
import PreviewQuestion from './question-preview';
import SurveyPreviewLoading from './survey-preview.loading';

/* ══════════════════════════════════════════════════════════════════
 * SurveyPreview — standalone, props-only composition component
 * ══════════════════════════════════════════════════════════════════ */

interface SurveyPreviewProps {
  questions: TemplateQuestion[];
  templateName?: string;
  templateDescription?: string;
  className?: string;
  isLoading?: boolean;
}

export default function SurveyPreview({
  questions,
  templateName,
  templateDescription,
  className,
  isLoading,
}: SurveyPreviewProps) {
  const t = useTranslations('surveyPreview');
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleRespond = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const topLevelQuestions = questions.filter((q) => !q.parentId);

  const getVisibleSubQuestions = (parentQuestion: TemplateQuestion) => {
    const parentResponse = responses[parentQuestion.id];
    if (!parentResponse) return [];
    // parentResponse holds the selected option's ID; resolve its label to match parentTriggerValue
    const selectedLabel =
      parentQuestion.options?.find((opt) => opt.id === parentResponse)?.label?.toLowerCase() ??
      parentResponse.toLowerCase();
    return questions.filter(
      (q): q is TemplateQuestion & { parentTriggerValue: string } =>
        q.parentId === parentQuestion.id && q.parentTriggerValue?.toLowerCase() === selectedLabel,
    );
  };

  if (isLoading) {
    return <SurveyPreviewLoading />;
  }

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {/* Survey Meta (if provided) */}
      {templateName && (
        <div className='py-3'>
          {templateName && (
            <h2 className='text-[20px] font-bold text-[var(--neutral-900)]'>{templateName}</h2>
          )}
          {templateDescription && (
            <p className='text-[14px] text-[var(--neutral-700)]'>{templateDescription}</p>
          )}
        </div>
      )}

      {/* Questions */}
      <div className='flex flex-col gap-5'>
        <div className='flex items-center gap-5'>
          <p className='text-[16px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {t('questionsLabel')}
          </p>
        </div>
        <div className='flex flex-col gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
          {topLevelQuestions.length === 0 ? (
            <NoRecordFound message={t('noQuestions')} />
          ) : (
            topLevelQuestions.map((question, idx) => (
              <div key={question.id} className='flex flex-col gap-5'>
                {/* Question card */}
                <div className='flex flex-col gap-5 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] p-3'>
                  {/* Question content */}
                  <PreviewQuestion
                    idx={idx}
                    question={question}
                    responses={responses}
                    onRespond={handleRespond}
                  />

                  {/* Conditional sub-questions */}
                  {question.type === 'conditional_multiple_choice' &&
                    getVisibleSubQuestions(question).map((sub, subIdx) => (
                      <div
                        key={sub.id}
                        className='ml-4 flex flex-col gap-3 border-l-2 border-[var(--neutral-300)] pl-4'
                      >
                        <PreviewQuestion
                          idx={idx}
                          question={sub}
                          responses={responses}
                          onRespond={handleRespond}
                          parentIndex={idx}
                          subIndex={subIdx}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
