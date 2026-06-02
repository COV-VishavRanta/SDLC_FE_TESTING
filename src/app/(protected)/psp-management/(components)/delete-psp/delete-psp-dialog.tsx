'use client';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  InfoCircleIcon,
} from '@/components';
import { PSPType } from '@/types';
import { useContext } from 'react';
import { PspManagementContext } from '../../context/PspManagementContext';

interface DeletePspDialogProps {
  psp: PSPType;
  onClose: () => void;
}

export function DeletePspDialog({ psp, onClose }: DeletePspDialogProps) {
  const { handleDeactivatePsp } = useContext(PspManagementContext);

  const handleDeactivate = async () => {
    await handleDeactivatePsp(psp.id);
    onClose();
  };

  const handleDelete = () => {
    // await handleDeletePsp(psp.id);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className='flex flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[500px]'
      >
        {/* Header */}
        <DialogHeader className='gap-2 px-4 py-4 sm:px-8 sm:py-6'>
          <DialogTitle className='text-[20px] font-semibold leading-[30px] text-text-heading'>
            Delete PSP
          </DialogTitle>
          <DialogDescription className='text-[14px] leading-[21px] tracking-[-0.15px] text-text-secondary'>
            Deleting a PSP is permanent and cannot be undone. Consider deactivating instead.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className='flex flex-col gap-4 sm:gap-6 px-4 pt-4 pb-4 sm:px-8 sm:pt-6 sm:pb-6'>
          {/* PSP Info Card */}
          <div className='flex flex-col gap-2 rounded-lg border border-border bg-admin-tag-bg px-5 py-5'>
            <p className='text-[13px] leading-[19.5px] tracking-[-0.08px] text-dialog-warning-text'>
              Warning: This action cannot be undone
            </p>
          </div>

          {/* Recommendation Box */}
          <div className='flex gap-3 rounded-lg border border-dialog-info-border bg-dialog-info-bg px-[17px] py-[17px]'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-md bg-dialog-info-icon-bg'>
              {/* aria-hidden: decorative icon — adjacent text explains context (WCAG 1.1.1) */}
              <InfoCircleIcon className='size-4 text-primary' aria-hidden='true' />
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-[14px] font-semibold leading-[21px] text-text-heading'>
                Recommended: Deactivate Instead
              </p>
              <p className='text-[13px] leading-[19.5px] tracking-[-0.08px] text-text-secondary'>
                Deactivating preserves all data and can be reversed. The PSP will lose access but
                their information remains intact.
              </p>
            </div>
          </div>

          {/* Primary Actions: Cancel + Deactivate */}
          <DialogFooter className='flex-col-reverse gap-3 sm:flex-row border-none'>
            <DialogClose
              render={
                <Button
                  variant='outline'
                  className='h-[47px] flex-1 border border-border bg-admin-tag-bg text-[14px] font-medium text-text-heading hover:bg-muted sm:text-[16px]'
                >
                  Cancel
                </Button>
              }
            />
            <Button
              className='h-[45px] flex-1 bg-gradient-to-b from-primary to-[var(--blue-medium)] text-[14px] font-semibold text-white hover:from-[var(--blue-medium)] hover:to-[var(--blue-dark)] sm:text-[16px]'
              onClick={handleDeactivate}
            >
              Deactivate PSP
            </Button>
          </DialogFooter>

          {/* Permanent Delete Section */}
          <div className='flex flex-col gap-3 border-t border-border pt-[17px]'>
            <p className='text-center text-[12px] leading-[18px] text-text-secondary'>
              If you&apos;re absolutely certain you want to permanently delete this PSP:
            </p>
            <Button variant='destructive' className='h-[41.5px] w-full' onClick={handleDelete}>
              Permanently Delete PSP
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
