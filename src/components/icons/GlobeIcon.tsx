import { IconProps } from '@/types';

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      className={className}
    >
      <circle
        cx='7'
        cy='7'
        r='5.833'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='1.167'
        y1='7'
        x2='12.833'
        y2='7'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 1.167A8.933 8.933 0 0 1 9.333 7 8.933 8.933 0 0 1 7 12.833 8.933 8.933 0 0 1 4.667 7 8.933 8.933 0 0 1 7 1.167Z'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
