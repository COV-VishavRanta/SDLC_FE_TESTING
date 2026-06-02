export interface StartImpersonationInput {
  targetUserId: string;
}

export interface StartImpersonationVariables {
  input: StartImpersonationInput;
}

export interface ImpersonationPayload {
  success: boolean;
  message: string;
}

export interface StartImpersonationResponse {
  startImpersonation: ImpersonationPayload;
}

export interface StopImpersonationResponse {
  stopImpersonation: ImpersonationPayload;
}
