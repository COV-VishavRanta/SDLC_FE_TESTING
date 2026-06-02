interface StatPillProps {
  label: string;
  value: number;
}

export function StatPill({ label, value }: StatPillProps) {
  return (
    <span
      aria-label={`${label}: ${value}`}
      className='flex flex-col items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium'
    >
      <span aria-hidden='true' className='text-text-secondary'>
        {label}
      </span>
      <span aria-hidden='true' className='font-semibold'>
        {value}
      </span>
    </span>
  );
}
