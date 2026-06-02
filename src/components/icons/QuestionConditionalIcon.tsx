import { IconProps } from '@/types';

export function QuestionConditionalIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      {/* Three horizontal lines */}
      <path
        d='M2.5 5.5H11.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M2.5 10H11.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M2.5 14.5H11.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      {/* X mark */}
      <path
        d='M14.5 7.5L17.5 12.5M17.5 7.5L14.5 12.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
