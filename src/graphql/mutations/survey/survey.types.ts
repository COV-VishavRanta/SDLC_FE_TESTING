import { SurveyResponseDetailType, SurveyTemplateType, SurveyType } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// SURVEY TEMPLATE MUTATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateSurveyTemplateInput {
  pspId: string;
  name: string;
  schemaJson: string; // JSON
}

export interface CreateSurveyTemplateVariables {
  input: CreateSurveyTemplateInput;
}

export interface UpdateSurveyTemplateInput {
  surveyTemplateId: string;
  name: string;
  schemaJson: string; // JSON
}

export interface UpdateSurveyTemplateVariables {
  input: UpdateSurveyTemplateInput;
}

export interface SetSurveyTemplateStatusInput {
  surveyTemplateId: string;
  isActive: boolean;
}

export interface ToggleSurveyTemplateStatusVariables {
  input: SetSurveyTemplateStatusInput;
}

export interface SurveyTemplatePayload {
  success: boolean;
  message: string;
  surveyTemplate?: SurveyTemplateType;
}

export interface CreateSurveyTemplateResponse {
  createSurveyTemplate: SurveyTemplatePayload;
}

export interface UpdateSurveyTemplateResponse {
  updateSurveyTemplate: SurveyTemplatePayload;
}

export interface DeleteSurveyTemplatePayload {
  success: boolean;
  message: string;
}

export interface DeleteSurveyTemplateVariables {
  surveyTemplateId: string;
}

export interface DeleteSurveyTemplateResponse {
  deleteSurveyTemplate: DeleteSurveyTemplatePayload;
}

export interface ToggleSurveyTemplateStatusPayload {
  success: boolean;
  message: string;
  surveyTemplate?: SurveyTemplateType;
}

export interface ToggleSurveyTemplateStatusResponse {
  toggleSurveyTemplateStatus: ToggleSurveyTemplateStatusPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// SURVEY MUTATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateSurveyInput {
  pspId: string;
  name: string;
  description: string;
  schemaJson: string; // JSON
  surveyTemplateId?: string;
}

export interface CreateSurveyVariables {
  input: CreateSurveyInput;
}

export interface CreateSurveyResponse {
  createSurvey: {
    success: boolean;
    message: string;
    survey?: SurveyType;
  };
}

export interface UpdateSurveyInput {
  surveyId: string;
  name: string;
  description: string;
  schemaJson: string; // JSON
  surveyTemplateId?: string | null;
}

export interface UpdateSurveyVariables {
  input: UpdateSurveyInput;
}

export interface UpdateSurveyResponse {
  updateSurvey: {
    success: boolean;
    message: string;
    survey?: SurveyType;
  };
}

export interface DeleteSurveyPayload {
  success: boolean;
  message: string;
}

export interface DeleteSurveyVariables {
  surveyId: string;
}

export interface DeleteSurveyResponse {
  deleteSurvey: DeleteSurveyPayload;
}

export interface CloseSurveyVariables {
  surveyId: string;
}

export interface CloseSurveyResponse {
  closeSurvey: {
    success: boolean;
    message: string;
    survey?: SurveyType;
  };
}

export interface AssignSurveyBrandsInput {
  surveyId: string;
  brandIds: string[];
}

export interface AssignSurveyToBrandsVariables {
  input: AssignSurveyBrandsInput;
}

export interface AssignSurveyToBrandsResponse {
  assignSurveyToBrands: {
    success: boolean;
    message: string;
    survey?: SurveyType;
  };
}

export interface AssignSurveyStoresInput {
  surveyId: string;
  brandId: string;
  storeIds: string[];
}

export interface AssignSurveyToStoresVariables {
  input: AssignSurveyStoresInput;
}

export interface AssignSurveyToStoresResponse {
  assignSurveyToStores: {
    success: boolean;
    message: string;
    survey?: SurveyType;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SURVEY RESPONSE MUTATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SubmitSurveyResponseInput {
  surveyId: string;
  responseJson: string; // JSON
}

export interface SubmitSurveyResponseVariables {
  input: SubmitSurveyResponseInput;
}

export interface SurveyResponsePayload {
  success: boolean;
  message: string;
}

export interface SubmitSurveyResponseResponse {
  submitSurveyResponse: SurveyResponsePayload;
}

// Keep for backward compatibility
export type { SurveyResponseDetailType };
