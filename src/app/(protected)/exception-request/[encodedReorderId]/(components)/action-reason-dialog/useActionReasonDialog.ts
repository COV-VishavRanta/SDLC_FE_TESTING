'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { ActionReasonFormData, createActionReasonSchema } from './action-reason-dialog.schema';

interface UseActionReasonDialogProps {
  onSubmit: (reason: string) => Promise<void>;
  onClose: () => void;
}

export default function useActionReasonDialog({ onSubmit, onClose }: UseActionReasonDialogProps) {
  const tValidation = useTranslations('reorderDetails.actionDialog.validation');

  const schema = createActionReasonSchema(tValidation);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ActionReasonFormData>({
    defaultValues: { reason: '' },
    resolver: zodResolver(schema),
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      reset();
      onClose();
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data.reason);
    reset();
  });

  return {
    errors,
    isSubmitting,
    register,
    handleOpenChange,
    onFormSubmit,
  } as const;
}
