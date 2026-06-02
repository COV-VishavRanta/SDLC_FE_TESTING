import { IconProps } from '@/types/icon.type';

export function FileEarmarkImageIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='currentColor'
      className={className}
    >
      <path d='M6.502 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z' />
      <path d='M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .799-.01L13 11.2V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z' />
    </svg>
  );
}
