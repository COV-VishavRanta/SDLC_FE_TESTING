'use client';

import { ShipmentReorderStatusEnum, UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  ACTION_EXCEPTION_REQUEST,
  ActionExceptionRequestResponse,
  ActionExceptionRequestVariables,
  GET_EXCEPTION_REQUEST_DETAILS,
  GetExceptionRequestDetailsResponse,
  GetExceptionRequestDetailsVariables,
  ReorderImageInput,
  UPDATE_EXCEPTION_REQUEST,
  UpdateExceptionRequestResponse,
  UpdateExceptionRequestVariables,
} from '@/graphql';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_EXCEPTION_REQUEST_CAPABILITIES,
  EXCEPTION_REQUEST_CAMPAIGN_MANAGER_UNASSIGNED_CAPABILITIES,
  EXCEPTION_REQUEST_CAPABILITIES_MAP,
} from '@/lib';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function useReorderDetailsContext(reorderId: string) {
  const t = useTranslations('reorderDetails');
  const roleBasedCapabilities = useCapabilities(
    EXCEPTION_REQUEST_CAPABILITIES_MAP,
    DEFAULT_EXCEPTION_REQUEST_CAPABILITIES,
  );
  const { currentUserRole, currentUserData } = useGlobalProtected();
  const currentUserId = currentUserData?.me?.id;

  const { data, refetch } = useSuspenseQuery<
    GetExceptionRequestDetailsResponse,
    GetExceptionRequestDetailsVariables
  >(GET_EXCEPTION_REQUEST_DETAILS, {
    variables: { reorderId },
    fetchPolicy: 'network-only',
  });

  const exceptionRequest = data?.getExceptionRequestDetails?.exceptionRequest;

  const caps = useMemo(() => {
    const isUnassignedCampaignManager =
      currentUserRole === UserRole.CAMPAIGN_MANAGER &&
      exceptionRequest?.campaignManagerId !== currentUserId;

    return isUnassignedCampaignManager
      ? EXCEPTION_REQUEST_CAMPAIGN_MANAGER_UNASSIGNED_CAPABILITIES
      : roleBasedCapabilities;
  }, [currentUserRole, currentUserId, exceptionRequest?.campaignManagerId, roleBasedCapabilities]);

  // ── Dialog state ──
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [isViewPhotosOpen, setIsViewPhotosOpen] = useState(false);

  // ── Mutations ──
  const [actionExceptionRequest, { loading: actioning }] = useMutation<
    ActionExceptionRequestResponse,
    ActionExceptionRequestVariables
  >(ACTION_EXCEPTION_REQUEST);

  const [updateExceptionRequest, { loading: updating }] = useMutation<
    UpdateExceptionRequestResponse,
    UpdateExceptionRequestVariables
  >(UPDATE_EXCEPTION_REQUEST);

  // ── Actions ──
  const handleApprove = async () => {
    if (!exceptionRequest?.id) return;
    try {
      const { data: result } = await actionExceptionRequest({
        variables: {
          input: {
            reorderId: exceptionRequest.id,
            action: ShipmentReorderStatusEnum.APPROVED,
          },
        },
      });
      if (result?.actionExceptionRequest.success) {
        toast.success(t('toasts.approveSuccess'));
        await refetch();
      } else {
        toast.error(result?.actionExceptionRequest.message ?? t('toasts.approveFailed'));
      }
    } catch {
      toast.error(t('toasts.approveFailed'));
    }
  };

  const handleReject = async (reason: string) => {
    if (!exceptionRequest?.id) return;
    const { data: result } = await actionExceptionRequest({
      variables: {
        input: {
          reorderId: exceptionRequest.id,
          action: ShipmentReorderStatusEnum.REJECTED,
          reason,
        },
      },
    });
    if (result?.actionExceptionRequest.success) {
      toast.success(t('toasts.rejectSuccess'));
      setIsRejectDialogOpen(false);
      await refetch();
    } else {
      toast.error(result?.actionExceptionRequest.message ?? t('toasts.rejectFailed'));
      throw new Error(result?.actionExceptionRequest.message ?? t('toasts.rejectFailed'));
    }
  };

  const handleCancel = async (reason: string) => {
    if (!exceptionRequest?.id) return;
    const { data: result } = await actionExceptionRequest({
      variables: {
        input: {
          reorderId: exceptionRequest.id,
          action: ShipmentReorderStatusEnum.CANCELLED,
          reason,
        },
      },
    });
    if (result?.actionExceptionRequest.success) {
      toast.success(t('toasts.cancelSuccess'));
      setIsCancelDialogOpen(false);
      await refetch();
    } else {
      toast.error(result?.actionExceptionRequest.message ?? t('toasts.cancelFailed'));
      throw new Error(result?.actionExceptionRequest.message ?? t('toasts.cancelFailed'));
    }
  };

  const handleReUpload = async (reason: string, images: ReorderImageInput[]) => {
    if (!exceptionRequest?.id) return;
    const { data: result } = await updateExceptionRequest({
      variables: {
        input: {
          reorderId: exceptionRequest.id,
          reason,
          images,
        },
      },
    });
    if (result?.updateExceptionRequest.success) {
      toast.success(t('toasts.reUploadSuccess'));
      setIsExceptionDialogOpen(false);
      await refetch();
    } else {
      toast.error(result?.updateExceptionRequest.message ?? t('toasts.reUploadFailed'));
      throw new Error(result?.updateExceptionRequest.message ?? t('toasts.reUploadFailed'));
    }
  };

  const isWorking = actioning || updating;

  return {
    exceptionRequest,
    caps,
    isWorking,
    // dialogs
    isRejectDialogOpen,
    isCancelDialogOpen,
    isExceptionDialogOpen,
    isViewPhotosOpen,
    setIsRejectDialogOpen,
    setIsCancelDialogOpen,
    setIsExceptionDialogOpen,
    setIsViewPhotosOpen,
    // handlers
    handleApprove,
    handleReject,
    handleCancel,
    handleReUpload,
  } as const;
}
