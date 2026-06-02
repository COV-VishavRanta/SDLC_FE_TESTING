import { IconProps } from '@/types';

export function AlertTriangleIcon({ className }: IconProps) {
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
        d='M8.57465 3.21665L1.51632 14.1667C1.37079 14.4187 1.29379 14.7044 1.29298 14.9954C1.29216 15.2864 1.36756 15.5725 1.51167 15.8254C1.65578 16.0782 1.86359 16.2889 2.11441 16.4365C2.36523 16.584 2.65032 16.6633 2.94132 16.6667H17.058C17.349 16.6633 17.6341 16.584 17.8849 16.4365C18.1357 16.2889 18.3435 16.0782 18.4876 15.8254C18.6318 15.5725 18.7072 15.2864 18.7063 14.9954C18.7055 14.7044 18.6285 14.4187 18.483 14.1667L11.4247 3.21665C11.2761 2.97174 11.0669 2.76925 10.8171 2.62872C10.5672 2.48819 10.2849 2.41431 9.99798 2.41431C9.71107 2.41431 9.42871 2.48819 9.17889 2.62872C8.92907 2.76925 8.71993 2.97174 8.57132 3.21665H8.57465Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 7.5V10.8333'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 14.1667H10.0083'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
