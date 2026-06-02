import { IconProps } from '@/types';

export function CampaignOnHoldIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      className={className}
    >
      <path
        d='M8 1.33334C4.31811 1.33334 1.33334 4.31811 1.33334 8C1.33334 11.6819 4.31811 14.6667 8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.31811 11.6819 1.33334 8 1.33334Z'
        stroke='currentColor'
        strokeWidth='1.33333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6 6V10'
        stroke='currentColor'
        strokeWidth='1.33333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 6V10'
        stroke='currentColor'
        strokeWidth='1.33333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
