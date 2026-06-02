import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';

import {
  UploadInstallationProofFormData,
  createUploadInstallationProofSchema,
} from './upload-installation-proof-dialog.schema';

interface UseUploadInstallationProofDialogProps {
  initialFiles: File[];
  initialNote: string;
  onSave: (files: File[]) => void;
  onNoteSave: (note: string) => void;
  onClose: () => void;
}

export default function useUploadInstallationProofDialog({
  initialFiles,
  initialNote,
  onSave,
  onNoteSave,
  onClose,
}: UseUploadInstallationProofDialogProps) {
  const t = useTranslations('campaignManagement.details.ordersTab.uploadProofDialog');
  const tValidation = useTranslations(
    'campaignManagement.details.ordersTab.uploadProofDialog.validation',
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const schema = createUploadInstallationProofSchema(tValidation);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch,
    register,
    reset,
  } = useForm<UploadInstallationProofFormData>({
    defaultValues: {
      images: initialFiles,
      notes: initialNote,
    },
    resolver: zodResolver(schema),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/incompatible-library
  const selectedFiles = watch('images') ?? [];

  const handleAddFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const incoming = Array.from(files);
      const merged = [...selectedFiles, ...incoming];
      setValue('images', merged, { shouldValidate: true });
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
      reset({ images: initialFiles, notes: initialNote });
      onClose();
    }
  };

  const onFormSubmit = handleSubmit((data) => {
    onNoteSave(data.notes ?? '');
    onSave(data.images);
    onClose();
  });

  return {
    t,
    fileInputRef,
    errors,
    isSubmitting,
    selectedFiles,
    register,
    handleAddFiles,
    handleRemoveFile,
    handleOpenChange,
    onFormSubmit,
  } as const;
}
