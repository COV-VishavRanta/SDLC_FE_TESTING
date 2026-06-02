'use client';

/* eslint-disable camelcase */

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { CalendarIcon } from '../../icons/CalendarIcon';
import { CheckboxIcon } from '../../icons/CheckboxIcon';
import { ConditionalIcon } from '../../icons/ConditionalIcon';
import { DropdownIcon } from '../../icons/DropdownIcon';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import { RadioButtonIcon } from '../../icons/RadioButtonIcon';
import { TextInputIcon } from '../../icons/TextInputIcon';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { QUESTION_TYPES, QuestionType } from '../survey-creator.types';

/* ── Type icons for popover picker ── */
const TYPE_ICONS: Record<QuestionType, React.ReactNode> = {
  text_input: <TextInputIcon className='size-4 text-[var(--primary-500)]' aria-hidden='true' />,
  text_area: <FileTextIcon className='size-4 text-[var(--primary-500)]' aria-hidden='true' />,
  multiple_choice: (
    <RadioButtonIcon className='size-4 text-[var(--primary-500)]' aria-hidden='true' />
  ),
  checkbox: <CheckboxIcon className='size-4 text-[var(--primary-500)]' aria-hidden='true' />,
  date: <CalendarIcon className='size-4 text-[var(--primary-500)]' aria-hidden='true' />,
  dropdown: <DropdownIcon className='size-4 text-[var(--primary-500)]' aria-hidden='true' />,
  conditional_multiple_choice: (
    <ConditionalIcon className='size-4 text-[var(--primary-500)]' aria-hidden='true' />
  ),
};

/* ══════════════════════════════════════════════════════════════════
 * QuestionTypePicker (popover-based, used in settings panel too)
 * ══════════════════════════════════════════════════════════════════ */

interface QuestionTypePickerProps {
  onSelect: (type: QuestionType) => void;
  excludeConditional?: boolean;
  trigger?: React.ReactNode;
}

export function QuestionTypePicker({
  onSelect,
  excludeConditional = false,
  trigger,
}: QuestionTypePickerProps) {
  const tQuestions = useTranslations('surveyManagement.template.common-template.questions');
  const [open, setOpen] = useState(false);

  const availableTypes = excludeConditional
    ? QUESTION_TYPES.filter((type) => type !== 'conditional_multiple_choice')
    : QUESTION_TYPES;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          trigger ? (
            <span>{trigger}</span>
          ) : (
            <Button size='sm' className='gap-1.5'>
              <PlusIcon className='size-4' aria-hidden='true' />
              {tQuestions('addQuestion')}
            </Button>
          )
        }
      />
      <PopoverContent align='start' className='w-64 p-2' side='bottom' sideOffset={6}>
        <p
          id='question-type-picker-label'
          className='mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-600)]'
        >
          {tQuestions('questionTypeLabel')}
        </p>
        <div
          className='flex flex-col gap-0.5'
          role='listbox'
          aria-labelledby='question-type-picker-label'
        >
          {availableTypes.map((type) => (
            <button
              key={type}
              type='button'
              role='option'
              aria-selected='false'
              className='flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-400)]'
              onClick={() => {
                onSelect(type);
                setOpen(false);
              }}
            >
              <span className='flex size-7 shrink-0 items-center justify-center rounded-md bg-[var(--primary-100,#f7f9fb)]'>
                {TYPE_ICONS[type]}
              </span>
              <span className='flex flex-col'>
                <span className='text-[13px] font-medium text-[var(--neutral-900)]'>
                  {tQuestions(`questionTypes.${type}`)}
                </span>
                <span className='text-[11px] text-[var(--neutral-600)]'>
                  {tQuestions(`questionTypeDescriptions.${type}`)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * Radio / Checkbox preview shapes
 * ══════════════════════════════════════════════════════════════════ */

export function RadioPreview() {
  return (
    <div
      className='size-5 shrink-0 rounded-full border-2 border-[var(--neutral-300)]'
      aria-hidden='true'
    />
  );
}

export function CheckboxPreview() {
  return (
    <div
      className='size-5 shrink-0 rounded border-2 border-[var(--neutral-300)]'
      aria-hidden='true'
    />
  );
}
