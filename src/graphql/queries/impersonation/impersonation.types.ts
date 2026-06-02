import { UserType } from '@/types';

export interface ImpersonationStatusType {
  isImpersonating: boolean;
  targetUser?: UserType;
  impersonator?: UserType;
}

export interface GetImpersonationStatusResponse {
  impersonationStatus: ImpersonationStatusType;
}
