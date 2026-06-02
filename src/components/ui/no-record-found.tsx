import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon';

interface NoRecordFoundProps {
  /** Optional custom message. Defaults to "No Record Found". */
  message?: string;
}

/**
 * Info-style alert banner shown when a list or table has no matching records.
 * Figma: node-id 4852-39238
 */
export function NoRecordFound({ message = 'No Record Found' }: NoRecordFoundProps) {
  return (
    <div
      className='flex w-full items-center rounded-[8px] border-2 border-[var(--neutral-200)] bg-[var(--neutral-200)] p-[14px]'
      role='status'
      aria-label={message}
    >
      {/* Icon wrapper */}
      <div
        className='mr-3 flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-[#e6f4fa]'
        aria-hidden='true'
      >
        <InfoCircleIcon className='size-6 text-[var(--primary)]' />
      </div>

      {/* Label */}
      <p className='text-[14px] font-medium leading-5 tracking-[-0.15px] text-[var(--primary)]'>
        {message}
      </p>
    </div>
  );
}
