import Image from 'next/image';
import { Suspense } from 'react';
import { ErrorBoundary } from '../error-boundary/error-boundary';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { SidebarMobileOpenTrigger } from '../ui/sidebar';

import EntityDisplay from './entity-display';
import NotificationDropdown from './notification-dropdown';
import { ProfileDropdown, UserProfileSkeleton } from './profile-dropdown';

export default function AppTopbar() {
  return (
    <header className='sticky top-0 z-[999] flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:px-8 py-4'>
      {/* Mobile: Hamburger + Logo | Desktop: empty (logo is in sidebar) */}
      <div className='flex items-center gap-3'>
        <SidebarMobileOpenTrigger />
        {/* Logo — visible on mobile only */}
        <Image
          src='/logo.svg'
          alt='POPLogic'
          width={120}
          height={32}
          priority
          className='block wide:hidden'
        />
      </div>

      {/* Header items — always right-aligned */}
      <div className='ml-auto flex items-center gap-1 lg:gap-8'>
        {/* Language Switcher — reuses the same component from the login page */}
        <LanguageSwitcher noShadow />

        {/* Notification Dropdown */}
        <NotificationDropdown />

        {/* Entity Display — hidden on mobile (shown in profile dropdown instead) */}
        <Suspense fallback={<div className='hidden md:block w-32 h-10' />}>
          <div className='hidden md:flex'>
            <EntityDisplay />
          </div>
        </Suspense>

        {/* User Profile Dropdown */}
        <ErrorBoundary>
          <Suspense fallback={<UserProfileSkeleton />}>
            <ProfileDropdown />
          </Suspense>
        </ErrorBoundary>
      </div>
    </header>
  );
}
