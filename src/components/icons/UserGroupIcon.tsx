import { IconProps } from '@/types';

export function UserGroupIcon({ className }: IconProps) {
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
        d='M12.75 15.75V14.25C12.75 13.4544 12.4339 12.6913 11.8713 12.1287C11.3087 11.5661 10.5456 11.25 9.75 11.25H3.75C2.95435 11.25 2.19129 11.5661 1.62868 12.1287C1.06607 12.6913 0.75 13.4544 0.75 14.25V15.75'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='6.75'
        cy='5.25'
        r='3'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17.25 15.75V14.25C17.2494 13.5853 17.0281 12.9393 16.621 12.4143C16.2139 11.8893 15.6436 11.5153 15 11.3475'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 2.3475C12.6453 2.51427 13.2173 2.88842 13.6254 3.41434C14.0335 3.94026 14.2552 4.58769 14.2552 5.25375C14.2552 5.91981 14.0335 6.56724 13.6254 7.09316C13.2173 7.61908 12.6453 7.99323 12 8.16'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
