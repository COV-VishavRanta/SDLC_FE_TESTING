/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  EDITABLE_ONLY_CAMPAIGN_MANAGER_STATUSES,
  SortOrder,
  UserRole,
  UserSortField,
  UserStatusEnum,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  CREATE_CAMPAIGN,
  CreateCampaignResponse,
  CreateCampaignVariables,
  GET_CAMPAIGN,
  GET_USERS,
  GetUsersResponse,
  GetUsersVariables,
  LIST_CAMPAIGNS,
  UPDATE_CAMPAIGN,
  UpdateCampaignResponse,
  UpdateCampaignVariables,
} from '@/graphql';

import { useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CampaignDialogProps } from './campaign-dialog';
import { CampaignFormData, createCampaignFormSchema } from './campaign-dialog.schema';

/* ─── Constants ─── */
const INITIAL_FORM_DATA: CampaignFormData = {
  campaignName: '',
  campaignObjective: '',
  description: '',
  isPermanent: false,
  startDate: '',
  endDate: '',
  shipByDate: '',
  campaignManagerId: undefined,
};

export default function useCampaignDialog({
  mode,
  initialData,
  onSubmit,
  onClose,
  isCampaignManagerRole,
}: Omit<CampaignDialogProps, 'trigger'> & { isCampaignManagerRole?: boolean }) {
  const t = useTranslations('campaignManagement.dialog');
  const tMessages = useTranslations('campaignManagement.messages');
  const tValidation = useTranslations('campaignManagement.dialog.validation');
  const { selectedBrandId, allRoles, currentUserData } = useGlobalProtected();

  /* ─── Manager-only edit mode ─── */
  const isManagerOnlyEdit =
    mode === 'edit' &&
    !!initialData &&
    EDITABLE_ONLY_CAMPAIGN_MANAGER_STATUSES.has(initialData.status as never);

  /* ─── Campaign Managers dropdown ─── */
  const campaignManagerRole = allRoles.find((r) => r.name === UserRole.CAMPAIGN_MANAGER);

  const { data: campaignManagersResponse, loading: isCampaignManagersLoading } = useQuery<
    GetUsersResponse,
    GetUsersVariables
  >(GET_USERS, {
    variables: {
      page: 1,
      pageSize: 100,
      filter: {
        roleIds: campaignManagerRole ? [campaignManagerRole.id] : [],
        status: UserStatusEnum.ACTIVE,
      },
      sort: { field: UserSortField.NAME, order: SortOrder.ASC },
      scope: { brandId: selectedBrandId },
    },
    skip: !selectedBrandId || !campaignManagerRole || !!isCampaignManagerRole,
  });

  const campaignManagersData = campaignManagersResponse?.listUsers?.users ?? [];

  /* ─── Mutations ─── */
  const [createCampaign, { loading: isCreating }] = useMutation<
    CreateCampaignResponse,
    CreateCampaignVariables
  >(CREATE_CAMPAIGN, {
    refetchQueries: [{ query: LIST_CAMPAIGNS, variables: { brandId: selectedBrandId ?? '' } }],
  });

  const [updateCampaign, { loading: isUpdating }] = useMutation<
    UpdateCampaignResponse,
    UpdateCampaignVariables
  >(UPDATE_CAMPAIGN, {
    refetchQueries: [
      {
        query: GET_CAMPAIGN,
        variables: { campaignId: initialData?.id },
      },
    ],
  });

  const isMutating = isCreating || isUpdating;

  /* ─── Dialog config ─── */
  const dialogConfig = {
    create: {
      title: t('create.title'),
      description: t('create.description'),
      submitButtonText: t('create.submitButton'),
      submitButtonWidth: 'min-w-[144px]',
    },
    edit: {
      title: t('edit.title'),
      description: t('edit.description'),
      submitButtonText: t('edit.submitButton'),
      submitButtonWidth: 'min-w-[144px]',
    },
  };

  const config = dialogConfig[mode];

  /* ─── Form ─── */
  const defaultValues: CampaignFormData = initialData
    ? {
        campaignName: initialData.name,
        campaignObjective: initialData.objective,
        description: initialData.description ?? '',
        isPermanent: initialData.isPermanent,
        startDate: initialData.startDate,
        endDate: initialData.endDate ?? '',
        shipByDate: initialData.shipByDate,
        campaignManagerId: isCampaignManagerRole
          ? (currentUserData?.me?.id ?? undefined)
          : initialData.campaignManagerId || undefined,
      }
    : INITIAL_FORM_DATA;

  const campaignFormSchema = createCampaignFormSchema(
    tValidation,
    isManagerOnlyEdit,
    initialData?.startDate,
    initialData?.shipByDate,
  );

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
  } = useForm<CampaignFormData>({
    defaultValues,
    resolver: zodResolver(campaignFormSchema),
  });

  const handleOpenChange = () => {
    onClose();
  };

  const onFormSubmit = handleSubmit(async (data) => {
    if (mode === 'create') {
      await createCampaign({
        variables: {
          input: {
            brandId: selectedBrandId ?? '',
            name: data.campaignName,
            objective: data.campaignObjective,
            description: data.description ?? '',
            startDate: data.startDate,
            endDate: data.endDate ?? '',
            shipByDate: data.shipByDate,
            isPermanent: data.isPermanent,
            campaignManagerId: isCampaignManagerRole
              ? (currentUserData?.me?.id ?? undefined)
              : data.campaignManagerId || undefined,
          },
        },
        onCompleted: () => {
          onSubmit?.();
          onClose();
          toast.success(tMessages('success.created'));
        },
      });
    } else {
      await updateCampaign({
        variables: {
          input: {
            id: initialData!.id,
            name: data.campaignName,
            objective: data.campaignObjective,
            description: data.description ?? '',
            startDate: data.startDate,
            endDate: data.endDate ?? '',
            shipByDate: data.shipByDate,
            isPermanent: data.isPermanent,
            campaignManagerId: isCampaignManagerRole
              ? (currentUserData?.me?.id ?? undefined)
              : data.campaignManagerId || undefined,
          },
        },
        onCompleted: () => {
          onSubmit?.();
          onClose();
          toast.success(tMessages('success.updated'));
        },
      });
    }
  });

  return {
    config,
    isManagerOnlyEdit,

    // form handling
    errors,
    isSubmitting: isSubmitting || isMutating,
    register,
    control,
    handleOpenChange,
    onFormSubmit,

    // dropdown data
    campaignManagersData,
    isCampaignManagersLoading,
  };
}
