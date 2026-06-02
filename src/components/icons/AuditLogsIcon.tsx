import { IconProps } from '@/types/icon.type';

export function AuditLogsIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      <path
        d='M11.667 1.667H5a1.667 1.667 0 0 0-1.667 1.666v13.334A1.667 1.667 0 0 0 5 18.333h10a1.667 1.667 0 0 0 1.667-1.666v-10l-5-5Z'
        stroke='currentColor'
        strokeWidth='1.67'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.667 1.667v5h5'
        stroke='currentColor'
        strokeWidth='1.67'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='6.667'
        y1='10.833'
        x2='13.333'
        y2='10.833'
        stroke='currentColor'
        strokeWidth='1.67'
        strokeLinecap='round'
      />
      <line
        x1='6.667'
        y1='14.167'
        x2='13.333'
        y2='14.167'
        stroke='currentColor'
        strokeWidth='1.67'
        strokeLinecap='round'
      />
    </svg>
  );
}
