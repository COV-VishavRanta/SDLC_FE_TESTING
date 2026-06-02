import { IconProps } from '@/types';

export function CollapseIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      id='expand'
      width='19'
      height='91'
      viewBox='0 0 19 91'
      className={className}
    >
      <path
        id='Path_1'
        data-name='Path 1'
        d='M19,0h0A19,19,0,0,0,0,19V72A19,19,0,0,0,19,91h0Z'
        fill='#e1e6eb'
      />
      <path
        id='Path_2'
        data-name='Path 2'
        d='M9.25,45.5,16,38.139V52.861Z'
        transform='translate(0 0)'
        fill='#fff'
      />
    </svg>
  );
}
