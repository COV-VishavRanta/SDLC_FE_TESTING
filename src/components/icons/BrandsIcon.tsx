import { IconProps } from '@/types';

export function BrandsIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      {/* Main building body */}
      <rect
        x='5'
        y='1.667'
        width='10'
        height='16.667'
        rx='1'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {/* Left wing */}
      <path
        d='M5 10H3.333C2.413 10 1.667 10.746 1.667 11.667V16.667C1.667 17.587 2.413 18.333 3.333 18.333H5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {/* Right wing */}
      <path
        d='M15 7.5H16.667C17.587 7.5 18.333 8.246 18.333 9.167V16.667C18.333 17.587 17.587 18.333 16.667 18.333H15'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {/* Roof triangle */}
      <path
        d='M8.333 5H11.667'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {/* Middle lines */}
      <path
        d='M8.333 8.333H11.667'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.333 11.667H11.667'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.333 15H11.667'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
