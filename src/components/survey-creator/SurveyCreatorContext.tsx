'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { arrayMove } from '@dnd-kit/sortable';

import {
  MAX_TITLE_LENGTH,
  QUESTION_TYPE_CONFIG,
  type QuestionType,
  type SurveyCreatorContextValue,
  type TemplateQuestion,
  type ValidationErrorMap,
  YES_NO_OPTIONS,
} from './survey-creator.types';

const OPTION_TYPES: QuestionType[] = ['multiple_choice', 'checkbox', 'dropdown'];

/* ── Context ── */

const SurveyCreatorContext = createContext<SurveyCreatorContextValue | null>(null);

export function useSurveyCreator(): SurveyCreatorContextValue {
  const ctx = useContext(SurveyCreatorContext);
  if (!ctx) {
    throw new Error('useSurveyCreator must be used within a <SurveyCreatorProvider>');
  }
  return ctx;
}

/* ── Helpers ── */

const generateId = () => crypto.randomUUID();

function createDefaultQuestion(
  type: QuestionType,
  order: number,
  parentId?: string,
  parentTriggerValue?: 'yes' | 'no',
): TemplateQuestion {
  const config = QUESTION_TYPE_CONFIG[type];
  const question: TemplateQuestion = {
    id: generateId(),
    type,
    label: '',
    required: false,
    order,
  };

  if (config.hasPlaceholder) {
    question.placeholder = '';
  }

  if (config.hasOptions) {
    question.options = config.defaultOptions.map((opt) => ({ ...opt, id: generateId() }));
  }

  if (type === 'conditional_multiple_choice') {
    question.options = YES_NO_OPTIONS.map((opt) => ({ ...opt }));
  }

  if (parentId !== undefined) {
    question.parentId = parentId;
    question.parentTriggerValue = parentTriggerValue;
  }

  return question;
}

/* ── Provider ── */

interface SurveyCreatorProviderProps {
  children: React.ReactNode;
  /** Pre-populate questions (e.g. edit mode) */
  initialQuestions?: TemplateQuestion[];
  /** Called whenever the questions array changes */
  onChange?: (questions: TemplateQuestion[]) => void;
}

export function SurveyCreatorProvider({
  children,
  initialQuestions = [],
  onChange,
}: SurveyCreatorProviderProps) {
  const [questions, setQuestions] = useState<TemplateQuestion[]>(initialQuestions);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorMap>({});

  /* Notify parent of changes */
  useEffect(() => {
    onChange?.(questions);
  }, [questions, onChange]);

  /* ── Validation ── */

  const validate = useCallback((): boolean => {
    const errors: ValidationErrorMap = {};
    if (questions.length === 0) {
      errors.root = { label: 'At least one question is required' };
    }
    for (const q of questions) {
      const qErrors: ValidationErrorMap[string] = {};
      if (!q.label.trim()) {
        qErrors.label = 'Question label is required';
      } else if (q.label.length > MAX_TITLE_LENGTH) {
        qErrors.label = `Question label must not exceed ${MAX_TITLE_LENGTH} characters`;
      }
      if (OPTION_TYPES.includes(q.type)) {
        if (!q.options || q.options.length === 0) {
          qErrors.options = 'At least one option is required';
        } else if (q.options.some((opt) => !opt.label.trim())) {
          qErrors.options = 'Options cannot be empty';
        }
      }
      if (Object.keys(qErrors).length > 0) {
        errors[q.id] = qErrors;
      }
    }
    setValidationErrors(errors);

    const errorCount = Object.keys(errors).length;
    if (errorCount > 0) {
      if (errors.root) {
        toast.error('Survey must contain at least one question.');
      } else {
        toast.error(
          `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}, please resolve to continue.`,
        );
      }
    }

    return errorCount === 0;
  }, [questions]);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  /* ── Derived values ── */
  const topLevelQuestions = useMemo(() => questions.filter((q) => !q.parentId), [questions]);
  const sortableIds = useMemo(() => topLevelQuestions.map((q) => q.id), [topLevelQuestions]);
  const selectedQuestion = useMemo(
    () => questions.find((q) => q.id === selectedQuestionId) ?? null,
    [questions, selectedQuestionId],
  );
  const selectedIndex = useMemo(
    () => topLevelQuestions.findIndex((q) => q.id === selectedQuestionId),
    [topLevelQuestions, selectedQuestionId],
  );

  const getSubQuestions = useCallback(
    (parentId: string, triggerValue: 'yes' | 'no') =>
      questions.filter((q) => q.parentId === parentId && q.parentTriggerValue === triggerValue),
    [questions],
  );

  /* ── CRUD ── */

  const addQuestion = useCallback((type: QuestionType) => {
    const newId = generateId();
    setQuestions((prev) => {
      const topCount = prev.filter((q) => !q.parentId).length;
      const newQ = createDefaultQuestion(type, topCount + 1);
      return [...prev, { ...newQ, id: newId }];
    });
    setSelectedQuestionId(newId);
  }, []);

  const addSubQuestion = useCallback(
    (parentId: string, triggerValue: 'yes' | 'no', type: QuestionType) => {
      const newId = generateId();
      setQuestions((prev) => {
        const parent = prev.find((q) => q.id === parentId);
        if (!parent || parent.parentId !== undefined) return prev;
        const existingSubs = prev.filter(
          (q) => q.parentId === parentId && q.parentTriggerValue === triggerValue,
        );
        const newQ = createDefaultQuestion(type, existingSubs.length + 1, parentId, triggerValue);
        return [...prev, { ...newQ, id: newId }];
      });
      setSelectedQuestionId(newId);
    },
    [],
  );

  const duplicateQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const qIndex = prev.findIndex((q) => q.id === id);
      if (qIndex === -1) return prev;
      const originalQ = prev[qIndex];
      const newId = generateId();

      const newOptions = originalQ.options?.map((opt) => ({ ...opt, id: generateId() }));
      const newQ: TemplateQuestion = { ...originalQ, id: newId };
      if (newOptions) newQ.options = newOptions;

      const duplicates: TemplateQuestion[] = [newQ];
      const subQs = prev.filter((q) => q.parentId === id);
      for (const subQ of subQs) {
        const newSubOptions = subQ.options?.map((opt) => ({ ...opt, id: generateId() }));
        const duplicatedSubQ: TemplateQuestion = { ...subQ, id: generateId(), parentId: newId };
        if (newSubOptions) duplicatedSubQ.options = newSubOptions;
        duplicates.push(duplicatedSubQ);
      }

      const updated = [...prev];
      updated.splice(qIndex + 1, 0, duplicates[0]);
      updated.push(...duplicates.slice(1));

      let topOrder = 0;
      return updated.map((q) => {
        if (!q.parentId) {
          topOrder += 1;
          return { ...q, order: topOrder };
        }
        return q;
      });
    });
  }, []);

  const duplicateSubQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const qIndex = prev.findIndex((q) => q.id === id);
      if (qIndex === -1) return prev;
      const originalQ = prev[qIndex];
      const newId = generateId();
      const newOptions = originalQ.options?.map((opt) => ({ ...opt, id: generateId() }));

      const duplicate: TemplateQuestion = { ...originalQ, id: newId };
      if (newOptions) duplicate.options = newOptions;

      const updated = [...prev];
      updated.splice(qIndex + 1, 0, duplicate);
      return updated;
    });
  }, []);

  const deleteQuestion = useCallback(
    (id: string) => {
      setQuestions((prev) => {
        const filtered = prev.filter((q) => q.id !== id && q.parentId !== id);
        let topOrder = 0;
        return filtered.map((q) => {
          if (!q.parentId) {
            topOrder += 1;
            return { ...q, order: topOrder };
          }
          return q;
        });
      });
      if (selectedQuestionId === id) {
        setSelectedQuestionId(null);
      }
    },
    [selectedQuestionId],
  );

  const deleteSubQuestion = useCallback(
    (id: string) => {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuestionId === id) {
        setSelectedQuestionId(null);
      }
    },
    [selectedQuestionId],
  );

  const updateQuestion = useCallback((id: string, updates: Partial<TemplateQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  }, []);

  const reorderQuestions = useCallback((oldIndex: number, newIndex: number) => {
    setQuestions((prev) => {
      const topLevel = prev.filter((q) => !q.parentId);
      const subQuestions = prev.filter((q) => q.parentId);
      const reordered = arrayMove(topLevel, oldIndex, newIndex).map((q, i) => ({
        ...q,
        order: i + 1,
      }));
      return [...reordered, ...subQuestions];
    });
  }, []);

  const reorderSubQuestions = useCallback(
    (parentId: string, triggerValue: 'yes' | 'no', oldIndex: number, newIndex: number) => {
      setQuestions((prev) => {
        const targetSubs = prev.filter(
          (q) => q.parentId === parentId && q.parentTriggerValue === triggerValue,
        );
        const reordered = arrayMove(targetSubs, oldIndex, newIndex);
        let reorderedIdx = 0;
        return prev.map((q) => {
          if (q.parentId === parentId && q.parentTriggerValue === triggerValue) {
            return reordered[reorderedIdx++];
          }
          return q;
        });
      });
    },
    [],
  );

  const toggleRequired = useCallback(
    (id: string) => {
      const q = questions.find((question) => question.id === id);
      if (q) {
        updateQuestion(id, { required: !q.required });
      }
    },
    [questions, updateQuestion],
  );

  /* ── Option helpers (operate on selectedQuestionId) ── */

  const addOption = useCallback(() => {
    if (!selectedQuestionId) return;
    const q = questions.find((question) => question.id === selectedQuestionId);
    if (!q) return;
    const newOption = { id: generateId(), label: `Option ${(q.options?.length ?? 0) + 1}` };
    updateQuestion(selectedQuestionId, { options: [...(q.options ?? []), newOption] });
  }, [selectedQuestionId, questions, updateQuestion]);

  const updateOption = useCallback(
    (optionId: string, value: string) => {
      if (!selectedQuestionId) return;
      const q = questions.find((question) => question.id === selectedQuestionId);
      if (!q) return;
      updateQuestion(selectedQuestionId, {
        options: (q.options ?? []).map((opt) =>
          opt.id === optionId ? { ...opt, label: value } : opt,
        ),
      });
    },
    [selectedQuestionId, questions, updateQuestion],
  );

  const removeOption = useCallback(
    (optionId: string) => {
      if (!selectedQuestionId) return;
      const q = questions.find((question) => question.id === selectedQuestionId);
      if (!q) return;
      updateQuestion(selectedQuestionId, {
        options: (q.options ?? []).filter((opt) => opt.id !== optionId),
      });
    },
    [selectedQuestionId, questions, updateQuestion],
  );

  /* ── Context value ── */
  const value: SurveyCreatorContextValue = useMemo(
    () => ({
      questions,
      selectedQuestionId,
      selectedQuestion,
      selectedIndex,
      topLevelQuestions,
      sortableIds,
      addQuestion,
      addSubQuestion,
      duplicateQuestion,
      duplicateSubQuestion,
      deleteQuestion,
      deleteSubQuestion,
      updateQuestion,
      reorderQuestions,
      reorderSubQuestions,
      toggleRequired,
      setSelectedQuestionId,
      getSubQuestions,
      addOption,
      updateOption,
      removeOption,
      validationErrors,
      validate,
      clearValidationErrors,
    }),
    [
      questions,
      selectedQuestionId,
      selectedQuestion,
      selectedIndex,
      topLevelQuestions,
      sortableIds,
      addQuestion,
      addSubQuestion,
      duplicateQuestion,
      duplicateSubQuestion,
      deleteQuestion,
      deleteSubQuestion,
      updateQuestion,
      reorderQuestions,
      toggleRequired,
      getSubQuestions,
      addOption,
      updateOption,
      removeOption,
      validationErrors,
      validate,
      clearValidationErrors,
      reorderSubQuestions,
    ],
  );

  return <SurveyCreatorContext value={value}>{children}</SurveyCreatorContext>;
}
