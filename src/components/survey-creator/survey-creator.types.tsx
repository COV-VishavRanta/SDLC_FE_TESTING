/* eslint-disable camelcase */
/**
 * Survey Creator — Type Definitions
 *
 * Central source of truth for all types used across the survey creator
 * composition components (QuestionBuilder, QuestionSettings, SurveyPreview).
 */

import {
  CalendarIcon,
  CheckboxIcon,
  DropdownIcon,
  FileTextIcon,
  QuestionConditionalIcon,
  QuestionDropdownIcon,
  RadioButtonIcon,
  TextInputIcon,
} from '..';
import { EditIcon } from '../icons/EditIcon';

export const QUESTION_TYPES = [
  'text_input',
  'text_area',
  'multiple_choice',
  'checkbox',
  'date',
  'dropdown',
  'conditional_multiple_choice',
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export interface QuestionOption {
  id: string;
  label: string;
}

/**
 * A single survey question.
 * Sub-questions (children of a conditional_multiple_choice parent)
 * have `parentId` and `parentTriggerValue` set.
 */
export interface TemplateQuestion {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  /** 1-based display order. Top-level only. */
  order: number;
  options?: QuestionOption[];
  placeholder?: string;
  /** Set when this question is a direct child of a conditional_multiple_choice question */
  parentId?: string;
  /** The Yes/No answer that causes this sub-question to appear */
  parentTriggerValue?: 'yes' | 'no';
}

export interface TemplateBasicInfo {
  name: string;
  purpose: string;
  endDate: string;
}

/** Final JSON schema output produced by the template builder */
export interface TemplateSchema extends TemplateBasicInfo {
  questions: TemplateQuestion[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface QuestionValidationErrors {
  label?: string;
  options?: string;
}

export type ValidationErrorMap = Record<string, QuestionValidationErrors>;

/** Per-type configuration driving UI behaviour */
export interface QuestionTypeConfig {
  label: string;
  description: string;
  hasOptions: boolean;
  hasPlaceholder: boolean;
  defaultOptions: QuestionOption[];
}

/* ── Static default options ── */

const DEFAULT_CHOICE_OPTIONS: QuestionOption[] = [
  { id: 'default-opt-1', label: 'Option 1' },
  { id: 'default-opt-2', label: 'Option 2' },
];

export const YES_NO_OPTIONS: QuestionOption[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

/* ── Question type registry ── */

export const QUESTION_TYPE_CONFIG: Record<QuestionType, QuestionTypeConfig> = {
  text_input: {
    label: 'Text Input',
    description: 'Single-line text answer',
    hasOptions: false,
    hasPlaceholder: true,
    defaultOptions: [],
  },
  text_area: {
    label: 'Text Area',
    description: 'Multi-line text answer',
    hasOptions: false,
    hasPlaceholder: true,
    defaultOptions: [],
  },
  multiple_choice: {
    label: 'Multiple Choice',
    description: 'Respondent selects one answer',
    hasOptions: true,
    hasPlaceholder: false,
    defaultOptions: DEFAULT_CHOICE_OPTIONS,
  },
  checkbox: {
    label: 'Checkbox',
    description: 'Check all that apply',
    hasOptions: true,
    hasPlaceholder: false,
    defaultOptions: DEFAULT_CHOICE_OPTIONS,
  },
  date: {
    label: 'Date',
    description: 'Date picker input',
    hasOptions: false,
    hasPlaceholder: false,
    defaultOptions: [],
  },
  dropdown: {
    label: 'Dropdown',
    description: 'Dropdown with one selection',
    hasOptions: true,
    hasPlaceholder: false,
    defaultOptions: DEFAULT_CHOICE_OPTIONS,
  },
  conditional_multiple_choice: {
    label: 'Conditional Multiple Choice',
    description: 'Yes/No with conditional follow-up questions',
    hasOptions: false,
    hasPlaceholder: false,
    defaultOptions: YES_NO_OPTIONS,
  },
};

/* ── Constraints ── */
export const MAX_QUESTIONS = 50;
export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 20;
export const MAX_TITLE_LENGTH = 500;

/* ── Context value shape ── */

export interface SurveyCreatorContextValue {
  questions: TemplateQuestion[];
  selectedQuestionId: string | null;
  selectedQuestion: TemplateQuestion | null;
  selectedIndex: number;
  topLevelQuestions: TemplateQuestion[];
  sortableIds: string[];

  /* CRUD */
  addQuestion: (type: QuestionType) => void;
  addSubQuestion: (parentId: string, triggerValue: 'yes' | 'no', type: QuestionType) => void;
  duplicateQuestion: (id: string) => void;
  duplicateSubQuestion: (id: string) => void;
  deleteQuestion: (id: string) => void;
  deleteSubQuestion: (id: string) => void;
  updateQuestion: (id: string, updates: Partial<TemplateQuestion>) => void;
  reorderQuestions: (oldIndex: number, newIndex: number) => void;
  reorderSubQuestions: (
    parentId: string,
    triggerValue: 'yes' | 'no',
    oldIndex: number,
    newIndex: number,
  ) => void;
  toggleRequired: (id: string) => void;
  setSelectedQuestionId: (id: string | null) => void;

  /* Sub-question helpers */
  getSubQuestions: (parentId: string, triggerValue: 'yes' | 'no') => TemplateQuestion[];

  /* Option helpers */
  addOption: () => void;
  updateOption: (optionId: string, value: string) => void;
  removeOption: (optionId: string) => void;

  /* Validation */
  validationErrors: ValidationErrorMap;
  validate: () => boolean;
  clearValidationErrors: () => void;
}

interface QuestionTypeOption {
  type: QuestionType;
  icon: React.ComponentType<{ className?: string }>;
}

export const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  { type: 'text_input', icon: EditIcon },
  { type: 'text_area', icon: FileTextIcon },
  { type: 'multiple_choice', icon: RadioButtonIcon },
  { type: 'checkbox', icon: CheckboxIcon },
  { type: 'dropdown', icon: QuestionDropdownIcon },
  { type: 'date', icon: CalendarIcon },
  { type: 'conditional_multiple_choice', icon: QuestionConditionalIcon },
];

export const SUB_QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  { type: 'text_input', icon: TextInputIcon },
  { type: 'text_area', icon: FileTextIcon },
  { type: 'multiple_choice', icon: RadioButtonIcon },
  { type: 'checkbox', icon: CheckboxIcon },
  { type: 'dropdown', icon: DropdownIcon },
  { type: 'date', icon: CalendarIcon },
];

export const HAS_OPTIONS: QuestionType[] = ['multiple_choice', 'checkbox', 'dropdown'];

export const HAS_PLACEHOLDER: QuestionType[] = ['text_input', 'text_area'];
