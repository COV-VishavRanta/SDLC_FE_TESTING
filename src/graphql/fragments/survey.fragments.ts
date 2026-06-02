import { gql } from '@apollo/client';

export const SURVEY_TEMPLATE_FRAGMENT = gql`
  fragment SurveyTemplateFields on SurveyTemplateType {
    id
    pspId
    name
    isActive
    schemaJson
    surveyCount
    createdBy
    createdAt
    updatedBy
    updatedAt
  }
`;

export const SURVEY_LIST_ITEM_FRAGMENT = gql`
  fragment SurveyListItemFields on SurveyListItemType {
    id
    pspId
    name
    description
    status
    createdAt
    brandCount
    firstBrandName
    storeCount
    firstStoreName
    responseCount
    surveyResponseId
  }
`;
