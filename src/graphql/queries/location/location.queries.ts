import { gql } from '@apollo/client';

/**
 * Fetch all countries
 */
export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      id
      name
      abbr
    }
  }
`;

/**
 * Fetch states by country ID
 */
export const GET_STATES = gql`
  query GetStates($countryId: UUID!) {
    states(countryId: $countryId) {
      id
      name
      abbr
      countryId
    }
  }
`;
