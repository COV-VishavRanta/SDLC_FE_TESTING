import { IconProps } from '@/types';

export function PlayIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
    >
      <path
        d='M3.75 2.25L15.75 9L3.75 15.75V2.25Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
