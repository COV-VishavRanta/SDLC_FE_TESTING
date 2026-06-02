import { IconProps } from '@/types';

export function DocumentPlusIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      className={className}
    >
      <path
        d='M10.5 1.5H4.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V6L10.5 1.5Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <polyline
        points='10.5 1.5 10.5 6 15 6'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='9'
        y1='9'
        x2='9'
        y2='13.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <line
        x1='6.75'
        y1='11.25'
        x2='11.25'
        y2='11.25'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}
