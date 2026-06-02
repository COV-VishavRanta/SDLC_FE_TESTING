'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { flexRender, Table as TanStackTable } from '@tanstack/react-table';
import { NoRecordFound } from './no-record-found';

interface TableProps extends React.ComponentProps<'table'> {
  containerClassName?: string;
}

function Table({ className, containerClassName, ...props }: TableProps) {
  return (
    <div
      data-slot='table-container'
      className={cn('relative w-full overflow-x-auto', containerClassName)}
    >
      <table
        data-slot='table'
        className={cn('w-full min-w-max caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot='table-header'
      className={cn(
        'sticky top-0 z-10 bg-[var(--table-header-bg)] [&_tr]:border-b [&_tr]:border-[var(--table-border-color)] [&_tr]:bg-[var(--table-header-bg)]',
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot='table-body'
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  // using div instead of tfoot to avoid hydration issue with next.js, since tfoot is rendered in a different order on server and client.
  return (
    <div
      data-slot='table-footer'
      className={cn(
        'border-t border-[var(--table-border-color)] bg-white flex flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-[25px] sm:pb-[13px] sm:pt-[12px] [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot='table-row'
      className={cn(
        'border-b border-[var(--table-border-color)] bg-[var(--table-row-bg)] transition-colors hover:bg-[var(--table-row-hover-bg)] data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      scope='col'
      className={cn(
        'text-left align-middle [&:has([role=checkbox])]:pr-0 py-[var(--table-cell-py)] px-[var(--table-cell-px)] text-xs font-[var(--font-weight-medium)] uppercase tracking-[var(--table-tracking)] text-[var(--table-header-text)]',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      className={cn(
        'px-[var(--table-cell-px)] py-[var(--table-cell-py)] align-middle text-left text-sm font-[var(--font-weight-regular)] text-[var(--table-cell-text)] tracking-[var(--table-tracking)] [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot='table-caption'
      className={cn('text-muted-foreground mt-4 text-sm sr-only', className)}
      {...props}
    />
  );
}

interface DataTableBodyProps<TData> {
  /** The TanStack table instance */
  table: TanStackTable<TData>;
  /** Whether data is currently loading */
  isLoading?: boolean;
  /** Component to render when loading (usually the skeleton rows) */
  loadingContent: React.ReactNode;
  /** Message to display when there are no results */
  emptyMessage?: string;
  /** Optional class name for the rows (e.g. for setting fixed heights) */
  rowClassName?: string;
  /** Optional click handler for rows */
  onRowClick?: (row: TData) => void;
}

export function DataTableBody<TData>({
  table,
  isLoading = false,
  loadingContent,
  emptyMessage = 'No data available',
  rowClassName,
  onRowClick,
}: DataTableBodyProps<TData>) {
  'use no memo';
  const { rows } = table.getRowModel();

  return (
    <TableBody>
      {isLoading ? (
        // Render the skeleton loader passed from parent
        loadingContent
      ) : rows.length > 0 ? (
        // Render the actual data rows
        rows.map((row) => (
          <TableRow
            key={row.id}
            className={cn(rowClassName, !row.getCanSelect() && 'opacity-50 bg-muted/40')}
            data-state={row.getIsSelected() && 'selected'}
            onClick={() => onRowClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        // Render Empty State
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length} className='p-3'>
            <NoRecordFound message={emptyMessage} />
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

export {
  // table components
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
