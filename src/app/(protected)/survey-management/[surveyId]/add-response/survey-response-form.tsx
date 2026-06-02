'use client';

import { Button } from '@/components';
import type { TemplateQuestion } from '@/components/survey-creator';
import PreviewQuestion from '@/components/survey-creator/survey-preview/question-preview';
import { NoRecordFound } from '@/components/ui/no-record-found';
import {
  SUBMIT_SURVEY_RESPONSE,
  type SubmitSurveyResponseInput,
  type SurveyResponsePayload,
} from '@/graphql';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ProtectedRoute } from '@/constant';
import { useMutation } from '@apollo/client/react';

interface SurveyResponseFormProps {
  surveyId: string;
  surveyName: string;
  questions: TemplateQuestion[];
}

export default function SurveyResponseForm({
  surveyId,
  surveyName,
  questions,
}: SurveyResponseFormProps) {
  const t = useTranslations('surveyPreview');
  const tForm = useTranslations('surveyManagement.addResponse');
  const router = useRouter();

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitSurveyResponse, { loading }] = useMutation<
    { submitSurveyResponse: SurveyResponsePayload },
    { input: SubmitSurveyResponseInput }
  >(SUBMIT_SURVEY_RESPONSE);

  const topLevelQuestions = useMemo(() => questions.filter((q) => !q.parentId), [questions]);

  const getVisibleSubQuestions = useCallback(
    (parentId: string) => {
      const parentResponse = responses[parentId];
      if (!parentResponse) return [];
      const triggerValue = parentResponse === 'yes' ? 'yes' : 'no';
      return questions.filter(
        (q): q is TemplateQuestion & { parentTriggerValue: 'yes' | 'no' } =>
          q.parentId === parentId && q.parentTriggerValue === triggerValue,
      );
    },
    [questions, responses],
  );

  const handleRespond = useCallback((questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      if (!prev[questionId]) return prev;
      const next = { ...prev };
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete next[questionId];
      return next;
    });
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const requiredMsg = tForm('requiredField');

    for (const question of topLevelQuestions) {
      if (question.required) {
        const value = responses[question.id] ?? '';
        const isEmpty =
          question.type === 'checkbox'
            ? value.split(',').filter(Boolean).length === 0
            : !value.trim();
        if (isEmpty) {
          newErrors[question.id] = requiredMsg;
        }
      }

      if (question.type === 'conditional_multiple_choice') {
        const visibleSubs = getVisibleSubQuestions(question.id);
        for (const sub of visibleSubs) {
          if (sub.required) {
            const value = responses[sub.id] ?? '';
            const isEmpty =
              sub.type === 'checkbox'
                ? value.split(',').filter(Boolean).length === 0
                : !value.trim();
            if (isEmpty) {
              newErrors[sub.id] = requiredMsg;
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [topLevelQuestions, responses, getVisibleSubQuestions, tForm]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    await submitSurveyResponse({
      variables: {
        input: {
          surveyId,
          responseJson: JSON.stringify(responses),
        },
      },
      onCompleted: () => {
        toast.success(tForm('submitSuccess'));
        router.push(ProtectedRoute.SURVEY_MANAGEMENT);
      },
    });
  }, [validate, submitSurveyResponse, surveyId, responses, tForm, router]);

  return (
    <div className='flex flex-col gap-5'>
      {/* Survey name */}
      {surveyName && (
        <h2 className='text-[22px] font-bold text-[var(--neutral-900)]'>{surveyName}</h2>
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
                <div
                  className={cn(
                    'flex flex-col gap-5 rounded-lg border bg-[var(--primary-100,#f7f9fb)] p-3',
                    errors[question.id] ? 'border-[var(--error)]' : 'border-[var(--neutral-300)]',
                  )}
                >
                  {/* Question input */}
                  <PreviewQuestion
                    idx={idx}
                    question={question}
                    responses={responses}
                    onRespond={handleRespond}
                  />

                  {/* Field validation error */}
                  {errors[question.id] && (
                    <p
                      className='text-[12px] font-medium text-[var(--error)]'
                      role='alert'
                      aria-live='polite'
                    >
                      {errors[question.id]}
                    </p>
                  )}

                  {/* Conditional sub-questions */}
                  {question.type === 'conditional_multiple_choice' &&
                    getVisibleSubQuestions(question.id).map((sub, subIdx) => (
                      <div
                        key={sub.id}
                        className='ml-4 flex flex-col gap-3 border-l-2 border-[var(--neutral-300)] pl-4'
                      >
                        <PreviewQuestion
                          idx={idx}
                          parentIndex={idx}
                          subIndex={subIdx}
                          question={sub}
                          responses={responses}
                          onRespond={handleRespond}
                        />
                        {errors[sub.id] && (
                          <p
                            className='text-[12px] font-medium text-[var(--error)]'
                            role='alert'
                            aria-live='polite'
                          >
                            {errors[sub.id]}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit button */}
      {topLevelQuestions.length > 0 && (
        <div className='flex justify-end'>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className='h-12 rounded-lg px-6 text-[16px] font-medium'
          >
            {loading ? tForm('submitting') : tForm('submitResponse')}
          </Button>
        </div>
      )}
    </div>
  );
}
