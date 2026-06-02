import {
  CREATE_PROMOTION,
  CreatePromotionResponse,
  CreatePromotionVariables,
  UPDATE_PROMOTION,
  UpdatePromotionResponse,
  UpdatePromotionVariables,
} from '@/graphql';
import { usePromotionUpload } from '@/hooks';
import { PromotionType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PromotionDialogProps } from './promotion-dialog';
import { PromotionFormData, createPromotionFormSchema } from './promotion-dialog.schema';

/* ─── Constants ─── */
const INITIAL_FORM_DATA: PromotionFormData = {
  name: '',
  width: '' as unknown as number,
  height: '' as unknown as number,
  material: '',
  specifications: '',
  description: '',
  needDesign: false,
  isReusable: false,
};

export default function usePromotionDialog({
  mode,
  campaignData,
  initialData,
  onSubmit,
  onClose,
}: PromotionDialogProps) {
  const t = useTranslations('campaignManagement.promotionDialog');
  const tValidation = useTranslations('campaignManagement.promotionDialog.validation');

  /* ─── S3 Upload ─── */
  const { uploadPromotionImage, isUploading } = usePromotionUpload();

  /* ─── Mutations ─── */
  const [createPromotion, { loading: isCreating }] = useMutation<
    CreatePromotionResponse,
    CreatePromotionVariables
  >(CREATE_PROMOTION, {
    refetchQueries: ['GetPromotionsByCampaign'],
  });

  const [updatePromotion, { loading: isUpdating }] = useMutation<
    UpdatePromotionResponse,
    UpdatePromotionVariables
  >(UPDATE_PROMOTION, {
    refetchQueries: ['GetPromotionsByCampaign'],
  });

  const isMutating = isCreating || isUpdating;

  /* ─── Form ─── */
  const promotionFormSchema = createPromotionFormSchema(tValidation);

  const defaultValues: PromotionFormData = initialData
    ? {
        name: initialData.name ?? '',
        width: initialData.width ?? '',
        height: initialData.height ?? '',
        material: initialData.material ?? '',
        specifications: initialData.specifications ?? '',
        description: initialData.description ?? '',
        needDesign: initialData.needDesign ?? false,
        isReusable: campaignData?.isPermanent ? true : (initialData.isReusable ?? false),
        existingImageName:
          !initialData.needDesign && initialData.images?.length
            ? (initialData.images.find((img) => img.isPrimary) ?? initialData.images[0])?.name
            : undefined,
      }
    : { ...INITIAL_FORM_DATA, isReusable: campaignData?.isPermanent ?? false }; // if campaign is permanent, reusable will be always true for new or old promotions and disabled

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
    watch,
    setValue,
  } = useForm<PromotionFormData>({
    defaultValues,
    resolver: zodResolver(promotionFormSchema),
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

  const config = dialogConfig[mode] as (typeof dialogConfig)['create'];

  const handleOpenChange = () => {
    onClose();
  };

  /* ─── Form Submit ─── */
  const onFormSubmit = handleSubmit(async (data) => {
    type ImageInput = [{ name: string; type: string; key: string; isPrimary: boolean }];

    if (mode === 'create') {
      // ── CREATE ──────────────────────────────────────────────────────────
      // Upload image only when needDesign is unchecked and a file was selected.
      let images: ImageInput | undefined;

      if (!data.needDesign && data.image) {
        try {
          const { fileKey } = await uploadPromotionImage(
            data.image,
            campaignData?.name ?? '',
            data.name,
          );
          images = [
            { name: data.image.name, type: data.image.type, key: fileKey, isPrimary: true },
          ];
        } catch {
          toast.error(tValidation('imageUploadFailed'));
          return;
        }
      }

      await createPromotion({
        variables: {
          input: {
            campaignId: campaignData?.id ?? '',
            name: data.name,
            width: data.width,
            height: data.height,
            material: data.material ?? undefined,
            specifications: data.specifications ?? undefined,
            description: data.description ?? undefined,
            needDesign: data.needDesign,
            isReusable: data.isReusable,
            images,
          },
        },
        onCompleted: () => {
          onSubmit?.();
          onClose();
          toast.success(t('messages.created'));
        },
      });
    } else {
      // ── EDIT ─────────────────────────────────────────────────────────────
      const existingPromotion = initialData as PromotionType;
      const existingImageId = existingPromotion.images?.[0]?.id;

      let imagesToAdd: ImageInput | undefined;
      let imagesToRemove: string[] | undefined;

      if (data.needDesign) {
        // User checked needDesign → remove any existing image, no new upload needed.
        if (existingImageId) imagesToRemove = [existingImageId];
      } else if (data.image) {
        // User picked a new file → upload it, replace the old one.
        try {
          const { fileKey } = await uploadPromotionImage(
            data.image,
            campaignData?.name ?? '',
            data.name,
          );
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

      await updatePromotion({
        variables: {
          input: {
            id: existingPromotion.id,
            name: data.name,
            width: data.width,
            height: data.height,
            material: data.material ?? undefined,
            specifications: data.specifications ?? undefined,
            description: data.description ?? undefined,
            needDesign: data.needDesign,
            isReusable: data.isReusable,
            imagesToAdd,
            imagesToRemove,
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

    // form handling
    errors,
    isSubmitting: isSubmitting || isMutating || isUploading,
    register,
    control,
    watch,
    setValue,
    handleOpenChange,
    onFormSubmit,
  } as const;
}
