import { IconProps } from '@/types';

export function EmailIcon({ className }: IconProps) {
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
        d='M15.8331 0.833313H2.49966C1.57919 0.833313 0.833008 1.57952 0.833008 2.49999V12.5C0.833008 13.4205 1.57919 14.1667 2.49966 14.1667H15.8331C16.7535 14.1667 17.4997 13.4205 17.4997 12.5V2.49999C17.4997 1.57952 16.7535 0.833313 15.8331 0.833313Z'
        stroke='currentColor'
        strokeWidth='1.66667'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17.5006 2.83301L10.0256 7.58298C9.76841 7.74418 9.47091 7.82968 9.16731 7.82968C8.86371 7.82968 8.56625 7.74418 8.30898 7.58298L0.833984 2.83301'
        stroke='currentColor'
        strokeWidth='1.66667'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
