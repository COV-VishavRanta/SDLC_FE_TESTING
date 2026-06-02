import { useGlobalProtected } from '@/contexts';
import {
  CREATE_BRAND,
  CreateBrandResponse,
  CreateBrandVariables,
  GET_COUNTRIES,
  GET_STATES,
  GetCountriesResponse,
  GetStatesResponse,
  GetStatesVariables,
  UPDATE_BRAND,
  UpdateBrandResponse,
  UpdateBrandVariables,
} from '@/graphql';
import { BrandType } from '@/types';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { BrandDialogProps } from './brand-dialog';
import { BrandFormData, createBrandFormSchema } from './brand-dialog.schema';

/* ─── Constants ─── */
const INITIAL_FORM_DATA: BrandFormData = {
  name: '',
  country: '',
  state: '',
  city: '',
  streetAddress: '',
  zipCode: '',
  website: '',
};

export default function useBrandDialog({
  mode,
  initialData,
  onSubmit,
  onClose,
}: Omit<BrandDialogProps, 'trigger'>) {
  const t = useTranslations('brandManagement.dialog');
  const tMessages = useTranslations('brandManagement.messages');
  const tValidation = useTranslations('brandManagement.dialog.validation');
  const { selectedPspId, allRoles } = useGlobalProtected();
  const brandAdminRole = allRoles.find((r) => r.name === 'Brand Admin');

  /* ─── State ─── */
  const [createdBrand, setCreatedBrand] = useState<BrandType | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  /* ─── Location Queries ─── */
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
  const [createBrand, { loading: isCreating }] = useMutation<
    CreateBrandResponse,
    CreateBrandVariables
  >(CREATE_BRAND);

  const [updateBrand, { loading: isUpdating }] = useMutation<
    UpdateBrandResponse,
    UpdateBrandVariables
  >(UPDATE_BRAND);

  const isMutating = isCreating || isUpdating;

  /* ─── Form ─── */
  const brandFormSchema = createBrandFormSchema(tValidation);

  const defaultValues: BrandFormData = initialData
    ? {
        name: initialData.name ?? '',
        country: initialData.countryId ?? '',
        state: initialData.stateId ?? '',
        city: initialData.cityName ?? '',
        streetAddress: initialData.streetAddress ?? '',
        zipCode: String(initialData.zipCode ?? ''),
        website: initialData.website ?? '',
      }
    : INITIAL_FORM_DATA;

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
    setValue,
    watch,
  } = useForm<BrandFormData>({
    defaultValues,
    resolver: zodResolver(brandFormSchema),
  });

  /* ─── Dialog Config ─── */
  const dialogConfig = {
    create: {
      title: t('create.title'),
      description: t('create.description'),
      submitButtonText: t('create.submitButton'),
      submitButtonWidth: 'min-w-[134px]',
    },
    edit: {
      title: t('edit.title'),
      description: t('edit.description'),
      submitButtonText: t('edit.submitButton'),
      submitButtonWidth: 'min-w-[144px]',
    },
  };

  const config = dialogConfig[mode];

  const handleOpenChange = () => {
    onClose();
  };

  /* ─── Form Submit ─── */
  const onFormSubmit = handleSubmit(async (data) => {
    if (mode === 'create') {
      await createBrand({
        variables: {
          input: {
            pspId: selectedPspId ?? '',
            name: data.name,
            address: data.streetAddress,
            countryId: data.country,
            stateId: data.state,
            cityName: data.city,
            zipCode: Number(data.zipCode.replace(/\D/g, '')),
            website: data.website ?? undefined,
          },
        },
        onCompleted: (mutationData) => {
          onSubmit?.(data);
          if (mutationData.createBrand.brand) {
            setCreatedBrand(mutationData.createBrand.brand);
          }
        },
      });
    } else {
      await updateBrand({
        variables: {
          input: {
            id: initialData?.id ?? '',
            name: data.name,
            address: data.streetAddress,
            countryId: data.country,
            stateId: data.state,
            cityName: data.city,
            zipCode: Number(data.zipCode.replace(/\D/g, '')),
            website: data.website ?? undefined,
          },
        },
        onCompleted: () => {
          onSubmit?.(data);
          onClose();
          toast.success(tMessages('success.updated'));
        },
      });
    }
  });

  /* ─── Pre-load states/cities when editing ─── */
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      if (initialData.countryId) {
        getStates({ variables: { countryId: initialData.countryId } });
      }
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
    watch,

    // dropdown data
    countriesData,
    statesData,
    getStates,
    isDropdownLoading,

    // success state
    createdBrand,

    // user dialog state
    showUserDialog,
    setShowUserDialog,
    brandAdminRole,
  } as const;
}
