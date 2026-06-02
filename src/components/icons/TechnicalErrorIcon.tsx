import { IconProps } from '@/types';

export function TechnicalErrorIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='92'
      height='92'
      viewBox='0 0 92 92'
      fill='none'
      className={className}
    >
      {/* Gear / Cog */}
      <g
        transform='translate(2, 0) scale(2.8)'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      >
        <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
        <circle cx='12' cy='12' r='3' />
      </g>

      {/* White mask behind calendar to occlude gear */}
      <rect x='53' y='54' width='34' height='32' rx='5' fill='white' stroke='none' />

      {/* Calendar overlay */}
      <g stroke='currentColor' fill='none'>
        <rect x='56' y='58' width='28' height='26' rx='3' strokeWidth='3' />
        <line x1='56' y1='67' x2='84' y2='67' strokeWidth='3' />
        <line x1='65' y1='55' x2='65' y2='61' strokeWidth='2.5' strokeLinecap='round' />
        <line x1='75' y1='55' x2='75' y2='61' strokeWidth='2.5' strokeLinecap='round' />
        {/* Date marks */}
        <line x1='63' y1='73' x2='67' y2='73' strokeWidth='2' strokeLinecap='round' />
        <line x1='73' y1='73' x2='77' y2='73' strokeWidth='2' strokeLinecap='round' />
        <line x1='63' y1='78' x2='67' y2='78' strokeWidth='2' strokeLinecap='round' />
        <line x1='73' y1='78' x2='77' y2='78' strokeWidth='2' strokeLinecap='round' />
      </g>
    </svg>
  );
}
