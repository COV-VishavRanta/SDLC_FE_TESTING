import {
  SURVEY_LIST_ITEM_FRAGMENT,
  SURVEY_TEMPLATE_FRAGMENT,
} from '@/graphql/fragments/survey.fragments';
import { gql } from '@apollo/client';

export const GET_SURVEY_TEMPLATES = gql`
  ${SURVEY_TEMPLATE_FRAGMENT}
  query ListSurveyTemplates(
    $pspId: UUID!
    $page: Int = 1
    $pageSize: Int = 20
    $search: String
    $sort: SurveyTemplateSortInput
    $isActive: Boolean = true
  ) {
    listSurveyTemplates(
      pspId: $pspId
      page: $page
      pageSize: $pageSize
      search: $search
      sort: $sort
      isActive: $isActive
    ) {
      success
      message
      surveyTemplates {
        ...SurveyTemplateFields
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_SURVEY_TEMPLATE_DETAIL = gql`
  ${SURVEY_TEMPLATE_FRAGMENT}
  query SurveyTemplateDetail($surveyTemplateId: UUID!) {
    surveyTemplateDetail(surveyTemplateId: $surveyTemplateId) {
      success
      message
      surveyTemplate {
        ...SurveyTemplateFields
      }
    }
  }
`;

export const GET_SURVEYS = gql`
  ${SURVEY_LIST_ITEM_FRAGMENT}
  query ListSurveys(
    $page: Int = 1
    $pageSize: Int = 20
    $search: String
    $sort: SurveySortInput
    $statusFilter: SurveyStatusEnum
    $brandId: UUID
    $storeId: UUID
  ) {
    listSurveys(
      page: $page
      pageSize: $pageSize
      search: $search
      sort: $sort
      statusFilter: $statusFilter
      brandId: $brandId
      storeId: $storeId
    ) {
      success
      message
      surveys {
        ...SurveyListItemFields
      }
      summary {
        totalCount
        activeCount
        closedCount
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_SURVEYS_STAT_CARDS = gql`
  query ListSurveys(
    $page: Int = 1
    $pageSize: Int = 20
    $search: String
    $sort: SurveySortInput
    $statusFilter: SurveyStatusEnum
    $brandId: UUID
    $storeId: UUID
  ) {
    listSurveys(
      page: $page
      pageSize: $pageSize
      search: $search
      sort: $sort
      statusFilter: $statusFilter
      brandId: $brandId
      storeId: $storeId
    ) {
      summary {
        totalCount
        activeCount
        closedCount
      }
    }
  }
`;

export const GET_SURVEY_DETAIL = gql`
  query SurveyDetail($surveyId: UUID!) {
    surveyDetail(surveyId: $surveyId) {
      success
      message
      survey {
        id
        name
        description
        status
        schemaJson
        templateId
        brandGroups {
          brandId
          brandName
          stores {
            storeId
            storeName
            status
            surveyResponseId
          }
        }
      }
    }
  }
`;

export const GET_SURVEY_UNASSIGNED_BRANDS = gql`
  query SurveyUnassignedBrands($surveyId: UUID!) {
    surveyUnassignedBrands(surveyId: $surveyId) {
      success
      message
      brands {
        id
        name
      }
    }
  }
`;

export const GET_SURVEY_UNASSIGNED_STORES = gql`
  query SurveyUnassignedStores($surveyId: UUID!, $brandId: UUID!) {
    surveyUnassignedStores(surveyId: $surveyId, brandId: $brandId) {
      success
      message
      stores {
        id
        name
        storeNumber
      }
    }
  }
`;

export const GET_SURVEY_RESPONSE = gql`
  query SurveyResponse($surveyResponseId: UUID!) {
    surveyResponse(surveyResponseId: $surveyResponseId) {
      success
      message
      surveyResponse {
        id
        surveyId
        storeId
        brandId
        schemaJson
        responseJson
        submittedAt
      }
    }
  }
`;
