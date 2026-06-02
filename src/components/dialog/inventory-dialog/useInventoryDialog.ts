'use client';

import { BrandSortField, SortOrder } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  CREATE_INVENTORY,
  CreateInventoryResponse,
  CreateInventoryVariables,
  GET_BRANDS,
  GetBrandsResponse,
  GetBrandsVariables,
  UPDATE_INVENTORY,
  UpdateInventoryResponse,
  UpdateInventoryVariables,
} from '@/graphql';
import { useInventoryUpload } from '@/hooks';
import { InventoryImageType, InventoryType } from '@/types';
import { useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { InventoryDialogProps } from './inventory-dialog';
import { InventoryFormData, createInventoryFormSchema } from './inventory-dialog.schema';

/* ─── Constants ─── */
const INITIAL_FORM_DATA: InventoryFormData = {
  name: '',
  width: '' as unknown as number,
  height: '' as unknown as number,
  material: '',
  specifications: '',
  description: '',
  brandId: '',
  availableQuantity: undefined,
};

export default function useInventoryDialog({
  mode,
  initialData,
  onSubmit,
  onClose,
  quantityOnly = false,
}: InventoryDialogProps) {
  const t = useTranslations('inventoryManagement.inventoryDialog');
  const tValidation = useTranslations('inventoryManagement.inventoryDialog.validation');

  /* ─── Global Context ─── */
  const { selectedPspId } = useGlobalProtected();

  /* ─── Brands ─── */
  const { data: brandsData, loading: brandsLoading } = useQuery<
    GetBrandsResponse,
    GetBrandsVariables
  >(GET_BRANDS, {
    variables: {
      pspId: selectedPspId ?? '',
      pageSize: -1,
      filter: {
        isActive: true,
      },
      sort: { field: BrandSortField.NAME, order: SortOrder.ASC },
    },
    skip: !selectedPspId,
  });

  const brands = brandsData?.listBrands?.brands ?? [];

  /* ─── S3 Upload ─── */
  const { uploadInventoryImage, isUploading } = useInventoryUpload();

  /* ─── Mutations ─── */
  const [createInventory, { loading: isCreating }] = useMutation<
    CreateInventoryResponse,
    CreateInventoryVariables
  >(CREATE_INVENTORY, {
    refetchQueries: ['ListInventory'],
  });

  const [updateInventory, { loading: isUpdating }] = useMutation<
    UpdateInventoryResponse,
    UpdateInventoryVariables
  >(UPDATE_INVENTORY, {
    refetchQueries: ['ListInventory'],
  });

  const isMutating = isCreating || isUpdating;

  /* ─── Form ─── */
  const inventoryFormSchema = createInventoryFormSchema(tValidation);

  const defaultValues: InventoryFormData = initialData
    ? {
        name: initialData.name ?? '',
        width: initialData.width ?? ('' as unknown as number),
        height: initialData.height ?? ('' as unknown as number),
        material: initialData.material ?? '',
        specifications: initialData.specifications ?? '',
        description: initialData.description ?? '',
        brandId: initialData.brandId ?? '',
        availableQuantity: initialData.quantity ?? undefined,
        existingImageName: initialData.images?.length
          ? (
              initialData.images.find((img: InventoryImageType) => img.isPrimary) ??
              initialData.images[0]
            )?.name
          : undefined,
      }
    : { ...INITIAL_FORM_DATA };

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
    watch,
    setValue,
  } = useForm<InventoryFormData>({
    defaultValues,
    resolver: zodResolver(inventoryFormSchema),
  });

  /* ─── Dialog Config ─── */
  const dialogConfig = {
    create: {
      title: t('create.title'),
      description: t('create.description'),
      submitButtonText: t('create.submitButton'),
      submitButtonWidth: 'min-w-[160px]',
    },
    edit: {
      title: t('edit.title'),
      description: t('edit.description'),
      submitButtonText: t('edit.submitButton'),
      submitButtonWidth: 'min-w-[170px]',
    },
  };

  const config = dialogConfig[mode as 'create' | 'edit'] as (typeof dialogConfig)['create'];

  const handleOpenChange = () => {
    onClose();
  };

  /* ─── Form Submit ─── */
  const onFormSubmit = handleSubmit(async (data) => {
    type ImageInput = [{ name: string; type: string; key: string; isPrimary: boolean }];

    // Resolve brand name for upload path
    const selectedBrand = brands.find((b) => b.id === data.brandId);
    const brandName = selectedBrand?.name ?? 'unknown-brand';

    if (mode === 'create') {
      // Upload image
      let images: ImageInput | undefined;

      if (data.image) {
        try {
          const { fileKey } = await uploadInventoryImage(data.image, brandName, data.name);
          images = [
            { name: data.image.name, type: data.image.type, key: fileKey, isPrimary: true },
          ];
        } catch {
          toast.error(tValidation('imageUploadFailed'));
          return;
        }
      }

      await createInventory({
        variables: {
          input: {
            pspId: selectedPspId ?? '',
            brandId: data.brandId,
            name: data.name,
            width: data.width,
            height: data.height,
            material: data.material ?? undefined,
            specifications: data.specifications ?? undefined,
            description: data.description ?? undefined,
            quantity: (data.availableQuantity as number) ?? 0,
            images: images ?? [],
          },
        },
        onCompleted: () => {
          onSubmit?.();
          onClose();
          toast.success(t('messages.created'));
        },
      });
    } else {
      // ── EDIT ──
      const existingInventory = initialData as InventoryType;
      const existingImageId = existingInventory.images?.find(
        (img: InventoryImageType) => img.isPrimary,
      )?.id;

      let imagesToAdd: ImageInput | undefined;
      let imagesToRemove: string[] | undefined;

      if (data.image) {
        // User picked a new file → upload it, replace the old one.
        try {
          const { fileKey } = await uploadInventoryImage(data.image, brandName, data.name);
          imagesToAdd = [
            { name: data.image.name, type: data.image.type, key: fileKey, isPrimary: true },
          ];
        } catch {
          toast.error(tValidation('imageUploadFailed'));
          return;
        }
        if (existingImageId) imagesToRemove = [existingImageId];
      }
      // else: existingImageName still set → user didn't touch the image → send nothing.

      await updateInventory({
        variables: {
          input: {
            id: existingInventory.id,
            quantity: (data.availableQuantity as number) ?? 0,

            ...(quantityOnly
              ? {}
              : {
                  brandId: data.brandId,
                  name: data.name,
                  width: data.width,
                  height: data.height,
                  material: data.material ?? undefined,
                  specifications: data.specifications ?? undefined,
                  description: data.description ?? undefined,
                  imagesToAdd,
                  imagesToRemove,
                }),
          },
        },
        onCompleted: () => {
          onSubmit?.();
          onClose();
          toast.success(t('messages.updated'));
        },
      });
    }
  });

  return {
    config,
    brands,

    // form handling
    errors,
    isSubmitting: isSubmitting || isMutating || isUploading,
    register,
    control,
    setValue,
    watch,
    handleOpenChange,
    onFormSubmit,

    // loading states
    brandsLoading,
  } as const;
}
