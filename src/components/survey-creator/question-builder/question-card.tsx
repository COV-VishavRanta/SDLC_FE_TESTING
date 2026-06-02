'use client';

import { Button, DragHandleIcon, Switch, TrashIcon } from '@/components';
import { CopyIcon } from '@/components/icons/CopyIcon';
import { cn } from '@/lib/utils';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslations } from 'next-intl';
import { type CSSProperties, useCallback, useState } from 'react';

import {
  QuestionType,
  SUB_QUESTION_TYPE_OPTIONS,
  TemplateQuestion,
  ValidationErrorMap,
} from '../survey-creator.types';
import { CheckboxPreview, RadioPreview } from './question-preview';
import SubQuestionCard from './sub-question-card';

/* ══════════════════════════════════════════════════════════════════
 * QuestionCard (sortable, main card)
 * ══════════════════════════════════════════════════════════════════ */

interface QuestionCardProps {
  question: TemplateQuestion;
  index: number;
  isSelected: boolean;
  subQuestionsYes: TemplateQuestion[];
  subQuestionsNo: TemplateQuestion[];
  selectedQuestionId: string | null;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleRequired: () => void;
  onSelectQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onToggleRequiredQuestion: (id: string) => void;
  onAddSubQuestion: (parentId: string, triggerValue: 'yes' | 'no', type: QuestionType) => void;
  onReorderSubQuestions: (
    parentId: string,
    triggerValue: 'yes' | 'no',
    oldIndex: number,
    newIndex: number,
  ) => void;
  validationErrors: ValidationErrorMap;
}

export default function QuestionCard({
  question,
  index,
  isSelected,
  subQuestionsYes,
  subQuestionsNo,
  selectedQuestionId,
  onSelect,
  onDuplicate,
  onDelete,
  onToggleRequired,
  onSelectQuestion,
  onDuplicateQuestion,
  onDeleteQuestion,
  onToggleRequiredQuestion,
  onAddSubQuestion,
  onReorderSubQuestions,
  validationErrors,
}: QuestionCardProps) {
  const tQuestions = useTranslations('surveyManagement.template.common-template.questions');
  const tSettings = useTranslations('surveyManagement.template.common-template.settings');
  const typeLabel = tQuestions(`questionTypes.${question.type}`);
  const questionNumber = String(index + 1).padStart(2, '0');
  const qErrors = validationErrors[question.id];
  const labelErrorId = `q-label-err-${question.id}`;
  const optionsErrorId = `q-opts-err-${question.id}`;

  const hasChoices =
    question.type === 'multiple_choice' ||
    question.type === 'checkbox' ||
    question.type === 'dropdown';

  const isTextType = question.type === 'text_area' || question.type === 'text_input';
  const isConditional = question.type === 'conditional_multiple_choice';

  const [showYesSection, setShowYesSection] = useState(() => subQuestionsYes.length > 0);
  const [showNoSection, setShowNoSection] = useState(() => subQuestionsNo.length > 0);
  const [showYesOptions, setShowYesOptions] = useState(false);
  const [showNoOptions, setShowNoOptions] = useState(false);

  const SUB_DND_ACTIVATION_DISTANCE = 8;

  const subSensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: SUB_DND_ACTIVATION_DISTANCE } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleYesDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = subQuestionsYes.findIndex((q) => q.id === active.id);
      const newIndex = subQuestionsYes.findIndex((q) => q.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      onReorderSubQuestions(question.id, 'yes', oldIndex, newIndex);
    },
    [subQuestionsYes, question.id, onReorderSubQuestions],
  );

  const handleNoDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = subQuestionsNo.findIndex((q) => q.id === active.id);
      const newIndex = subQuestionsNo.findIndex((q) => q.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      onReorderSubQuestions(question.id, 'no', oldIndex, newIndex);
    },
    [subQuestionsNo, question.id, onReorderSubQuestions],
  );

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
    <div ref={setNodeRef} style={style} className='flex flex-col gap-2'>
      <button
        type='button'
        onClick={onSelect}
        aria-pressed={isSelected}
        aria-label={`${tQuestions('questionPrefix')}${questionNumber} ${typeLabel}${question.label ? `: ${question.label}` : ''}`}
        className={cn(
          'w-full cursor-pointer rounded-lg border bg-[var(--neutral-200)] p-3 text-left transition-shadow',
          isSelected
            ? 'border-[var(--primary-500)] shadow-[0_0_0_2px_var(--primary-500)]'
            : qErrors
              ? 'border-[var(--error)]'
              : 'border-[var(--neutral-300)]',
        )}
      >
        {/* Header: Drag handle + Q number + Type */}
        <div className='flex items-center gap-3.5'>
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
            <DragHandleIcon className='size-6 text-[var(--neutral-1000)]' aria-hidden='true' />
          </span>
          <span
            className='block text-[14px] font-normal leading-5 text-[var(--neutral-1000)]'
            aria-hidden='true'
          >
            {tQuestions('questionPrefix')}
            {questionNumber}
          </span>
          <span
            className='text-[14px] font-semibold leading-5 text-[var(--primary-500)]'
            aria-hidden='true'
          >
            {typeLabel}
          </span>
        </div>

        {/* Question label */}
        <div className='mt-5 flex flex-col gap-0.5'>
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
          {qErrors?.label && (
            <p
              id={labelErrorId}
              role='alert'
              className='text-[11px] font-medium text-[var(--error)]'
            >
              {qErrors.label}
            </p>
          )}
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

        {/* Options preview (for choice-based types) */}
        {hasChoices && question.options && question.options.length > 0 && (
          <div className='mt-2 flex flex-col gap-5' aria-hidden='true'>
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
            <div className='flex h-11 w-full items-center rounded-lg border border-[var(--neutral-300)] bg-white px-3'>
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
                'flex w-full items-start rounded-lg border border-[var(--neutral-300)] bg-white px-3 py-3',
                question.type === 'text_area' ? 'min-h-[90px]' : 'h-11',
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
            <div className='flex h-11 w-full items-center justify-between rounded-lg border border-[var(--neutral-300)] bg-white px-3'>
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

        {/* Footer: Duplicate + Delete + Required toggle */}
        <div className='mt-5 flex items-center justify-end gap-5 border-t border-[var(--neutral-300)] pt-3'>
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
              className='flex size-[38px] cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[var(--neutral-100)]'
            >
              <CopyIcon className='size-[18px] text-[var(--neutral-600)]' aria-hidden='true' />
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
              className='flex size-[38px] cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[var(--neutral-100)]'
              aria-label={tQuestions('deleteQuestion')}
            >
              <TrashIcon className='size-[18px] text-[var(--error)]' aria-hidden='true' />
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
              id={`required-switch-${question.id}`}
              checked={question.required}
              onCheckedChange={() => {
                onToggleRequired();
              }}
              aria-label={tSettings('toggleRequired')}
            />
            <label
              htmlFor={`required-switch-${question.id}`}
              className='text-[14px] font-normal text-[var(--neutral-900)]'
            >
              {tQuestions('required')}
            </label>
          </div>
        </div>
      </button>

      {/* Interactive Yes/No sections for Conditional Multiple Choice */}
      {isConditional && (
        <div className='flex flex-col gap-3 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] p-3'>
          {/* ── YES section ── */}
          <div className='flex flex-col gap-3'>
            <button
              type='button'
              onClick={() => {
                setShowYesSection((prev) => !prev);
              }}
              aria-expanded={showYesSection}
              className='flex items-center gap-2'
            >
              <div
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                  showYesSection ? 'border-[var(--primary-500)]' : 'border-[var(--neutral-300)]',
                )}
                aria-hidden='true'
              >
                {showYesSection && (
                  <div className='size-2.5 rounded-full bg-[var(--primary-500)]' />
                )}
              </div>
              <span className='text-[14px] font-medium text-[var(--neutral-700)]'>
                {tQuestions('yes')}
              </span>
            </button>

            {showYesSection && (
              <div className='flex flex-col gap-3 pl-5'>
                {subQuestionsYes.length > 0 && (
                  <DndContext
                    sensors={subSensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleYesDragEnd}
                  >
                    <SortableContext
                      items={subQuestionsYes.map((q) => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className='flex flex-col gap-3'>
                        {subQuestionsYes.map((sub, subIdx) => (
                          <SubQuestionCard
                            key={sub.id}
                            question={sub}
                            parentIndex={index}
                            subIndex={subIdx}
                            isSelected={selectedQuestionId === sub.id}
                            onSelect={() => {
                              onSelectQuestion(sub.id);
                            }}
                            onDuplicate={() => {
                              onDuplicateQuestion(sub.id);
                            }}
                            onDelete={() => {
                              onDeleteQuestion(sub.id);
                            }}
                            onToggleRequired={() => {
                              onToggleRequiredQuestion(sub.id);
                            }}
                            validationErrors={validationErrors}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                {!showYesOptions && (
                  <Button
                    className='h-12 w-fit rounded-lg bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-6 text-[16px] font-medium text-white hover:opacity-90'
                    onClick={() => {
                      setShowYesOptions(true);
                    }}
                  >
                    {tQuestions('addQuestion')}
                  </Button>
                )}

                {showYesOptions && (
                  <div
                    className='flex flex-wrap items-center gap-5 rounded-lg bg-[var(--neutral-200)] p-3'
                    role='group'
                    aria-label={tQuestions('questionTypeLabel')}
                  >
                    {SUB_QUESTION_TYPE_OPTIONS.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.type}
                          type='button'
                          onClick={() => {
                            onAddSubQuestion(question.id, 'yes', option.type);
                            setShowYesOptions(false);
                          }}
                          className='flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-3 text-[14px] font-normal leading-5 text-[var(--neutral-700)] transition-colors hover:bg-[var(--neutral-100)]'
                        >
                          <IconComponent
                            className='size-5 text-[var(--primary-500)]'
                            aria-hidden='true'
                          />
                          {tQuestions(`questionTypes.${option.type}`)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── NO section ── */}
          <div className='flex flex-col gap-3'>
            <button
              type='button'
              onClick={() => {
                setShowNoSection((prev) => !prev);
              }}
              aria-expanded={showNoSection}
              className='flex items-center gap-2'
            >
              <div
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                  showNoSection ? 'border-[var(--primary-500)]' : 'border-[var(--neutral-300)]',
                )}
                aria-hidden='true'
              >
                {showNoSection && <div className='size-2.5 rounded-full bg-[var(--primary-500)]' />}
              </div>
              <span className='text-[14px] font-medium text-[var(--neutral-700)]'>
                {tQuestions('no')}
              </span>
            </button>

            {showNoSection && (
              <div className='flex flex-col gap-3 pl-5'>
                {subQuestionsNo.length > 0 && (
                  <DndContext
                    sensors={subSensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleNoDragEnd}
                  >
                    <SortableContext
                      items={subQuestionsNo.map((q) => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className='flex flex-col gap-3'>
                        {subQuestionsNo.map((sub, subIdx) => (
                          <SubQuestionCard
                            key={sub.id}
                            question={sub}
                            parentIndex={index}
                            subIndex={subIdx}
                            isSelected={selectedQuestionId === sub.id}
                            onSelect={() => {
                              onSelectQuestion(sub.id);
                            }}
                            onDuplicate={() => {
                              onDuplicateQuestion(sub.id);
                            }}
                            onDelete={() => {
                              onDeleteQuestion(sub.id);
                            }}
                            onToggleRequired={() => {
                              onToggleRequiredQuestion(sub.id);
                            }}
                            validationErrors={validationErrors}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                {!showNoOptions && (
                  <Button
                    className='h-12 w-fit rounded-lg bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-6 text-[16px] font-medium text-white hover:opacity-90'
                    onClick={() => {
                      setShowNoOptions(true);
                    }}
                  >
                    {tQuestions('addQuestion')}
                  </Button>
                )}

                {showNoOptions && (
                  <div
                    className='flex flex-wrap items-center gap-5 rounded-lg bg-[var(--neutral-200)] p-3'
                    role='group'
                    aria-label={tQuestions('questionTypeLabel')}
                  >
                    {SUB_QUESTION_TYPE_OPTIONS.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.type}
                          type='button'
                          onClick={() => {
                            onAddSubQuestion(question.id, 'no', option.type);
                            setShowNoOptions(false);
                          }}
                          className='flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-3 text-[14px] font-normal leading-5 text-[var(--neutral-700)] transition-colors hover:bg-[var(--neutral-100)]'
                        >
                          <IconComponent
                            className='size-5 text-[var(--primary-500)]'
                            aria-hidden='true'
                          />
                          {tQuestions(`questionTypes.${option.type}`)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
