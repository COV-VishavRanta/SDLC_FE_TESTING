'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import {
  RejectInstallationProofFormData,
  createRejectInstallationProofSchema,
} from './reject-installation-proof-dialog.schema';

interface UseRejectInstallationProofDialogProps {
  onSubmit: (notes: string) => Promise<void>;
  onClose: () => void;
}

export default function useRejectInstallationProofDialog({
  onSubmit,
  onClose,
}: UseRejectInstallationProofDialogProps) {
  const t = useTranslations('campaignManagement.details.verifyInstallationProof.rejectDialog');
  const tValidation = useTranslations(
    'campaignManagement.details.verifyInstallationProof.rejectDialog.validation',
  );

  const schema = createRejectInstallationProofSchema(tValidation);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<RejectInstallationProofFormData>({
    defaultValues: { notes: '' },
    resolver: zodResolver(schema),
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      reset({ notes: '' });
      onClose();
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data.notes);
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
