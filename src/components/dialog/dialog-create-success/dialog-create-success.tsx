import {
  CheckCircleIcon,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components';

interface DialogCreateSuccessProps {
  /** The success heading shown in the dialog header and announced to screen readers. */
  title: string;
  /** Subheading shown below the title in the dialog header. */
  description: string;
  /** The name of the newly created entity displayed prominently in the body. */
  entityName: string;
  /** Instructional text shown below the entity name. */
  subtitle: string;
  /** Footer actions – typically one or more `<Button>` elements. */
  children: React.ReactNode;
}

/**
 * Reusable success view rendered inside a Dialog after a successful create mutation.
 *
 * Composition: pass footer action buttons as `children`.
 *
 * @example
 * <DialogCreateSuccess
 *   title={t('createSuccess.title')}
 *   description={t('createSuccess.description')}
 *   entityName={createdEntity.name}
 *   subtitle={t('createSuccess.subtitle')}
 * >
 *   <Button onClick={() => setShowUserDialog(true)}>
 *     {t('createSuccess.createUserButton')}
 *   </Button>
 * </DialogCreateSuccess>
 */
export function DialogCreateSuccess({
  title,
  description,
  entityName,
  subtitle,
  children,
}: DialogCreateSuccessProps) {
  return (
    <>
      {/* Screen-reader live announcement */}
      <div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
        {title} {entityName}
      </div>

      <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
        <div className='flex h-[55px] flex-col gap-1'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>
      </DialogHeader>

      <div className='flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12'>
        <div className='flex size-20 items-center justify-center rounded-full bg-[rgba(22,163,74,0.1)]'>
          <CheckCircleIcon className='size-10 text-[#16a34a]' aria-hidden='true' />
        </div>
        <div className='flex flex-col items-center gap-2 text-center'>
          <p className='text-[18px] font-semibold leading-[27px] text-text-heading'>{entityName}</p>
          <p className='max-w-[400px] text-[14px] leading-[21px] text-[var(--gray-600)]'>
            {subtitle}
          </p>
        </div>
      </div>

      <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse items-stretch gap-3 px-5 py-2 sm:h-[88px] sm:flex-row sm:items-center sm:justify-center sm:px-8 sm:py-0'>
        {children}
      </DialogFooter>
    </>
  );
}
