import { IconProps } from '@/types';

export function ShipmentsIcon({ className }: IconProps) {
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
        d='M1.66663 4.16667H12.5V13.3333H1.66663V4.16667Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.5 6.66667H15.4166L18.3333 9.58334V13.3333H12.5V6.66667Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='4.58329' cy='13.3333' r='1.66667' stroke='currentColor' strokeWidth='1.5' />
      <circle cx='14.9999' cy='13.3333' r='1.66667' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  );
}
