/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useGlobalProtected } from '@/contexts';
import {
  CREATE_STORE,
  CreateStoreResponse,
  CreateStoreVariables,
  GET_COUNTRIES,
  GET_STATES,
  GetCountriesResponse,
  GetStatesResponse,
  GetStatesVariables,
  UPDATE_STORE,
  UpdateStoreResponse,
  UpdateStoreVariables,
} from '@/graphql';
import { StoreType } from '@/types';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { StoreDialogProps } from './store-dialog';
import { createStoreFormSchema, StoreFormData } from './store-dialog.schema';

/* ─── Constants ─── */
const INITIAL_FORM_DATA: StoreFormData = {
  storeName: '',
  storeNumber: '',
  phoneNumber: '',
  country: '',
  state: '',
  city: '',
  streetAddress: '',
  zipCode: '',
};

export default function useStoreDialog({
  mode,
  initialData,
  onSubmit,
  onClose,
}: Omit<StoreDialogProps, 'trigger'>) {
  const t = useTranslations('storeManagement.dialog');
  const tMessages = useTranslations('storeManagement.messages');
  const tValidation = useTranslations('storeManagement.dialog.validation');
  const { allRoles, selectedBrandId } = useGlobalProtected();
  const storeAdminRole = allRoles.find((r) => r.name === 'Store Admin');

  /* ─── Success state ─── */
  const [createdStore, setCreatedStore] = useState<StoreType | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  /* ─── Country / State dropdowns ─── */
  const { data: countriesResponse, loading: countriesLoading } =
    useQuery<GetCountriesResponse>(GET_COUNTRIES);
  const [getStates, { data: stateResponse, loading: statesLoading }] = useLazyQuery<
    GetStatesResponse,
    GetStatesVariables
  >(GET_STATES);

  const countriesData = countriesResponse?.countries ?? [];
  const statesData = stateResponse?.states ?? [];
  const isDropdownLoading = countriesLoading || statesLoading;

  /* ─── Mutations ─── */
  const [createStore, { loading: isCreating }] = useMutation<
    CreateStoreResponse,
    CreateStoreVariables
  >(CREATE_STORE);

  const [updateStore, { loading: isUpdating }] = useMutation<
    UpdateStoreResponse,
    UpdateStoreVariables
  >(UPDATE_STORE);

  const isMutating = isCreating || isUpdating;

  /* ─── Dialog config ─── */
  const dialogConfig = {
    create: {
      title: t('create.title'),
      description: t('create.description'),
      submitButtonText: t('create.submitButton'),
      submitButtonWidth: 'min-w-[124px]',
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
  const defaultValues: StoreFormData = initialData
    ? {
        storeName: initialData.name,
        storeNumber: initialData.storeNumber ?? '',
        phoneNumber: initialData.phoneNumber ?? '',
        country: initialData.countryId ?? '',
        state: initialData.stateId ?? '',
        city: initialData.cityName ?? '',
        streetAddress: initialData.address ?? '',
        zipCode: String(initialData.zipCode ?? ''),
      }
    : INITIAL_FORM_DATA;

  const storeFormSchema = createStoreFormSchema(tValidation);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
    setValue,
  } = useForm<StoreFormData>({
    defaultValues,
    resolver: zodResolver(storeFormSchema),
  });

  const handleOpenChange = () => {
    onClose();
  };

  const onFormSubmit = handleSubmit(async (data) => {
    if (mode === 'create') {
      await createStore({
        variables: {
          input: {
            brandId: selectedBrandId ?? '',
            name: data.storeName,
            storeNumber: data.storeNumber ?? '',
            address: data.streetAddress,
            countryId: data.country,
            stateId: data.state,
            cityName: data.city,
            zipCode: Number(data.zipCode.replace(/\D/g, '')),
            phoneNumber: data.phoneNumber || '',
          },
        },
        onCompleted: (mutationData) => {
          onSubmit?.();
          if (mutationData.createStore.store) {
            setCreatedStore(mutationData.createStore.store);
          }
        },
      });
    } else {
      await updateStore({
        variables: {
          input: {
            id: initialData!.id,
            name: data.storeName,
            storeNumber: data.storeNumber ?? '',
            address: data.streetAddress,
            countryId: data.country,
            stateId: data.state,
            cityName: data.city,
            zipCode: Number(data.zipCode.replace(/\D/g, '')),
            phoneNumber: data.phoneNumber || undefined,
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

  /* ─── Load states when editing ─── */
  useEffect(() => {
    if (mode === 'edit' && initialData?.countryId) {
      getStates({ variables: { countryId: initialData.countryId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return {
    config,

    // form handling
    errors,
    isSubmitting: isSubmitting || isMutating,
    register,
    control,
    handleOpenChange,
    onFormSubmit,
    setValue,

    // dropdown data
    countriesData,
    statesData,
    getStates,
    isDropdownLoading,

    // success state
    createdStore,

    // user dialog state
    showUserDialog,
    setShowUserDialog,
    storeAdminRole,
  } as const;
}
