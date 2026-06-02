'use client';

import { localeNames, localeShortNames, locales, useLocaleContext } from '@/i18n';
import { Menu } from '@base-ui/react';
import { useState } from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { FranceFlagIcon, GlobeIcon, SpainFlagIcon, UsaFlagIcon } from '../icons/LanguageIcon';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const flagIcons = {
  en: UsaFlagIcon,
  es: SpainFlagIcon,
  fr: FranceFlagIcon,
};
const menuHandler = Menu.createHandle();

interface LanguageSwitcherProps {
  noShadow?: boolean;
}

/**
 * LanguageSwitcher Component
 * Dropdown to switch between available locales
 */
export function LanguageSwitcher({ noShadow = false }: LanguageSwitcherProps) {
  const { locale, setLocale, isPending } = useLocaleContext();
  const [open, setOpen] = useState(false);
  const CurrentFlag = flagIcons[locale];

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <DropdownMenu handle={menuHandler} open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        handle={menuHandler}
        disabled={isPending}
        className={`bg-white/90 border border-border rounded-[12px] ${noShadow ? '' : 'shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]'} h-[43px] w-auto px-3 wide:w-[160px] wide:px-[17px] flex items-center gap-[8px] hover:bg-white transition-colors disabled:cursor-not-allowed disabled:text-[var(--disabled-text)] outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus-ring)] focus-visible:border-[var(--focus-border)]`}
      >
        <div className='hidden wide:block w-[18px] h-[14px] text-[#6B7280]'>
          <GlobeIcon />
        </div>
        <div className='hidden wide:flex w-[18px] h-[18px] items-center justify-center text-[14px]'>
          <CurrentFlag />
        </div>
        {/* Below 1200px: short code (EN/ES/FR), 1200px+: full name */}
        <div className='text-[14px] font-medium leading-[21px] text-[#1a1d21] block wide:hidden'>
          {localeShortNames[locale]}
        </div>
        <div className='text-[14px] font-medium leading-[21px] text-[#1a1d21] hidden wide:block'>
          {localeNames[locale]}
        </div>
        <div
          className={`w-[18px] h-[18px] transition-transform duration-200${open ? ' rotate-180' : ''}`}
        >
          <ChevronDownIcon />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-[160px] bg-white border border-border rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-0 overflow-hidden'
      >
        {locales.map((loc) => {
          const FlagIcon = flagIcons[loc];
          const isChecked = locale === loc;
          return (
            <DropdownMenuCheckboxItem
              key={loc}
              checked={isChecked}
              onCheckedChange={() => setLocale(loc)}
              className='h-[54px] px-[16px] flex items-center gap-[12px] focus:bg-sidebar-accent data-checked:bg-sidebar-accent rounded-none border-0 cursor-pointer'
              closeOnClick
            >
              <div className='w-[20px] h-[30px] flex items-center justify-center text-[20px]'>
                <FlagIcon />
              </div>
              <div className='flex-1 text-[14px] font-normal leading-[21px] text-[#1a1d21]'>
                {localeNames[loc]}
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
