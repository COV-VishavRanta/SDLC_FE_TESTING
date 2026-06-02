import { IconProps } from '@/types';

export function PlusIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      className={className}
    >
      <line
        x1='9'
        y1='3.75'
        x2='9'
        y2='14.25'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='3.75'
        y1='9'
        x2='14.25'
        y2='9'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
