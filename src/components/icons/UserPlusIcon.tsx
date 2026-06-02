import { IconProps } from '@/types';

export function UserPlusIcon({ className }: IconProps) {
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
        d='M12 15.75v-1.5a3 3 0 0 0-3-3H3.75a3 3 0 0 0-3 3v1.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='6.375'
        cy='5.25'
        r='3'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='14.25'
        y1='6'
        x2='14.25'
        y2='12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <line
        x1='11.25'
        y1='9'
        x2='17.25'
        y2='9'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}
