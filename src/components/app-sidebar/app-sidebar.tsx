import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';
import { AppSidebarNav } from './app-sidebar-nav';
// Direct import keeps AppSidebarNav in the server module graph — do NOT
// re-export or import this through the @/components barrel.

export default function AppSidebar({
  children,
  initialIsImpersonating,
}: {
  children: React.ReactNode;
  initialIsImpersonating: boolean;
}) {
  return (
    <SidebarProvider
      defaultOpen
      className={cn(initialIsImpersonating ? 'h-[calc(100vh-60px)] top-[60px]' : 'h-screen')}
    >
      <AppSidebarNav initialIsImpersonating={initialIsImpersonating} />
      <SidebarInset
        className={cn(
          initialIsImpersonating ? 'h-[calc(100vh-60px)] top-[60px]' : 'h-screen',
          'overflow-y-auto',
        )}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
