// ─────────────────────────────────────────────────────────────────────────────
// INSTALLATION PROOF MUTATIONS – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------GENERATE INSTALLATION UPLOAD URL-----------------
*/

export interface InstallationImageUploadInput {
  name: string;
}

export interface GenerateInstallationUploadUrlInput {
  orderItemId: string;
  images: InstallationImageUploadInput[];
}

export interface GenerateInstallationUploadUrlVariables {
  input: GenerateInstallationUploadUrlInput;
}

export interface InstallationImageUploadType {
  name: string;
  key: string;
  uploadUrl: string;
}

export interface GenerateInstallationUploadUrlPayload {
  success: boolean;
  message: string;
  uploads: InstallationImageUploadType[];
}

export interface GenerateInstallationUploadUrlResponse {
  generateInstallationUploadUrl: GenerateInstallationUploadUrlPayload;
}

/*
-----------------SUBMIT INSTALLATION PROOF-----------------
*/

export interface InstallationImageInput {
  name: string;
  type: string;
  key: string;
}

export interface OrderItemProofInput {
  orderItemId: string;
  images: InstallationImageInput[];
  notes?: string;
}

export interface SubmitInstallationProofInput {
  orderId: string;
  items: OrderItemProofInput[];
}

export interface SubmitInstallationProofVariables {
  input: SubmitInstallationProofInput;
}

export interface SubmitInstallationProofPayload {
  success: boolean;
  message: string;
}

export interface SubmitInstallationProofResponse {
  submitInstallationProof: SubmitInstallationProofPayload;
}

/*
-----------------REVIEW INSTALLATION PROOF-----------------
*/

export interface ReviewOrderItemInput {
  orderItemId: string;
  approved: boolean;
  notes?: string;
}

export interface ReviewInstallationProofInput {
  orderId: string;
  approved?: boolean;
  notes?: string;
  items: ReviewOrderItemInput[];
}

export interface ReviewInstallationProofVariables {
  input: ReviewInstallationProofInput;
}

export interface ReviewInstallationProofPayload {
  success: boolean;
  message: string;
}

export interface ReviewInstallationProofResponse {
  reviewInstallationProof: ReviewInstallationProofPayload;
}
