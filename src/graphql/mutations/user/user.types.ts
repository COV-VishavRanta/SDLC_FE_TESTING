import { UserType } from '@/types';

/*
-----------------CREATE USER-----------------
*/

export interface CreateNewUserArguments {
  input: CreateNewUserInput;
}

export interface CreateNewUserInput {
  fullName: string;
  email: string;
  roleIds: string[];
  pspIds?: string[];
  brandIds?: string[];
  storeIds?: string[];
}

export interface CreateNewUserResponse {
  createUser: {
    success: boolean;
    message: string;
    user?: UserType;
  };
}

/*
-----------------UPDATE USER-----------------
*/

export interface UpdateUserArguments {
  input: UpdateUserInput;
}

export interface UpdateUserInput {
  userId: string;
  fullName?: string;
  email?: string;
  roleIds?: string[];
  pspIds?: string[];
  brandIds?: string[];
  storeIds?: string[];
}

export interface UpdateUserResponse {
  updateUser: {
    user: UserType;
    success: boolean;
    message: string;
    campaignNames: string[]; // List of campaigns the user is associated with (if any)
  };
}

/*
-----------------DELETE USER-----------------
*/

export interface DeleteUserArguments {
  input: DeleteUserInput;
}

export interface DeleteUserInput {
  userId: string;
}

export interface DeleteUserResponse {
  deleteUser: {
    success: boolean;
    message: string;
  };
}

/*
-----------------TOGGLE USER ACTIVE STATUS-----------------
*/
export interface ToggleUserActiveStatusArguments {
  input: ToggleUserActiveStatusInput;
}

export interface ToggleUserActiveStatusInput {
  userId: string;
  isActive: boolean;
}

export interface ToggleUserActiveStatusResponse {
  toggleUserActiveStatus: {
    success: boolean;
    message: string;
    constraintNames: string[]; // List of constraint names preventing the action (if any)
  };
}

/*
-----------------RESEND INVITATION-----------------
*/

export interface ResendInvitationArguments {
  input: ResendInvitationInput;
}

export interface ResendInvitationInput {
  userId: string;
}

export interface ResendInvitationResponse {
  resendInvitation: {
    success: boolean;
    message: string;
  };
}
