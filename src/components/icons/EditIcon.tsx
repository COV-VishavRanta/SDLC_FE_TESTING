import { IconProps } from '@/types';

export function EditIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      className={className}
    >
      <g clipPath='url(#clip0_1359_2569)'>
        <path
          d='M11.3334 2.00004C11.5085 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.419 1.44775 12.6667 1.44775C12.9145 1.44775 13.1599 1.49653 13.3887 1.59129C13.6174 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38264 14.4088 2.61136C14.5036 2.84009 14.5523 3.08555 14.5523 3.33337C14.5523 3.58119 14.5036 3.82665 14.4088 4.05538C14.314 4.28411 14.1751 4.49161 14 4.66671L5.00004 13.6667L1.33337 14.6667L2.33337 11L11.3334 2.00004Z'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_1359_2569'>
          <rect width='16' height='16' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}
