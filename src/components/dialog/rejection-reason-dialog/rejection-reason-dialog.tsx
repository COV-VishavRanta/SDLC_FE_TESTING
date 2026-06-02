'use client';

import {
  Button,
  CloseIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components';

interface RejectionReasonDialogProps {
  open: boolean;
  onClose: () => void;
  /** Pre-translated dialog title (typically the promotion name) */
  title: string;
  /** The rejection reason text */
  reason: string;
  /** Pre-translated label for the reason field (e.g. "Reason") */
  reasonLabel: string;
  /** Pre-translated label for the close button (e.g. "Close") */
  closeLabel: string;
}

export default function RejectionReasonDialog({
  open,
  onClose,
  title,
  reason,
  reasonLabel,
  closeLabel,
}: RejectionReasonDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-xl'
        aria-labelledby='rejection-reason-title'
        aria-describedby='rejection-reason-description'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex flex-row items-center justify-between gap-4 border-b border-[var(--neutral-300)] px-5 py-4 sm:px-8 sm:py-5'>
          <DialogTitle
            id='rejection-reason-title'
            className='text-base font-semibold text-[var(--neutral-900)] sm:text-[18px]'
          >
            {title}
          </DialogTitle>
          <DialogDescription id='rejection-reason-description' className='sr-only'>
            {title}
          </DialogDescription>
          <DialogClose
            render={
              <button
                type='button'
                className='flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--neutral-900)] transition-colors hover:opacity-70'
                aria-label='Close dialog'
              >
                <CloseIcon className='size-5' aria-hidden='true' />
                <span className='sr-only'>Close</span>
              </button>
            }
          />
        </DialogHeader>

        {/* ── Body ── */}
        <div className='px-5 py-5 sm:px-8 sm:py-6'>
          <div className='flex items-start gap-2 rounded-lg border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 py-3'>
            <span className='shrink-0 text-sm font-medium text-muted-foreground'>
              {reasonLabel}:
            </span>
            <span className='text-sm font-semibold'>{reason}</span>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className='px-5 py-4 sm:px-8 sm:py-5'>
          <DialogClose
            render={
              <Button type='button' className='w-full sm:w-full sm:text-[16px]' onClick={onClose}>
                {closeLabel}
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
