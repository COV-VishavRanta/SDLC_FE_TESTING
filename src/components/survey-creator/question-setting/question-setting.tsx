'use client';

import { InfoCircleIcon, Input, PlusIcon, Switch, Textarea, TrashIcon } from '@/components';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

import { useSurveyCreator } from '../SurveyCreatorContext';
import {
  HAS_OPTIONS,
  HAS_PLACEHOLDER,
  MAX_TITLE_LENGTH,
  QuestionOption,
} from '../survey-creator.types';
import { SubQuestionSettingsItem } from './sub-question-setting';

/* ══════════════════════════════════════════════════════════════════
 * QuestionSettings — the public composition component
 * ══════════════════════════════════════════════════════════════════ */

export default function QuestionSettings() {
  const tSettings = useTranslations('surveyManagement.template.common-template.settings');
  const tQuestions = useTranslations('surveyManagement.template.common-template.questions');
  const {
    selectedQuestion: question,
    selectedIndex: index,
    updateQuestion,
    toggleRequired,
    addOption,
    updateOption,
    removeOption,
    setSelectedQuestionId,
    getSubQuestions,
    validationErrors,
  } = useSurveyCreator();

  /* ── Empty state ── */
  if (!question) {
    return (
      <div
        className='flex flex-col items-center gap-1 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] p-3'
        role='status'
        aria-live='polite'
      >
        <InfoCircleIcon className='size-6 text-[var(--neutral-600)]' aria-hidden='true' />
        <p className='text-[14px] font-semibold leading-5 text-[var(--neutral-700)]'>
          {tSettings('noSelection.title')}
        </p>
        <p className='text-center text-[12px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
          {tSettings('noSelection.description')}
        </p>
      </div>
    );
  }

  const questionNumber = String(index + 1).padStart(2, '0');
  const showOptions = HAS_OPTIONS.includes(question.type);
  const showPlaceholder = HAS_PLACEHOLDER.includes(question.type);
  const isConditional = question.type === 'conditional_multiple_choice';
  const isSubQuestion = question.parentId !== undefined;

  const qErrors = validationErrors[question.id];
  const labelInputId = `settings-label-input-${question.id}`;
  const labelErrorId = `settings-label-error-${question.id}`;
  const optionsErrorId = `settings-options-error-${question.id}`;

  const subQuestionsYes = isConditional ? getSubQuestions(question.id, 'yes') : [];
  const subQuestionsNo = isConditional ? getSubQuestions(question.id, 'no') : [];

  const typeLabel = tQuestions(`questionTypes.${question.type}`);

  return (
    <div className='flex flex-col gap-5 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] p-3'>
      {/* Header */}
      <div className='flex items-center gap-2 text-[14px] leading-5'>
        {isSubQuestion ? (
          <span className='rounded bg-[var(--neutral-300)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--neutral-700)]'>
            {tSettings('subQuestionBadge')}
          </span>
        ) : (
          <span className='font-normal text-[var(--neutral-1000)]' aria-hidden='true'>
            {tQuestions('questionPrefix')}
            {questionNumber}
          </span>
        )}
        <span className='font-semibold text-[var(--primary-500)]'>{typeLabel}</span>
      </div>

      {/* Question Label */}
      <div className='flex flex-col gap-1'>
        <label
          htmlFor={labelInputId}
          className='text-[12px] font-medium uppercase leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'
        >
          {tSettings('questionLabel')}
        </label>
        <Input
          id={labelInputId}
          value={question.label}
          maxLength={MAX_TITLE_LENGTH}
          aria-invalid={!!qErrors?.label}
          aria-describedby={qErrors?.label ? labelErrorId : undefined}
          onChange={(e) => {
            updateQuestion(question.id, { label: e.target.value });
          }}
          className={cn(
            'rounded-lg border-[var(--neutral-300)] bg-white p-3 text-[14px] font-medium text-[var(--neutral-900)]',
            qErrors?.label && 'border-[var(--error)] focus-visible:ring-[var(--error)]',
          )}
        />
        <div className='flex items-center justify-between'>
          {qErrors?.label ? (
            <p
              id={labelErrorId}
              role='alert'
              className='text-[11px] font-medium text-[var(--error)]'
            >
              {qErrors.label}
            </p>
          ) : (
            <span />
          )}
          <span
            className={cn(
              'text-[11px] text-[var(--neutral-500)]',
              question.label.length > MAX_TITLE_LENGTH && 'text-[var(--error)]',
            )}
          >
            {question.label.length}/{MAX_TITLE_LENGTH}
          </span>
        </div>
      </div>

      {/* Options (for choice-based types) */}
      {showOptions && (
        <div className='flex flex-col gap-1'>
          <p
            id={`options-label-${question.id}`}
            className='text-[12px] font-medium uppercase leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'
          >
            {tSettings('optionsLabel')}
          </p>
          <div
            className='flex flex-col gap-2'
            role='list'
            aria-labelledby={`options-label-${question.id}`}
          >
            {(question.options ?? []).map((opt: QuestionOption, optIdx: number) => (
              <div key={opt.id} className='flex items-center gap-2' role='listitem'>
                <span
                  className='text-[16px] font-normal leading-5 text-[var(--neutral-500)]'
                  aria-hidden='true'
                >
                  {optIdx + 1}.
                </span>
                <Input
                  value={opt.label}
                  aria-label={`Option ${optIdx + 1}`}
                  onChange={(e) => {
                    updateOption(opt.id, e.target.value);
                  }}
                  className={cn(
                    'flex-1 rounded-lg border-[var(--neutral-300)] bg-white p-3 text-[16px] font-normal text-[var(--neutral-700)]',
                    qErrors?.options &&
                      !opt.label.trim() &&
                      'border-[var(--error)] focus-visible:ring-[var(--error)]',
                  )}
                />
                <button
                  type='button'
                  onClick={() => {
                    removeOption(opt.id);
                  }}
                  className='flex size-6 shrink-0 cursor-pointer items-center justify-center rounded transition-colors hover:bg-[var(--neutral-100)]'
                  aria-label={tSettings('removeOption', { index: optIdx + 1 })}
                >
                  <TrashIcon className='size-3 text-[var(--error)]' aria-hidden='true' />
                </button>
              </div>
            ))}
          </div>
          {qErrors?.options && (
            <p
              id={optionsErrorId}
              role='alert'
              className='text-[11px] font-medium text-[var(--error)]'
            >
              {qErrors.options}
            </p>
          )}
        </div>
      )}

      {/* Placeholder (for text types) */}
      {showPlaceholder && (
        <div className='flex flex-col gap-1'>
          <label
            htmlFor={`placeholder-input-${question.id}`}
            className='text-[12px] font-medium uppercase leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'
          >
            {tSettings('placeholderLabel')}
          </label>
          <Textarea
            id={`placeholder-input-${question.id}`}
            value={question.placeholder ?? ''}
            onChange={(e) => {
              updateQuestion(question.id, { placeholder: e.target.value });
            }}
            placeholder={tSettings('placeholderInput')}
            className='min-h-[90px] rounded-lg border-[var(--neutral-300)] bg-white p-3 text-[14px] text-[var(--neutral-1000)] placeholder:text-[var(--neutral-1000)]'
          />
        </div>
      )}

      {/* Conditional sub-questions management */}
      {isConditional && (
        <div className='flex flex-col gap-4'>
          <p className='text-[12px] font-medium uppercase leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
            {tSettings('conditionalFollowUp')}
          </p>
          <p className='text-[11px] text-[var(--neutral-600)]'>
            {tSettings('conditionalDescription')}
          </p>

          {/* YES branch */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <span className='text-[12px] font-semibold text-[var(--green-500)]'>
                {tSettings('whenYes')}
              </span>
            </div>
            {subQuestionsYes.length > 0 ? (
              <div className='flex flex-col gap-1.5'>
                {subQuestionsYes.map((sub) => (
                  <SubQuestionSettingsItem
                    key={sub.id}
                    question={sub}
                    triggerLabel={tQuestions('yes').toUpperCase()}
                    onSelect={() => {
                      setSelectedQuestionId(sub.id);
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className='text-[11px] italic text-[var(--neutral-600)]'>
                {tSettings('noYesFollowUp')}
              </p>
            )}
          </div>

          <div className='h-px bg-[var(--neutral-300)]' aria-hidden='true' />

          {/* NO branch */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <span className='text-[12px] font-semibold text-[var(--error)]'>
                {tSettings('whenNo')}
              </span>
            </div>
            {subQuestionsNo.length > 0 ? (
              <div className='flex flex-col gap-1.5'>
                {subQuestionsNo.map((sub) => (
                  <SubQuestionSettingsItem
                    key={sub.id}
                    question={sub}
                    triggerLabel={tQuestions('no').toUpperCase()}
                    onSelect={() => {
                      setSelectedQuestionId(sub.id);
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className='text-[11px] italic text-[var(--neutral-600)]'>
                {tSettings('noNoFollowUp')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer: Add Option + Required toggle */}
      <div className='flex items-center justify-between'>
        {showOptions ? (
          <button
            type='button'
            onClick={addOption}
            className='flex cursor-pointer items-center gap-2 rounded text-[12px] font-medium text-[var(--primary-400)]'
          >
            <PlusIcon className='size-3.5 text-[var(--primary-400)]' aria-hidden='true' />
            {tSettings('addOption')}
          </button>
        ) : (
          <div />
        )}
        <div className='flex items-center gap-1'>
          <Switch
            id={`setting-required-${question.id}`}
            checked={question.required}
            onCheckedChange={() => {
              toggleRequired(question.id);
            }}
            aria-label={tSettings('toggleRequired')}
          />
          <label
            htmlFor={`setting-required-${question.id}`}
            className='text-[14px] font-normal text-[var(--neutral-900)]'
          >
            {tSettings('required')}
          </label>
        </div>
      </div>
    </div>
  );
}
