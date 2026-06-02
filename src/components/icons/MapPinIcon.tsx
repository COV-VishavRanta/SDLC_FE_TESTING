import { IconProps } from '@/types';

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      className={className}
    >
      <path
        d='M12.25 5.833c0 4.084-5.25 7.584-5.25 7.584S1.75 9.917 1.75 5.833a5.25 5.25 0 1 1 10.5 0Z'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='7'
        cy='5.833'
        r='1.75'
        stroke='currentColor'
        strokeWidth='1.167'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
