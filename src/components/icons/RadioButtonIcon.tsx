import { IconProps } from '@/types';

export function RadioButtonIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      <circle
        cx='10'
        cy='10'
        r='7.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='10' cy='10' r='4' fill='currentColor' />
    </svg>
  );
}
