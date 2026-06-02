import { gql } from '@apollo/client';

import { PAGINATION_FIELDS, PSP_WITH_ADMINS_FIELDS } from '../../fragments';

/**
 * Fetch all PSPs with server-side pagination, filtering, and sorting
 */
export const GET_PSPS = gql`
  query GetPSPs($page: Int, $pageSize: Int, $filter: PSPFilterInput, $sort: PSPSortInput) {
    psps(page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      totalPsps
      activePsps
      inactivePsps
      psps {
        ...PspWithAdminsFields
        createdAt
      }
      pagination {
        ...PaginationFields
      }
    }
  }
  ${PSP_WITH_ADMINS_FIELDS}
  ${PAGINATION_FIELDS}
`;

/**
 * Fetch full details of a single PSP by ID
 * Returns all PSP fields including admins and production operators
 */
export const GET_PSP_DETAILS = gql`
  query GetPSPDetails($id: UUID!) {
    pspDetails(id: $id) {
      success
      message
      psp {
        ...PspWithAdminsFields
        createdBy
        createdAt
        activeProductionOperators {
          id
          name
          email
        }
      }
    }
  }
  ${PSP_WITH_ADMINS_FIELDS}
`;
