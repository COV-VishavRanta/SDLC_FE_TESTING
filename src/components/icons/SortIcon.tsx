import { IconProps } from '@/types';

export function SortIcon({ className }: IconProps) {
  return (
    <svg
      width={14}
      height={14}
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M12.25 9.334l-2.333 2.333-2.333-2.333M9.916 11.667V2.334M1.75 4.667l2.333-2.333 2.334 2.333M4.083 2.334v9.333'
        stroke='#6B7280'
        strokeWidth={1.16667}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
