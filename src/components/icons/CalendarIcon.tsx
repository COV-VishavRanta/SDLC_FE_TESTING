import { IconProps } from '@/types';

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      className={className}
    >
      <rect
        x='1.167'
        y='2.333'
        width='11.667'
        height='10.5'
        rx='1.167'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='9.333'
        y1='0.583'
        x2='9.333'
        y2='4.083'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='4.667'
        y1='0.583'
        x2='4.667'
        y2='4.083'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='1.167'
        y1='6.417'
        x2='12.833'
        y2='6.417'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
