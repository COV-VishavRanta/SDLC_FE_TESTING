import { useExceptionReorderUpload, useShipmentReorderUpload } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ExceptionDialogMode, ExceptionRequestDialogProps } from './exception-request-dialog';
import {
  ExceptionRequestFormData,
  createExceptionRequestSchema,
} from './exception-request-dialog.schema';

export default function useExceptionRequestDialog({
  shipmentId,
  onSubmit,
  onClose,
  type,
}: Omit<ExceptionRequestDialogProps, 'isOpen'>) {
  const t = useTranslations('shipmentDetails.exceptionDialog');
  const tValidation = useTranslations('shipmentDetails.exceptionDialog.validation');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadReorderImages: uploadByShipment, isUploading: uploadingByShipment } =
    useShipmentReorderUpload();
  const { uploadReorderImages: uploadByReorder, isUploading: uploadingByReorder } =
    useExceptionReorderUpload();

  const isUploading =
    type === ExceptionDialogMode.EXCEPTION_REQUEST ? uploadingByReorder : uploadingByShipment;

  const exceptionRequestSchema = createExceptionRequestSchema(tValidation);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
  } = useForm<ExceptionRequestFormData>({
    defaultValues: {
      reason: '',
      images: [],
    },
    resolver: zodResolver(exceptionRequestSchema),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/incompatible-library
  const selectedFiles = watch('images') ?? [];

  const handleAddFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const incoming = Array.from(files);
      const merged = [...selectedFiles, ...incoming];
      setValue('images', merged, { shouldValidate: true });
      // reset the native input so the same file can be re-selected after removal
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [selectedFiles, setValue],
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updated = selectedFiles.filter((_, i) => i !== index);
      setValue('images', updated, { shouldValidate: selectedFiles.length > 1 });
    },
    [selectedFiles, setValue],
  );

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      reset();
      onClose();
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      const images =
        type === ExceptionDialogMode.EXCEPTION_REQUEST
          ? await uploadByReorder({ files: data.images, shipmentId: shipmentId ?? '' })
          : await uploadByShipment(data.images, shipmentId ?? '');
      await onSubmit(data.reason, images);
      reset();
      onClose();
    } catch {
      toast.error(tValidation('uploadFailed'));
    }
  });

  const isWorking = isSubmitting || isUploading;

  return {
    t,
    fileInputRef,
    errors,
    isWorking,
    register,
    selectedFiles,
    handleAddFiles,
    handleRemoveFile,
    handleOpenChange,
    onFormSubmit,
  } as const;
}
