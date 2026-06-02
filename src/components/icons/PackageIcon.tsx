import { IconProps } from '@/types';

export function PackageIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      className={className}
    >
      <path
        d='M16.5 9.4L7.5 4.21'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M21 16V8C20.9996 7.6493 20.9071 7.30504 20.7315 7.00155C20.556 6.69805 20.3037 6.44644 20 6.27L13 2.27C12.696 2.09347 12.3511 2.00068 12 2.00068C11.6489 2.00068 11.304 2.09347 11 2.27L4 6.27C3.69626 6.44644 3.44398 6.69805 3.26846 7.00155C3.09294 7.30504 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.695 3.26846 16.9985C3.44398 17.302 3.69626 17.5536 4 17.73L11 21.73C11.304 21.9065 11.6489 21.9993 12 21.9993C12.3511 21.9993 12.696 21.9065 13 21.73L20 17.73C20.3037 17.5536 20.556 17.302 20.7315 16.9985C20.9071 16.695 20.9996 16.3507 21 16Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.27002 6.96L12 12.01L20.73 6.96'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 22.08V12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
