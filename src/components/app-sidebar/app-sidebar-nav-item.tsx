'use client';

import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface NavItem {
  href: string;
  name: string;
  displayName: string;
  /** Pre-rendered icon JSX — rendered on the server to avoid passing functions to client */
  icon?: ReactNode;
}

export function AppSideBarNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);
  const { isMobile, setOpenMobile } = useSidebar();

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        render={
          <Link href={item.href} className='w-full' onClick={handleClick}>
            {item.icon}
            <span className='group-data-[collapsible=icon]:hidden'>{item.displayName}</span>
          </Link>
        }
        className={`w-full h-[45px] rounded-none pl-6 gap-3 font-medium text-[14px] leading-[21px] transition-colors group-data-[collapsible=icon]:pl-2 group-data-[collapsible=icon]:justify-center ${
          isActive
            ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)] border-r-[3px] border-[var(--sidebar-primary)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary)]'
            : 'text-sidebar-foreground hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary)]'
        }`}
      ></SidebarMenuButton>
    </SidebarMenuItem>
  );
}
