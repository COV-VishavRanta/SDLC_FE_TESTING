'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog as DialogPrimitive, DialogRootChangeEventDetails } from '@base-ui/react/dialog';
import * as React from 'react';

import { CloseIcon } from '../icons/CloseIcon';

function Dialog({ onOpenChange, ...props }: DialogPrimitive.Root.Props) {
  function handleOpenChange(open: boolean, eventDetails: DialogRootChangeEventDetails) {
    // Prevent closing if the user clicks outside
    if (eventDetails.reason === 'outside-press') {
      return;
    }

    onOpenChange?.(open, eventDetails);
  }
  return <DialogPrimitive.Root data-slot='dialog' onOpenChange={handleOpenChange} {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  if (!props.render) {
    return (
      <DialogPrimitive.Close
        data-slot='dialog-close'
        render={
          <button
            type='button'
            aria-label='Close dialog'
            className='flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--gray-500)] transition-colors hover:bg-[var(--gray-100)] hover:text-[var(--text-heading)]'
          >
            <CloseIcon className='size-5' />
            <span className='sr-only'>Close</span>
          </button>
        }
        {...props}
      />
    );
  }
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />;
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot='dialog-overlay'
      className={cn(
        'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-[1001]',
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot='dialog-content'
        className={cn(
          'bg-[var(--dialog-bg)] data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 grid max-w-[calc(100%-2rem)] gap-6 rounded-xl p-6 text-sm ring-1 duration-100 sm:max-w-md fixed top-1/2 left-1/2 z-[1001] w-full max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] -translate-x-1/2 -translate-y-1/2 outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && <DialogClose className='absolute top-4 right-4' />}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-header'
      className={cn(
        'gap-2 flex flex-col border-b border-[#e5e7eb] px-5 py-3 sm:px-8 sm:py-6',
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot='dialog-footer'
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-[#e5e7eb]',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant='outline' />}>Close</DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn(
        'leading-none font-medium h-[30px] text-[18px] sm:text-[20px] text-text-heading',
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn(
        'text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 min-h-[26px] text-[12px] sm:text-[14px] font-normal leading-[auto] tracking-[-0.1504px] ',
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
