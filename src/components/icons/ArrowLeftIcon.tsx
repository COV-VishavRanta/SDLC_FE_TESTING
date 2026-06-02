import { IconProps } from '@/types/icon.type';

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      className={className}
    >
      <path
        d='M6.38 11.0467L3.33333 8L6.38 4.95333'
        stroke='currentColor'
        strokeWidth='1.33333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.6667 8H3.33333'
        stroke='currentColor'
        strokeWidth='1.33333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
