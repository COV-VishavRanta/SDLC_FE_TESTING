'use client';

import { ALERT_TYPE_STYLES, AlertType } from '@/constant';
import React from 'react';

import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { InactiveCircleIcon } from '../icons/InactiveCircleIcon';

interface AlertRowProps {
  type: AlertType;
  title: string;
  description: string;
  viewAction?: React.ReactNode;
}

// ── Alert icon per type — Figma: 18px for error/warning, 16px for info, 20px for success ──
function AlertTypeIcon({ type }: { type: AlertType }) {
  switch (type) {
    case AlertType.ERROR:
      return <AlertTriangleIcon className='size-[18px]' />;
    case AlertType.WARNING:
      return <ClockIcon className='size-[18px]' />;
    case AlertType.SUCCESS:
      return <CheckCircleIcon className='size-5' />;
    case AlertType.INFO:
      return <InactiveCircleIcon className='size-4' />;
    default:
      return null;
  }
}

// ── Alert row ───────────────────────────────────────────────────────────────
function AlertRow({ type, title, description, viewAction }: AlertRowProps) {
  const styles = ALERT_TYPE_STYLES[type];

  return (
    <div
      className={`flex items-center justify-between rounded-[8px] p-[14px] ${styles.row}`}
      role='listitem'
    >
      {/* Left: icon + text */}
      <div className='flex items-center gap-3 min-w-0'>
        {/* Icon wrapper */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${styles.icon}`}
          aria-hidden='true'
        >
          <AlertTypeIcon type={type} />
        </div>

        {/* Text */}
        <div className='min-w-0'>
          <p
            className={`text-[14px] font-medium leading-5 tracking-[-0.15px] truncate ${styles.title}`}
          >
            {title}
          </p>
          <p
            className={`text-[12px] font-normal leading-5 tracking-[-0.15px] line-clamp-2 sm:line-clamp-1 ${styles.subtitle}`}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Right: view action (dialog trigger) or fallback href button */}
      {viewAction}
    </div>
  );
}

export { AlertRow };
