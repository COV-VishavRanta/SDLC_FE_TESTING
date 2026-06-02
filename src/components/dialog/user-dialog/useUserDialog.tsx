import { PSPSortField, SortOrder, StoreSortField, UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  CREATE_USER,
  CreateNewUserArguments,
  CreateNewUserResponse,
  GET_BRANDS,
  GET_PSPS,
  GET_STORES,
  GetBrandsResponse,
  GetBrandsVariables,
  GetPSPsResponse,
  GetPSPsVariables,
  GetStoresResponse,
  GetStoresVariables,
  UPDATE_USER,
  UpdateUserArguments,
  UpdateUserResponse,
} from '@/graphql';
import { useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useRef, useState } from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { UserDialogProps } from './user-dialog';
import {
  UserFormData,
  UserFormSchemaRequirements,
  UserValidationMessages,
  createUserDialogSchema,
} from './user-dialog.schema';
import { getUserFormPermissions } from './useUserFormPermissions';

/* ────── Constants ────── */
const INITIAL_FORM_DATA: UserFormData = {
  fullName: '',
  email: '',
  role: '',
  pspId: '',
  brandId: '',
  storeIds: [],
};

const PSP_QUERY_VARIABLES: GetPSPsVariables = {
  filter: { isActive: true, search: '' },
  pageSize: -1,
  page: 1,
  sort: { field: PSPSortField.NAME, order: SortOrder.ASC },
};

const STORE_QUERY_BASE: Pick<GetStoresVariables, 'pageSize' | 'page'> = {
  pageSize: -1,
  page: 1,
};

export default function useUserDialog({
  mode,
  initialData,
  onSubmit,
  onClose,
  selfEdit,
}: Omit<UserDialogProps, 'trigger'>) {
  console.log('🚀 ~ useUserDialog ~ selfEdit:', selfEdit);
  const t = useTranslations('userManagement');

  const { allRoles, currentUserData, selectedPspId, selectedBrandId, selectedStoreId } =
    useGlobalProtected();
  const currentUserRole = currentUserData?.me?.roles?.[0]?.name;

  const validationMessages: UserValidationMessages = {
    fullNameRequired: t('validation.fullNameRequired'),
    fullNameMinLength: t('validation.fullNameMinLength'),
    fullNameMaxLength: t('validation.fullNameMaxLength'),
    fullNameInvalid: t('validation.fullNameInvalid'),
    emailRequired: t('validation.emailRequired'),
    emailInvalid: t('validation.emailInvalid'),
    emailMaxLength: t('validation.emailMaxLength'),
    roleRequired: t('validation.roleRequired'),
    pspRequired: t('validation.pspRequired'),
    brandRequired: t('validation.brandRequired'),
    storeRequired: t('validation.storeRequired'),
  };

  // These refs are updated on every render so the resolver always validates
  // against the current requirements without remounting the form.
  const requirementsRef = useRef<UserFormSchemaRequirements>({
    isPspRequired: false,
    isBrandRequired: false,
    isStoreRequired: false,
  });
  const messagesRef = useRef(validationMessages);
  messagesRef.current = validationMessages;

  const stableResolver = useCallback<Resolver<UserFormData>>(
    (values, context, options) =>
      zodResolver(createUserDialogSchema(requirementsRef.current, messagesRef.current))(
        values,
        context,
        options,
      ),
    [],
  );

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<UserFormData>({
    defaultValues: initialData ?? INITIAL_FORM_DATA,
    resolver: stableResolver,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRoleId = watch('role');
  const selectedRoleName = allRoles.find((r) => r.id === selectedRoleId)?.name;

  const resetEntityFields = useCallback(() => {
    setValue('pspId', '');
    setValue('brandId', '');
    setValue('storeIds', []);
  }, [setValue]);

  const {
    allowedRoles,
    showPspDropdown,
    showBrandDropdown,
    showStoreDropdown,
    isStoreMultiSelect,
  } = getUserFormPermissions(currentUserRole, selectedRoleName, allRoles);

  // Keep requirements ref in sync for the resolver
  requirementsRef.current = {
    isPspRequired: showPspDropdown,
    isBrandRequired: showBrandDropdown,
    isStoreRequired: showStoreDropdown,
  };

  const { data: pspsData, loading: pspsLoading } = useQuery<GetPSPsResponse, GetPSPsVariables>(
    GET_PSPS,
    {
      variables: PSP_QUERY_VARIABLES,
      skip: !showPspDropdown,
    },
  );

  const brandQueryVariables: GetBrandsVariables = useMemo(
    () => ({ pspId: selectedPspId ?? '', pageSize: -1, page: 1 }),
    [selectedPspId],
  );

  const { data: brandsData, loading: brandsLoading } = useQuery<
    GetBrandsResponse,
    GetBrandsVariables
  >(GET_BRANDS, {
    variables: brandQueryVariables,
    skip: !showBrandDropdown || !selectedPspId,
  });

  const storeQueryVariables: GetStoresVariables = useMemo(
    () => ({
      ...STORE_QUERY_BASE,
      brandId: selectedBrandId ?? '',
      sort: { field: StoreSortField.NAME, order: SortOrder.ASC },
    }),
    [selectedBrandId],
  );

  const { data: storesData, loading: storesLoading } = useQuery<
    GetStoresResponse,
    GetStoresVariables
  >(GET_STORES, {
    variables: storeQueryVariables,
    skip: !showStoreDropdown || !selectedBrandId,
  });

  const [createUser, { loading: createLoading }] = useMutation<
    CreateNewUserResponse,
    CreateNewUserArguments
  >(CREATE_USER);

  const [updateCampaignNames, setUpdateCampaignNames] = useState<string[] | null>(null);

  const [updateUser, { loading: updateLoading }] = useMutation<
    UpdateUserResponse,
    UpdateUserArguments
  >(UPDATE_USER);

  const handleOpenChange = () => {
    onClose?.();
  };

  const onFormSubmit = handleSubmit(async (formData) => {
    // clear any previous campaign names error when resubmitting
    setUpdateCampaignNames(null);

    // Resolve which entity IDs to send based on the creator's role and the
    // role being assigned to the new user.
    //
    //  Platform Admin → Platform Admin  : no entity IDs
    //  Platform Admin → PSP Admin       : pspId from form
    //  PSP Admin → PSP Admin            : selectedPspId (context)
    //  PSP Admin → Production Operator  : selectedPspId (context)
    //  PSP Admin → Brand Admin          : brandId from form only (no pspId)
    //  Brand Admin → Brand Admin        : selectedBrandId (context)
    //  Brand Admin → Campaign Manager   : selectedBrandId (context)
    //  Brand Admin → Regional Manager   : storeIds from form (no brandId)
    //  Brand Admin → Store Admin        : storeIds from form (no brandId)
    //  Store Admin → Store Admin        : selectedStoreId (context)
    //  Store Admin → Store Operator     : selectedStoreId (context)
    let entityPspIds: string[] | undefined;
    let entityBrandIds: string[] | undefined;
    let entityStoreIds: string[] | undefined;

    if (currentUserRole === UserRole.PLATFORM_ADMIN) {
      if (selectedRoleName === UserRole.PSP_ADMIN && formData.pspId) {
        entityPspIds = [formData.pspId];
      }
    } else if (currentUserRole === UserRole.PSP_ADMIN) {
      if (selectedRoleName === UserRole.BRAND_ADMIN) {
        if (formData.brandId) entityBrandIds = [formData.brandId];
      } else if (selectedPspId) {
        entityPspIds = [selectedPspId];
      }
    } else if (currentUserRole === UserRole.BRAND_ADMIN) {
      if (
        selectedRoleName === UserRole.REGIONAL_MANAGER ||
        selectedRoleName === UserRole.STORE_ADMIN
      ) {
        const storeIds = formData.storeIds ?? [];
        if (storeIds.length) entityStoreIds = storeIds;
      } else if (selectedBrandId) {
        entityBrandIds = [selectedBrandId];
      }
    } else if (currentUserRole === UserRole.STORE_ADMIN && selectedStoreId) {
      entityStoreIds = [selectedStoreId];
    }

    const baseInput = {
      email: formData.email,
      fullName: formData.fullName,
      roleIds: [formData.role],
      ...(entityPspIds && { pspIds: entityPspIds }),
      ...(entityBrandIds && { brandIds: entityBrandIds }),
      ...(entityStoreIds && { storeIds: entityStoreIds }),
    };

    if (mode === 'create') {
      await createUser({
        variables: { input: baseInput },
        onCompleted(data) {
          toast.success(t('messages.success.userCreated'), {
            description: t('messages.success.invitationSent', { email: formData.email }),
          });

          if (data?.createUser?.user) {
            onSubmit?.(data?.createUser?.user);
          }
          onClose?.();
        },
      });
    } else {
      if (!formData.userId) {
        toast.error('User ID is required for update');
        return;
      }

      const updateInput = selfEdit
        ? { userId: formData.userId, fullName: formData.fullName }
        : { userId: formData.userId, ...baseInput };

      await updateUser({
        variables: { input: updateInput },
        onCompleted(data) {
          if (!data?.updateUser?.success && data?.updateUser?.campaignNames?.length) {
            setUpdateCampaignNames(data.updateUser.campaignNames);
            return;
          }
          toast.success(t('messages.success.userUpdated'), {
            description: t('messages.success.changesSaved', { email: formData.email }),
          });
          onSubmit?.(data?.updateUser?.user);
          onClose?.();
        },
      });
    }
  });

  const dialogConfig = {
    create: {
      title: t('userDialog.create.title'),
      description: t('userDialog.create.description'),
      submitButtonText: t('userDialog.create.submitButton'),
      submitButtonWidth: 'min-w-[244px]',
    },
    edit: {
      title: selfEdit ? t('userDialog.edit.selfEditTitle') : t('userDialog.edit.title'),
      description: selfEdit
        ? t('userDialog.edit.selfEditDescription')
        : t('userDialog.edit.description'),
      submitButtonText: t('userDialog.edit.submitButton'),
      submitButtonWidth: 'min-w-[144px]',
    },
  };

  const config = dialogConfig[mode as 'create' | 'edit'];

  return {
    config,

    // form
    control,
    errors,
    isSubmitting: isSubmitting || createLoading || updateLoading,
    register,
    handleOpenChange,
    onFormSubmit,

    // permission-driven role list
    allowedRoles,
    resetEntityFields,

    // conditional field visibility
    showPspDropdown,
    showBrandDropdown,
    showStoreDropdown,
    isStoreMultiSelect,

    // PSP dropdown data (only fetched when showPspDropdown)
    psps: pspsData?.psps?.psps ?? [],
    pspsLoading,

    // Brand dropdown data (only fetched when showBrandDropdown)
    brands: brandsData?.listBrands?.brands ?? [],
    brandsLoading,

    // Store dropdown data (only fetched when showStoreDropdown)
    stores: storesData?.stores?.stores ?? [],
    storesLoading,

    // Campaign names returned when update fails due to active campaigns
    updateCampaignNames,
  } as const;
}
