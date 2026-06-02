import {
  CREATE_PSP,
  CreatePSPArguments,
  CreatePSPResponse,
  GET_COUNTRIES,
  GET_STATES,
  GetCountriesResponse,
  GetStatesResponse,
  GetStatesVariables,
  UPDATE_PSP,
  UpdatePSPArguments,
  UpdatePSPResponse,
} from '@/graphql';
import { PSPType } from '@/types';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useGlobalProtected } from '@/contexts';
import { PspDialogProps } from './psp-dialog';
import { createPspFormSchema, PspFormData } from './psp-dialog.schema';

/* ─── Constants ─── */
const INITIAL_FORM_DATA: PspFormData = {
  name: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  website: '',
};

export default function usePspDialog({
  mode,
  initialData,
  onSubmit,
  onClose,
}: Omit<PspDialogProps, 'trigger'>) {
  const t = useTranslations('pspManagement.dialog');
  const tMessages = useTranslations('pspManagement.messages');
  const tValidation = useTranslations('pspManagement.dialog.validation');
  const { allRoles } = useGlobalProtected();
  const pspAdminRole = allRoles.find((r) => r.name === 'PSP Admin');

  /* ─── State ─── */
  const [createdPsp, setCreatedPsp] = useState<PSPType | null>(null);

  const [showUserDialog, setShowUserDialog] = useState(false);

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
  const [createPsp, { loading: isCreating }] = useMutation<CreatePSPResponse, CreatePSPArguments>(
    CREATE_PSP,
  );

  const [updatePsp, { loading: isUpdating }] = useMutation<UpdatePSPResponse, UpdatePSPArguments>(
    UPDATE_PSP,
  );

  const isMutating = isCreating || isUpdating;

  const defaultValues: PspFormData = initialData
    ? {
        name: initialData.name,
        streetAddress: initialData.address ?? '',
        city: initialData.cityName ?? '',
        state: initialData.stateId ?? '',
        zipCode: String(initialData?.zipCode ?? ''),
        country: initialData.countryId ?? '',
        website: initialData.website ?? '',
      }
    : INITIAL_FORM_DATA;
  // Create schema with translated validation messages
  const pspFormSchema = createPspFormSchema(tValidation);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
    setValue,
  } = useForm<PspFormData>({
    defaultValues,
    resolver: zodResolver(pspFormSchema),
  });

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

  const handleOpenChange = () => {
    onClose();
  };

  const onFormSubmit = handleSubmit(async (data) => {
    if (mode === 'create') {
      await createPsp({
        variables: {
          input: {
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
          onSubmit?.();
          setCreatedPsp(mutationData.createPsp.psp);
        },
      });
    } else {
      await updatePsp({
        variables: {
          input: {
            id: initialData!.id,
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
          onSubmit?.();
          onClose();
          toast.success(tMessages('success.updated'));
        },
      });
    }
  });

  // Load states and cities when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // Load states for the initial country
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

    // dropdown data
    countriesData,
    statesData,
    getStates,
    isDropdownLoading,

    // success state
    createdPsp,

    // user dialog state
    showUserDialog,
    setShowUserDialog,
    pspAdminRole,
  } as const;
}
