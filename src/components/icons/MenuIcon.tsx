import { cn } from '@/lib/utils';
import { IconProps } from '@/types';

export function MenuIcon({ className }: IconProps) {
  return (
    <svg className={cn('size-6', className)} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M4 6h16M4 12h16M4 18h16'
      />
    </svg>
  );
}
