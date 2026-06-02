import { gql } from '@apollo/client';

import { PAGINATION_FIELDS } from '../../fragments';

/**
 * List audit logs with pagination, filters, and sorting
 */
export const GET_AUDIT_LOGS = gql`
  query AuditLogs($page: Int = 1, $pageSize: Int = 20, $filter: AuditFilterInput) {
    auditLogs(page: $page, pageSize: $pageSize, filter: $filter) {
      success
      message
      logs {
        id
        actorEmail
        action
        entityType
        entityId
        entityName
        oldValue
        newValue
        ipAddress
        userAgent
        createdAt
        actorRoles {
          id
          name
          description
        }
        actorDisplayName
        pspName
        isViewable
        isThirdParty
        isImpersonated
      }
      pagination {
        ...PaginationFields
      }
    }
  }
  ${PAGINATION_FIELDS}
`;
