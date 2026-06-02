'use client';

import { cn } from '@/lib/utils';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { RiArrowDownSLine, RiArrowUpSLine, RiCheckLine } from '@remixicon/react';
import * as React from 'react';

const Select = <Value,>({
  ...props
}: SelectPrimitive.Root.Props<Value> & { 'aria-label': string }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('aria-hidden', 'true');
      inputRef.current.setAttribute('aria-label', props['aria-label'] ?? 'Select input');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef]);

  return <SelectPrimitive.Root inputRef={inputRef} {...props} />;
};

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot='select-group'
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot='select-value'
      className={cn(' inline-block text-left truncate min-w-0 ', className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: 'sm' | 'default';
  'aria-label': string;
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={size}
      className={cn(
        "border-[var(--input-border)] data-placeholder:text-[var(--input-placeholder)] bg-[var(--input-bg)] focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:border-2 gap-1.5 rounded-[var(--input-radius)] border py-2 pr-2 pl-2.5 text-sm shadow-none transition-[color,box-shadow] focus-visible:ring-3 data-[size=default]:h-[var(--input-height)] data-[size=sm]:h-8 *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:bg-[var(--neutral-100)] disabled:border-[var(--gray-200)] disabled:text-[var(--disabled-text)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0 h-full w-full text-[14px] font-[var(--font-weight-regular)] text-[var(--input-text)] px-3",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<RiArrowDownSLine className='text-muted-foreground size-4 pointer-events-none' />}
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot='select-scroll-up-button'
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 top-0 w-full",
        className,
      )}
      {...props}
    >
      <RiArrowUpSLine />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot='select-scroll-down-button'
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full",
        className,
      )}
      {...props}
    >
      <RiArrowDownSLine />
    </SelectPrimitive.ScrollDownArrow>
  );
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className='isolate z-[1050]'
      >
        <SelectPrimitive.Popup
          data-slot='select-content'
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            'bg-[var(--select-content-bg)] text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-md shadow-md ring-1 duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 relative isolate z-[1050] max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot='select-label'
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      className={cn(
        "focus:bg-[var(--select-item-hover-bg)] focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:cursor-not-allowed data-disabled:text-[var(--disabled-text)] [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className='flex flex-1 gap-2 shrink-0'>
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className='pointer-events-none absolute right-2 flex size-4 items-center justify-center' />
        }
      >
        <RiCheckLine className='pointer-events-none' />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={cn('bg-border -mx-1 my-1 h-px pointer-events-none', className)}
      {...props}
    />
  );
}

// custom
function SelectContentNotFound({
  className,
  fallback,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { fallback?: React.ReactNode }) {
  return (
    <div className={cn('text-muted-foreground px-3 py-2 text-[14px]', className)} {...props}>
      {fallback ?? 'No options found'}
    </div>
  );
}

export {
  Select,
  SelectContent,
  // custom
  SelectContentNotFound,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
