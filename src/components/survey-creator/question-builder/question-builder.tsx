'use client';

import { Button } from '@/components';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { QUESTION_TYPE_OPTIONS } from '../survey-creator.types';
import { useSurveyCreator } from '../SurveyCreatorContext';
import QuestionCard from './question-card';

/* ══════════════════════════════════════════════════════════════════
 * Question type option config (shared between top-level & inline)
 * ══════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════
 * QuestionBuilder — the public composition component
 * ══════════════════════════════════════════════════════════════════ */

const DND_ACTIVATION_DISTANCE = 8;

export function QuestionBuilder() {
  const tQuestions = useTranslations('surveyManagement.template.common-template.questions');
  const [showOptions, setShowOptions] = useState(false);
  const {
    topLevelQuestions,
    sortableIds,
    selectedQuestionId,
    addQuestion,
    addSubQuestion,
    duplicateQuestion,
    duplicateSubQuestion,
    deleteQuestion,
    deleteSubQuestion,
    reorderQuestions,
    reorderSubQuestions,
    toggleRequired,
    setSelectedQuestionId,
    getSubQuestions,
    validationErrors,
  } = useSurveyCreator();

  /* DnD sensors — MouseSensor + TouchSensor for cross-device support */
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: DND_ACTIVATION_DISTANCE } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = topLevelQuestions.findIndex((q) => q.id === active.id);
      const newIndex = topLevelQuestions.findIndex((q) => q.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      reorderQuestions(oldIndex, newIndex);
    },
    [topLevelQuestions, reorderQuestions],
  );

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1 leading-5 tracking-[-0.15px] sm:flex-row sm:items-center sm:justify-between sm:gap-0'>
        <h2 className='w-full text-[16px] font-medium text-[var(--neutral-900)] sm:w-auto'>
          {tQuestions('sectionTitle')}
        </h2>
        <p className='w-full text-[16px] font-medium text-[var(--neutral-1000)] sm:w-auto'>
          {tQuestions('dragShuffle')}
        </p>
      </div>
      <div className='flex flex-col gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
        {/* Question Cards with DnD */}
        {topLevelQuestions.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
              <div className='flex flex-col gap-5'>
                {topLevelQuestions.map((q, idx) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={idx}
                    isSelected={q.id === selectedQuestionId}
                    subQuestionsYes={getSubQuestions(q.id, 'yes')}
                    subQuestionsNo={getSubQuestions(q.id, 'no')}
                    selectedQuestionId={selectedQuestionId}
                    onSelect={() => {
                      setSelectedQuestionId(q.id);
                    }}
                    onDuplicate={() => {
                      duplicateQuestion(q.id);
                    }}
                    onDelete={() => {
                      deleteQuestion(q.id);
                    }}
                    onToggleRequired={() => {
                      toggleRequired(q.id);
                    }}
                    onSelectQuestion={setSelectedQuestionId}
                    onDuplicateQuestion={duplicateSubQuestion}
                    onDeleteQuestion={deleteSubQuestion}
                    onToggleRequiredQuestion={toggleRequired}
                    onAddSubQuestion={addSubQuestion}
                    onReorderSubQuestions={reorderSubQuestions}
                    validationErrors={validationErrors}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Add Question Button */}
        {!showOptions && (
          <Button
            className='h-12 w-fit rounded-lg bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-6 text-[16px] font-medium text-white hover:opacity-90'
            onClick={() => {
              setShowOptions(true);
            }}
          >
            {tQuestions('addQuestion')}
          </Button>
        )}

        {/* Question Type Options */}
        {showOptions && (
          <div
            className='flex flex-wrap items-center gap-5 rounded-lg bg-[var(--neutral-200)] p-3 relative'
            role='group'
            aria-label={tQuestions('questionTypeLabel')}
          >
            {QUESTION_TYPE_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.type}
                  type='button'
                  onClick={() => {
                    addQuestion(option.type);
                    setShowOptions(false);
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-3 text-[14px] font-normal leading-5 text-[var(--neutral-700)] transition-colors hover:bg-[var(--neutral-100)]'
                >
                  <IconComponent className='size-5 text-[var(--primary-500)]' aria-hidden='true' />
                  {tQuestions(`questionTypes.${option.type}`)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
