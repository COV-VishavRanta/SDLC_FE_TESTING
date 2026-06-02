'use client';

import { DragHandleIcon, Switch, TrashIcon } from '@/components';
import { CopyIcon } from '@/components/icons/CopyIcon';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslations } from 'next-intl';
import { type CSSProperties } from 'react';

import { TemplateQuestion, ValidationErrorMap } from '../survey-creator.types';
import { CheckboxPreview, RadioPreview } from './question-preview';

/* ══════════════════════════════════════════════════════════════════
 * SubQuestionCard (sortable, inside Yes/No sections)
 * ══════════════════════════════════════════════════════════════════ */

interface SubQuestionCardProps {
  question: TemplateQuestion;
  parentIndex: number;
  subIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleRequired: () => void;
  validationErrors: ValidationErrorMap;
}

export default function SubQuestionCard({
  question,
  parentIndex,
  subIndex,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  onToggleRequired,
  validationErrors,
}: SubQuestionCardProps) {
  const tQuestions = useTranslations('surveyManagement.template.common-template.questions');
  const tSettings = useTranslations('surveyManagement.template.common-template.settings');
  const subErrors = validationErrors[question.id];
  const labelErrorId = `sub-q-label-err-${question.id}`;
  const optionsErrorId = `sub-q-opts-err-${question.id}`;
  const typeLabel = tQuestions(`questionTypes.${question.type}`);
  const parentNumber = String(parentIndex + 1).padStart(2, '0');
  const subSuffix =
    question.parentTriggerValue === 'no'
      ? String.fromCharCode(97 + subIndex) // a, b, c…
      : String(subIndex + 1); // 1, 2, 3…
  const subNumber = `${tQuestions('questionPrefix')}${parentNumber}.${subSuffix}`;

  const hasChoices =
    question.type === 'multiple_choice' ||
    question.type === 'checkbox' ||
    question.type === 'dropdown';

  const isTextType = question.type === 'text_area' || question.type === 'text_input';

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button
        type='button'
        onClick={onSelect}
        aria-pressed={isSelected}
        aria-label={`${subNumber} ${typeLabel}${question.label ? `: ${question.label}` : ''}`}
        className={cn(
          'w-full cursor-pointer rounded-lg border bg-white p-2.5 text-left transition-shadow',
          isSelected
            ? 'border-[var(--primary-500)] shadow-[0_0_0_2px_var(--primary-500)]'
            : subErrors
              ? 'border-[var(--error)]'
              : 'border-[var(--neutral-300)]',
        )}
      >
        {/* Header: Drag handle + sub-question number + type */}
        <div className='flex items-center gap-3'>
          <span
            {...attributes}
            {...listeners}
            className='shrink-0 cursor-grab active:cursor-grabbing'
            onClick={(e) => {
              e.stopPropagation();
            }}
            role='button'
            tabIndex={0}
            aria-label={tQuestions('dragToReorder')}
          >
            <DragHandleIcon className='size-5 text-[var(--neutral-1000)]' aria-hidden='true' />
          </span>
          <span
            className='block text-[14px] font-normal leading-5 text-[var(--neutral-1000)]'
            aria-hidden='true'
          >
            {subNumber}
          </span>
          <span
            className='text-[14px] font-semibold leading-5 text-[var(--primary-500)]'
            aria-hidden='true'
          >
            {typeLabel}
          </span>
        </div>

        {/* Sub-question label */}
        <div className='mt-4 flex flex-col gap-0.5'>
          <div className='flex items-center gap-1'>
            <p
              className={cn(
                'text-[14px] font-medium leading-normal',
                question.label ? 'text-[var(--neutral-900)]' : 'italic text-[var(--neutral-600)]',
              )}
            >
              {question.label || tQuestions('untitledQuestion')}
            </p>
            {question.required && (
              <span className='text-[16px] text-[var(--error)]' aria-label='required'>
                *
              </span>
            )}
          </div>
          {subErrors?.label && (
            <p
              id={labelErrorId}
              role='alert'
              className='text-[11px] font-medium text-[var(--error)]'
            >
              {subErrors.label}
            </p>
          )}
          {subErrors?.options && (
            <p
              id={optionsErrorId}
              role='alert'
              className='text-[11px] font-medium text-[var(--error)]'
            >
              {subErrors.options}
            </p>
          )}
        </div>

        {/* Options preview (for choice-based types) */}
        {hasChoices && question.options && question.options.length > 0 && (
          <div className='mt-2 flex flex-col gap-4' aria-hidden='true'>
            {question.options.map((opt) => (
              <div key={opt.id} className='flex items-center gap-2'>
                {question.type === 'checkbox' ? <CheckboxPreview /> : <RadioPreview />}
                <span className='text-[14px] font-normal text-[var(--neutral-600)]'>
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Date preview */}
        {question.type === 'date' && (
          <div className='mt-2' aria-hidden='true'>
            <div className='flex h-9 w-full items-center rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-50,#fafafa)] px-3'>
              <span className='text-[14px] text-[var(--neutral-1000)]'>
                {question.placeholder ?? tQuestions('selectDate')}
              </span>
            </div>
          </div>
        )}

        {/* Text area / Text Input preview */}
        {isTextType && (
          <div className='mt-2' aria-hidden='true'>
            <div
              className={cn(
                'flex w-full items-start rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-50,#fafafa)] px-3 py-2.5',
                question.type === 'text_area' ? 'min-h-[80px]' : 'h-9',
              )}
            >
              <span className='text-[14px] text-[var(--neutral-1000)]'>
                {question.placeholder ?? tQuestions('typeHere')}
              </span>
            </div>
          </div>
        )}

        {/* Dropdown preview */}
        {question.type === 'dropdown' && (
          <div className='mt-2' aria-hidden='true'>
            <div className='flex h-9 w-full items-center justify-between rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-50,#fafafa)] px-3'>
              <span className='text-[14px] text-[var(--neutral-1000)]'>
                {tQuestions('selectOption')}
              </span>
              <svg
                className='size-4 text-[var(--neutral-500)]'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
                aria-hidden='true'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
              </svg>
            </div>
          </div>
        )}

        {/* Footer: Copy + Delete + Required toggle */}
        <div className='mt-4 flex items-center justify-end gap-4 border-t border-[var(--neutral-300)] pt-2.5'>
          <div className='flex items-center gap-1'>
            <span
              role='button'
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onDuplicate();
                }
              }}
              className='flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[var(--neutral-100)]'
            >
              <CopyIcon className='size-4 text-[var(--neutral-600)]' aria-hidden='true' />
            </span>
            <span
              role='button'
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onDelete();
                }
              }}
              className='flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[var(--neutral-100)]'
              aria-label={tQuestions('deleteSubQuestion')}
            >
              <TrashIcon className='size-4 text-[var(--error)]' aria-hidden='true' />
            </span>
          </div>
          <div
            className='flex items-center gap-1'
            onClick={(e) => {
              e.stopPropagation();
            }}
            role='presentation'
          >
            <Switch
              id={`sub-required-switch-${question.id}`}
              checked={question.required}
              onCheckedChange={() => {
                onToggleRequired();
              }}
              aria-label={tSettings('toggleRequired')}
            />
            <label
              htmlFor={`sub-required-switch-${question.id}`}
              className='text-[14px] font-normal text-[var(--neutral-900)]'
            >
              {tQuestions('required')}
            </label>
          </div>
        </div>
      </button>
    </div>
  );
}
