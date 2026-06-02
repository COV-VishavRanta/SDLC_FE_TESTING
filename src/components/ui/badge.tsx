import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/* ── Badge variants — sourced from Figma (node-id=3199-12494) ── */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-[var(--font-weight-medium)] leading-5 whitespace-nowrap transition-colors select-none',
  {
    variants: {
      variant: {
        default: '',
        /* Green — Active */
        active:
          'bg-[var(--badge-active-bg)] border-[var(--badge-active-border)] text-[var(--badge-active-text)]',
        /* Gray — Inactive / Draft */
        inactive:
          'bg-[var(--badge-inactive-bg)] border-[var(--badge-inactive-border)] text-[var(--badge-inactive-text)]',
        /* Primary Blue — Pending / Submitted */
        pending:
          'bg-[var(--badge-pending-bg)] border-[var(--badge-pending-border)] text-[var(--badge-pending-text)]',
        /* Yellow — Warning / Pending Approval */
        warning:
          'bg-[var(--badge-warning-bg)] border-[var(--badge-warning-border)] text-[var(--badge-warning-text)]',
        /* Pastel Blue — Info / Partially Shipped */
        info: 'bg-[var(--badge-info-bg)] border-[var(--badge-info-border)] text-[var(--badge-info-text)]',
        /* Red — Error / Missing */
        error:
          'bg-[var(--badge-error-bg)] border-[var(--badge-error-border)] text-[var(--badge-error-text)]',
        /* Purple — Defective */
        purple:
          'bg-[var(--badge-purple-bg)] border-[var(--badge-purple-border)] text-[var(--badge-purple-text)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

/** Decorative dot indicator — aria-hidden as text label is already present */
function BadgeDot() {
  return (
    <span aria-hidden='true' className='inline-block size-1.5 shrink-0 rounded-full bg-current' />
  );
}

export interface BadgeProps
  extends React.ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  /** Show the leading dot indicator (default: true) */
  showDot?: boolean;
}

function Badge({ className, variant, showDot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot && <BadgeDot />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
