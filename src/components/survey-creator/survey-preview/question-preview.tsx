'use client';

import {
  Calendar,
  CalendarIcon,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TemplateQuestion } from '../survey-creator.types';

/* ── Required mark ── */
function RequiredMark() {
  return (
    <span className='ml-0.5 text-[var(--error)]' aria-hidden='true'>
      *
    </span>
  );
}

/* ── Preview question renderer ── */
interface PreviewQuestionProps {
  question: TemplateQuestion;
  responses: Record<string, string>;
  onRespond: (questionId: string, value: string) => void;
  idx: number;
  parentIndex?: number;
  subIndex?: number;
}

export default function PreviewQuestion({
  question,
  responses,
  onRespond,
  idx,
  parentIndex,
  subIndex,
}: PreviewQuestionProps) {
  const t = useTranslations('surveyPreview');
  const opts = question.options ?? [];
  const responseValue = responses[question.id] ?? '';
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const isSubQuestion = parentIndex !== undefined && subIndex !== undefined;
  const questionNumber = isSubQuestion
    ? (() => {
        const parentNum = String(parentIndex + 1).padStart(2, '0');
        const subSuffix = String(subIndex + 1); // 1, 2, 3…
        return `Q${parentNum}.${subSuffix}`;
      })()
    : `Q${String(idx + 1).padStart(2, '0')}`;

  return (
    <div className='flex flex-col gap-2'>
      {/* Label */}
      <p className='text-[14px] font-medium leading-normal text-[var(--neutral-900)]'>
        {/* Q number */}
        <span className='block mb-[15px] text-[14px] font-normal leading-5 text-[var(--neutral-1000)]'>
          {questionNumber}&nbsp;&nbsp;
        </span>
        {question.label}
        {question.required && <RequiredMark />}
      </p>

      {/* Text Input */}
      {question.type === 'text_input' && (
        <Input
          value={responseValue}
          placeholder={question.placeholder ?? t('typeYourAnswer')}
          onChange={(e) => {
            onRespond(question.id, e.target.value);
          }}
          className='h-11 rounded-lg border-[var(--neutral-300)] bg-white px-3 text-[14px] text-[var(--neutral-700)]'
          aria-label={question.label}
        />
      )}

      {/* Text Area */}
      {question.type === 'text_area' && (
        <Textarea
          value={responseValue}
          placeholder={question.placeholder ?? t('typeYourAnswer')}
          className='min-h-[90px] rounded-lg border-[var(--neutral-300)] bg-white p-3 text-[14px] text-[var(--neutral-700)]'
          onChange={(e) => {
            onRespond(question.id, e.target.value);
          }}
          aria-label={question.label}
        />
      )}

      {/* Multiple Choice / Conditional Multiple Choice */}
      {(question.type === 'multiple_choice' || question.type === 'conditional_multiple_choice') && (
        <div className='flex flex-col gap-5' role='radiogroup' aria-label={question.label}>
          {opts.map((opt) => (
            <label key={opt.id} className='flex cursor-pointer items-center gap-2'>
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white',
                  responseValue === opt.id
                    ? 'border-[var(--primary-500)]'
                    : 'border-[var(--neutral-300)]',
                )}
              >
                {responseValue === opt.id && (
                  <span className='size-2.5 rounded-full bg-[var(--primary-500)]' />
                )}
              </span>
              <input
                type='radio'
                name={`preview-${question.id}`}
                value={opt.id}
                checked={responseValue === opt.id}
                onChange={() => {
                  onRespond(question.id, opt.id);
                }}
                className='sr-only'
              />
              <span className='text-[14px] font-normal text-[var(--neutral-600)]'>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Checkbox */}
      {question.type === 'checkbox' && (
        <div className='flex flex-col gap-5' role='group' aria-label={question.label}>
          {opts.map((opt) => {
            const selected = responseValue.split(',').includes(opt.id);
            return (
              <label key={opt.id} className='flex cursor-pointer items-center gap-2'>
                <Checkbox
                  checked={selected}
                  onCheckedChange={(checked) => {
                    const current = responseValue ? responseValue.split(',') : [];
                    const updated = checked
                      ? [...current, opt.id]
                      : current.filter((v) => v !== opt.id);
                    onRespond(question.id, updated.join(','));
                  }}
                  className='bg-white'
                />
                <span className='text-[14px] font-normal text-[var(--neutral-600)]'>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Dropdown */}
      {question.type === 'dropdown' && (
        <Select
          value={responseValue}
          onValueChange={(val) => {
            onRespond(question.id, val ?? '');
          }}
          aria-label={question.label}
        >
          <SelectTrigger
            className='w-full h-11 border-[var(--neutral-300)] bg-white'
            aria-label={question.label}
          >
            <SelectValue placeholder={t('selectOption')}>
              {responseValue
                ? opts.find((opt) => opt.id === responseValue)?.label
                : t('selectOption')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {opts.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Date */}
      {question.type === 'date' && (
        <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
          <PopoverTrigger
            aria-label={question.label}
            className={cn(
              'flex h-11 w-full items-center justify-between rounded-lg border border-[var(--neutral-300)] bg-white px-3 text-[14px] text-[var(--neutral-700)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-300)] outline-none',
              !responseValue && 'text-[var(--neutral-500)]',
            )}
          >
            {responseValue ? format(new Date(responseValue), 'PPP') : <span>{t('pickDate')}</span>}
            <CalendarIcon className='h-4 w-4 opacity-50' />
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={responseValue ? new Date(responseValue) : undefined}
              onSelect={(date) => {
                if (date) {
                  onRespond(question.id, format(date, 'yyyy-MM-dd'));
                  setDatePopoverOpen(false);
                } else {
                  onRespond(question.id, '');
                }
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
