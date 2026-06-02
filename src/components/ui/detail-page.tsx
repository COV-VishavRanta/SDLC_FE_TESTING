'use client';

import { cn } from '@/lib/utils';
import { UserType } from '@/types';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { InfoAdminCard } from './field';
import { NoRecordFound } from './no-record-found';

interface AdminSectionCardProps {
  title: string;
  activeAdmins: UserType[];
  inactiveAdmins: UserType[];
  pendingAdmins: UserType[];
}

function AdminSectionCard({
  title,
  activeAdmins = [],
  inactiveAdmins = [],
  pendingAdmins = [],
}: AdminSectionCardProps) {
  const tDetails = useTranslations('detail-page');

  const groups = [
    {
      key: 'active',
      label: tDetails('userStatus.active'),
      users: activeAdmins,
      dotColor: 'bg-[#10B981]',
      badgeColor: 'bg-green-100 text-green-700',
    },
    {
      key: 'inactive',
      label: tDetails('userStatus.inactive'),
      users: inactiveAdmins,
      dotColor: 'bg-[var(--neutral-400)]',
      badgeColor: 'bg-[var(--neutral-200)] text-[var(--neutral-500)]',
    },
    {
      key: 'pending',
      label: tDetails('userStatus.pending'),
      users: pendingAdmins,
      dotColor: 'bg-amber-400',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
  ].filter((group) => group.users.length > 0);

  const hasGroups = groups.length > 0;

  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-[12px] font-semibold uppercase tracking-wide text-[var(--neutral-500)]'>
        {title}
      </h3>

      {!hasGroups ? (
        <NoRecordFound message={tDetails('noUsers')} />
      ) : (
        <Accordion
          defaultValue={groups.map((g) => g.key)}
          aria-label={title}
          multiple
          className='gap-3'
        >
          {groups.map((group) => (
            <AccordionItem
              key={group.key}
              value={group.key}
              className='overflow-hidden rounded-lg border border-[var(--neutral-300)]'
            >
              <AccordionTrigger className='items-center bg-white px-5 py-3 hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <span className={cn('size-2 shrink-0 rounded-full', group.dotColor)} />
                  <span className='text-[13px] font-semibold text-[var(--neutral-700)]'>
                    {group.label}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                      group.badgeColor,
                    )}
                  >
                    {group.users.length}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className='border-t border-[var(--neutral-300)] bg-[var(--neutral-200)] px-4 pb-4 pt-3'>
                <ul className='flex flex-col gap-2'>
                  {group.users.map((user) => (
                    <li key={user.id}>
                      <InfoAdminCard name={user.name ?? '—'} email={user.email} />
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export { AdminSectionCard };
