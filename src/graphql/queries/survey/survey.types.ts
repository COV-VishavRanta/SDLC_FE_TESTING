import { SurveySortField, SurveyStatusEnum, SurveyTemplateSortField } from '@/constant';
import {
  PaginationInfo,
  SurveyDetailType,
  SurveyListItemType,
  SurveyListSummary,
  SurveyResponseDetailType,
  SurveyTemplateType,
  SurveyUnassignedBrandItem,
  SurveyUnassignedStoreItem,
} from '@/types';

export interface ListSurveyTemplatesData {
  listSurveyTemplates: {
    success: boolean;
    message: string;
    surveyTemplates?: SurveyTemplateType[];
    pagination?: PaginationInfo;
  };
}

export interface SurveyTemplateSortInput {
  field?: SurveyTemplateSortField;
  order?: string;
}

export interface SurveySortInput {
  field?: SurveySortField;
  order?: string;
}

export interface ListSurveyTemplatesVars {
  pspId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: SurveyTemplateSortInput;
  isActive?: boolean;
}

export interface SurveyTemplateDetailData {
  surveyTemplateDetail: {
    success: boolean;
    message: string;
    surveyTemplate?: SurveyTemplateType;
  };
}

export interface SurveyTemplateDetailVars {
  surveyTemplateId: string;
}

export interface ListSurveysData {
  listSurveys: {
    success: boolean;
    message: string;
    surveys?: SurveyListItemType[];
    summary?: SurveyListSummary;
    pagination?: PaginationInfo;
  };
}

export interface ListSurveysVars {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: SurveySortInput;
  statusFilter?: SurveyStatusEnum;
  brandId?: string;
  storeId?: string;
}

export interface SurveyDetailData {
  surveyDetail: {
    success: boolean;
    message: string;
    survey?: SurveyDetailType;
  };
}

export interface SurveyDetailVars {
  surveyId: string;
}

export interface SurveyUnassignedBrandsPayload {
  surveyUnassignedBrands: {
    success: boolean;
    message: string;
    brands: SurveyUnassignedBrandItem[];
  };
}

export interface SurveyUnassignedBrandsVars {
  surveyId: string;
}

export interface SurveyUnassignedStoresPayload {
  surveyUnassignedStores: {
    success: boolean;
    message: string;
    stores: SurveyUnassignedStoreItem[];
  };
}

export interface SurveyUnassignedStoresVars {
  surveyId: string;
  brandId: string;
}

export interface SurveyResponseData {
  surveyResponse: {
    success: boolean;
    message: string;
    surveyResponse?: SurveyResponseDetailType;
  };
}

export interface SurveyResponseVars {
  surveyResponseId: string;
}
