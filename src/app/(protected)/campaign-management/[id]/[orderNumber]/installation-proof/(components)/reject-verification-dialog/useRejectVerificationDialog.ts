'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import {
  createRejectVerificationSchema,
  RejectVerificationFormData,
} from './reject-verification-dialog.schema';

interface UseRejectVerificationDialogProps {
  onSubmit: (notes: string) => void;
  onClose: () => void;
}

export default function useRejectVerificationDialog({
  onSubmit,
  onClose,
}: UseRejectVerificationDialogProps) {
  const t = useTranslations('campaignManagement.details.verifyInstallationProof.rejectDialog');
  const tValidation = useTranslations(
    'campaignManagement.details.verifyInstallationProof.rejectDialog.validation',
  );

  const schema = createRejectVerificationSchema(tValidation);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<RejectVerificationFormData>({
    defaultValues: { notes: '' },
    resolver: zodResolver(schema),
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      reset({ notes: '' });
      onClose();
    }
  };

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data.notes);
    reset({ notes: '' });
  });

  return {
    t,
    register,
    errors,
    isSubmitting,
    onFormSubmit,
    handleOpenChange,
  };
}
