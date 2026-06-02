import { IconProps } from '@/types';

export function UserManagementIcon({ className }: IconProps) {
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
        d='M14.167 17.5v-1.667a3.333 3.333 0 0 0-3.334-3.333H5.833a3.333 3.333 0 0 0-3.333 3.333V17.5'
        stroke='currentColor'
        strokeWidth='1.67'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='8.333'
        cy='5.833'
        r='3.333'
        stroke='currentColor'
        strokeWidth='1.67'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17.5 17.5v-1.667a3.333 3.333 0 0 0-2.5-3.225'
        stroke='currentColor'
        strokeWidth='1.67'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.5 2.608a3.333 3.333 0 0 1 0 6.45'
        stroke='currentColor'
        strokeWidth='1.67'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
