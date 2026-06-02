import { IconProps } from '@/types';

export function InfoCircleIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      className={className}
    >
      <circle
        cx='8'
        cy='8'
        r='7'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='8'
        y1='7'
        x2='8'
        y2='11'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='8' cy='5' r='0.75' fill='currentColor' />
    </svg>
  );
}
