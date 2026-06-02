'use client';

import { useTranslations } from 'next-intl';

import { TemplateQuestion } from '../survey-creator.types';

/* ── Sub-question list item inside settings ── */
export function SubQuestionSettingsItem({
  question,
  triggerLabel,
  onSelect,
}: {
  question: TemplateQuestion;
  triggerLabel: string;
  onSelect: () => void;
}) {
  const tQuestions = useTranslations('surveyManagement.template.common-template.questions');

  const typeLabel = tQuestions(`questionTypes.${question.type}`);

  return (
    <div className='flex items-center gap-2 rounded-lg border border-[var(--neutral-300)] bg-white px-3 py-2'>
      <span className='shrink-0 rounded-full bg-[var(--primary-100,#f7f9fb)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--primary-500)]'>
        {triggerLabel}
      </span>
      <button
        type='button'
        className='flex-1 truncate text-left text-[12px] text-[var(--neutral-900)] underline-offset-2 hover:underline'
        onClick={onSelect}
      >
        {question.label || (
          <span className='italic text-[var(--neutral-600)]'>
            {tQuestions('untitledSubQuestion')}
          </span>
        )}
      </button>
      <span className='shrink-0 rounded bg-[var(--primary-100,#f7f9fb)] px-1.5 py-0.5 text-[10px] text-[var(--primary-500)]'>
        {typeLabel}
      </span>
    </div>
  );
}
