import { IconProps } from '@/types';

export function BrandIcon({ className }: IconProps) {
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
        d='M2.25 6.75H15.75V15.75H2.25V6.75Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6 6.75V3.75C6 3.35218 6.15804 2.97064 6.43934 2.68934C6.72064 2.40804 7.10218 2.25 7.5 2.25H10.5C10.8978 2.25 11.2794 2.40804 11.5607 2.68934C11.842 2.97064 12 3.35218 12 3.75V6.75'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M2.25 10.5H15.75'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
