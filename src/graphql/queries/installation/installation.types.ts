import { InstallationProofDetailType } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// INSTALLATION PROOF QUERIES – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------GET INSTALLATION PROOF DETAIL-----------------
*/

export interface GetInstallationProofDetailVariables {
  orderItemId: string;
}

export interface GetInstallationProofDetailResponse {
  installationProofDetail: InstallationProofDetailType;
}
