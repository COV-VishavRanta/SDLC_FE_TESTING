import { SURVEY_TEMPLATE_FRAGMENT } from '@/graphql/fragments/survey.fragments';
import { gql } from '@apollo/client';

export const CREATE_SURVEY_TEMPLATE = gql`
  ${SURVEY_TEMPLATE_FRAGMENT}
  mutation CreateSurveyTemplate($input: CreateSurveyTemplateInput!) {
    createSurveyTemplate(input: $input) {
      success
      message
      surveyTemplate {
        ...SurveyTemplateFields
      }
    }
  }
`;

export const UPDATE_SURVEY_TEMPLATE = gql`
  ${SURVEY_TEMPLATE_FRAGMENT}
  mutation UpdateSurveyTemplate($input: UpdateSurveyTemplateInput!) {
    updateSurveyTemplate(input: $input) {
      success
      message
      surveyTemplate {
        ...SurveyTemplateFields
      }
    }
  }
`;

export const DELETE_SURVEY_TEMPLATE = gql`
  mutation DeleteSurveyTemplate($surveyTemplateId: UUID!) {
    deleteSurveyTemplate(surveyTemplateId: $surveyTemplateId) {
      success
      message
    }
  }
`;

export const TOGGLE_SURVEY_TEMPLATE_STATUS = gql`
  ${SURVEY_TEMPLATE_FRAGMENT}
  mutation ToggleSurveyTemplateStatus($input: SetSurveyTemplateStatusInput!) {
    toggleSurveyTemplateStatus(input: $input) {
      success
      message
      surveyTemplate {
        ...SurveyTemplateFields
      }
    }
  }
`;

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($input: CreateSurveyInput!) {
    createSurvey(input: $input) {
      success
      message
      survey {
        id
        name
        status
      }
    }
  }
`;

export const UPDATE_SURVEY = gql`
  mutation UpdateSurvey($input: UpdateSurveyInput!) {
    updateSurvey(input: $input) {
      success
      message
      survey {
        id
        name
        status
      }
    }
  }
`;

export const DELETE_SURVEY = gql`
  mutation DeleteSurvey($surveyId: UUID!) {
    deleteSurvey(surveyId: $surveyId) {
      success
      message
    }
  }
`;

export const ASSIGN_SURVEY_TO_BRANDS = gql`
  mutation AssignSurveyToBrands($input: AssignSurveyBrandsInput!) {
    assignSurveyToBrands(input: $input) {
      success
      message
      survey {
        id
        name
        status
      }
    }
  }
`;

export const ASSIGN_SURVEY_TO_STORES = gql`
  mutation AssignSurveyToStores($input: AssignSurveyStoresInput!) {
    assignSurveyToStores(input: $input) {
      success
      message
      survey {
        id
        name
        status
      }
    }
  }
`;

export const SUBMIT_SURVEY_RESPONSE = gql`
  mutation SubmitSurveyResponse($input: SubmitSurveyResponseInput!) {
    submitSurveyResponse(input: $input) {
      success
      message
    }
  }
`;

export const CLOSE_SURVEY = gql`
  mutation CloseSurvey($surveyId: UUID!) {
    closeSurvey(surveyId: $surveyId) {
      success
      message
      survey {
        id
        name
        status
      }
    }
  }
`;
