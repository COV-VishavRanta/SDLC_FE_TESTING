import { DateRangeEnum } from '@/constant';
import { AuditLogType, PaginationInfo } from '@/types/graphql.types';

/*
-----------------AUDIT LOGS-----------------
*/

export interface GetAuditLogsVariables {
  page?: number; // default: 1
  pageSize?: number; // default: 20
  filter?: AuditLogsFilterInput;
}

export interface AuditLogsFilterInput {
  search?: string;
  roleIds?: string[]; // UUID[]
  pspIds?: string[]; // UUID[]
  dateRange?: DateRangeEnum;
}

export interface GetAuditLogsResponse {
  auditLogs: {
    success: boolean;
    message: string;
    logs: AuditLogType[];
    pagination: PaginationInfo;
  };
}
