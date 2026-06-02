'use client';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

import { CalendarIcon } from '../icons/CalendarIcon';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

import { Matcher } from 'react-day-picker';
import { ErrorIcon } from '../icons/ErrorIcon';
import { UserIcon } from '../icons/UserIcon';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './combobox';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot='field-set'
      className={cn(
        'gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 flex flex-col',
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot='field-legend'
      data-variant={variant}
      className={cn(
        'mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base',
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='field-group'
      className={cn(
        'gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4 group/field-group @container/field-group flex w-full flex-col',
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva('data-[invalid=true]:text-destructive gap-3 group/field flex w-full', {
  variants: {
    orientation: {
      vertical: 'flex-col [&>*]:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role='group'
      data-slot='field'
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='field-content'
      className={cn('gap-1 group/field-content flex flex-1 flex-col leading-snug', className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof Label> & { required?: boolean }) {
  return (
    <Label
      data-slot='field-label'
      className={cn(
        'has-data-checked:bg-primary/5 has-data-checked:border-primary dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:text-[var(--disabled-text)] has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-3 group/field-label peer/field-label flex w-fit leading-snug',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className='ml-0.5 text-[var(--label-required)]'>*</span>}
    </Label>
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='field-label'
      className={cn(
        'gap-2 text-sm font-medium group-data-[disabled=true]/field:text-[var(--disabled-text)] flex w-fit items-center leading-snug',
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot='field-description'
      className={cn(
        'text-muted-foreground text-left text-sm [[data-variant=legend]+&]:-mt-1.5 leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
        'last:mt-0 nth-last-2:-mt-1',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot='field-separator'
      data-content={!!children}
      className={cn(
        '-my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 relative',
        className,
      )}
      {...props}
    >
      <Separator className='absolute inset-0 top-1/2' />
      {children && (
        <span
          className='text-muted-foreground px-2 bg-background relative mx-auto block w-fit'
          data-slot='field-separator-content'
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: ({ message?: string } | undefined)[];
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className='ml-4 flex list-disc flex-col gap-1'>
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role='alert'
      data-slot='field-error'
      className={cn('text-destructive text-sm font-normal', className)}
      {...props}
    >
      <ErrorIcon />
      {content}
    </div>
  );
}
interface FormInputFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  /** Optional hint rendered below the label (e.g. unit clarification) */
  description?: string;
  required?: boolean;
  error?: string | null;
  placeholder?: string;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T, Path<T>>;
  type?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  disabled?: boolean;
  readonly?: boolean;
  /** WCAG 1.3.5 — Identify Input Purpose: provides browser autofill hint */
  autoComplete?: string;
  pattern?: string;
}

function FormInputField<T extends FieldValues>({
  id,
  label,
  description,
  required = false,
  error,
  placeholder,
  register,
  registerOptions,
  type = 'text',
  step,
  min,
  max,
  disabled = false,
  readonly = false,
  autoComplete,
  pattern,
}: FormInputFieldProps<T>) {
  return (
    <Field className='flex min-h-[74.5px] flex-col gap-2' aria-disabled={disabled}>
      <div className='flex flex-col gap-0.5'>
        <FieldLabel
          htmlFor={id}
          className='flex items-center text-[var(--label-size)] text-[var(--label-color)] font-[var(--font-weight-medium)] leading-[19.5px]'
          required={required}
        >
          {label}
        </FieldLabel>
        {description !== null && (
          <span className='text-[12px] leading-[16px] text-muted-foreground'>{description}</span>
        )}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-disabled={disabled}
        disabled={disabled}
        readOnly={readonly}
        step={step}
        min={min}
        max={max}
        pattern={pattern}
        {...register(id, registerOptions)}
        className='h-[var(--input-height)] rounded-[var(--input-radius)] border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-3 text-[14px] tracking-[-0.15px] shadow-none placeholder:text-[var(--input-placeholder)]'
      />
      <FieldError
        className='text-[13px] sm:text-[14px] mt-[0.25rem]'
        errors={error ? [{ message: error }] : []}
      />
    </Field>
  );
}

interface FormComboboxFieldProps<TItem> {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  placeholder?: string;
  items: TItem[];
  emptyText?: string;
  labelKey: keyof TItem;
  valueKey: keyof TItem;
  disabled?: boolean;
  onChange: (value: string | null) => void;
  value?: string | null;
  isLoading?: boolean;
  /** Per-item render fn — receives each filtered item, returns the ComboboxItem node */
  renderItem?: (item: TItem, index: number) => React.ReactNode;
  /** Content rendered below the list inside the popup (e.g. an "Add" button) */
  listFooter?: React.ReactNode;
}

function FormComboboxField<TItem>({
  id,
  label,
  required = false,
  error,
  placeholder = 'Search...',
  emptyText = 'No options found.',
  onChange,
  value,
  items = [],
  labelKey,
  valueKey,
  disabled = false,
  renderItem,
  listFooter,
  isLoading = false,
}: FormComboboxFieldProps<TItem>) {
  const fieldRef = useRef<HTMLDivElement>(null);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const labelA = String(a[labelKey]).toLowerCase();
      const labelB = String(b[labelKey]).toLowerCase();
      return labelA.localeCompare(labelB);
    });
  }, [items, labelKey]);

  // Find the selected item based on the current value (ID)
  const selectedItem = sortedItems.find((item) => String(item[valueKey]) === value) ?? null;

  // Base UI renders a CSS-hidden <input aria-hidden="true"> for native-form
  // integration (not type="hidden"). Scanners that do not exclude aria-hidden
  // inputs from the missing-label audit flag this as a violation (WCAG 1.3.1 /
  // 3.3.2). Adding title gives every scanner a label to satisfy the rule.
  useEffect(() => {
    const hiddenInput = fieldRef.current?.querySelector<HTMLInputElement>(
      'input[aria-hidden="true"]',
    );
    if (hiddenInput) {
      hiddenInput.setAttribute('title', label);
    }
  }, [label]);

  return (
    <Field
      ref={fieldRef}
      aria-disabled={disabled || isLoading}
      className='flex min-h-[74.5px] flex-col gap-2'
    >
      <FieldLabel
        htmlFor={id}
        className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px]'
        required={required}
      >
        {label}
      </FieldLabel>
      <Combobox
        items={sortedItems}
        itemToStringLabel={(item: TItem) => String(item[labelKey])}
        itemToStringValue={(item: TItem) => String(item[valueKey])}
        value={selectedItem ?? null}
        onValueChange={(item: TItem | null) => {
          if (item === null || item === undefined) {
            onChange(null);
            return;
          }
          onChange(String(item[valueKey]));
        }}
        disabled={disabled || isLoading}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          isLoading={isLoading}
          aria-invalid={!!error}
        />
        <ComboboxContent>
          <ComboboxEmpty>{isLoading ? 'Loading...' : emptyText}</ComboboxEmpty>
          <ComboboxList>
            {(item: TItem, index: number) =>
              renderItem ? (
                renderItem(item, index)
              ) : (
                <ComboboxItem key={String(item[valueKey])} value={item}>
                  {String(item[labelKey])}
                </ComboboxItem>
              )
            }
          </ComboboxList>
          {listFooter}
        </ComboboxContent>
      </Combobox>
      <FieldError
        className='text-[13px] sm:text-[14px] mt-[0.25rem]'
        errors={error ? [{ message: error }] : []}
      />
    </Field>
  );
}

interface FormTextareaFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  required?: boolean;
  error?: string | null;
  placeholder?: string;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T, Path<T>>;
  disabled?: boolean;
  rows?: number;
}

function FormTextareaField<T extends FieldValues>({
  id,
  label,
  required = false,
  error,
  placeholder,
  register,
  registerOptions,
  disabled = false,
  rows,
}: FormTextareaFieldProps<T>) {
  return (
    <Field className='flex flex-col gap-2' aria-disabled={disabled}>
      <FieldLabel
        htmlFor={id}
        className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px]'
        required={required}
      >
        {label}
      </FieldLabel>
      <Textarea
        id={id}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-disabled={disabled}
        disabled={disabled}
        rows={rows}
        {...register(id, registerOptions)}
        className='min-h-[90px] rounded-[var(--input-radius)] border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-3 text-[14px] tracking-[-0.15px] shadow-none placeholder:text-[var(--input-placeholder)] field-sizing-fixed resize-none leading-[20px]'
      />
      <FieldError
        className='text-[13px] sm:text-[14px] mt-[0.25rem]'
        errors={error ? [{ message: error }] : []}
      />
    </Field>
  );
}

interface FormDatePickerFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  required?: boolean;
  error?: string | null;
  placeholder: string;
  control: Control<T>;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
}

function FormDatePickerField<T extends FieldValues>({
  id,
  label,
  required = false,
  error,
  placeholder = 'Select date',
  control,
  disabled = false,
  disabledDates,
}: FormDatePickerFieldProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <Field className='flex min-h-[74.5px] flex-col gap-2' aria-disabled={disabled}>
      <FieldLabel
        htmlFor={id}
        className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px]'
        required={required}
      >
        {label}
      </FieldLabel>
      <Controller
        control={control}
        name={id}
        render={({ field }) => {
          const selectedDate = field.value
            ? new Date(`${field.value as string}T00:00:00`)
            : undefined;
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                id={id}
                aria-invalid={!!error}
                render={
                  <Button
                    variant='outline'
                    className={cn(
                      'h-[var(--input-height)] w-full justify-start rounded-[var(--input-radius)] border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-[14px] tracking-[-0.15px] font-normal shadow-none hover:bg-[var(--input-bg)] disabled:bg-[var(--neutral-100)] disabled:cursor-not-allowed disabled:border-[var(--gray-200)] disabled:text-[var(--disabled-text)]',
                      !field.value && 'text-[var(--input-placeholder)]',
                      error && 'border-destructive',
                    )}
                    disabled={disabled}
                  />
                }
              >
                <CalendarIcon className='mr-2 shrink-0' />
                {selectedDate ? format(selectedDate, 'PPP') : placeholder}
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={selectedDate}
                  onSelect={(date) => {
                    field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                    setOpen(false);
                  }}
                  disabled={disabledDates}
                  captionLayout='dropdown'
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      <FieldError
        className='text-[13px] sm:text-[14px] mt-[0.25rem]'
        errors={error ? [{ message: error }] : []}
      />
    </Field>
  );
}

/* ── Helper for details page: labelled read-only field ── */
function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-[12px] font-[var(--font-weight-medium)] uppercase leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
        {label}
      </span>
      <span className='break-words sm:break-normal text-[16px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.23px] text-[var(--text-heading)]'>
        {String(value) || '—'}
      </span>
    </div>
  );
}

/** Renders an admin row with avatar, name, and email */
function InfoAdminCard({ name, email }: { name: string; email: string }) {
  return (
    <div className='flex h-[74px] items-center gap-3 rounded-lg border border-[var(--neutral-300)] bg-white px-[17px]'>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-300)]'>
        <UserIcon className='size-5 text-[var(--primary-500)]' aria-hidden='true' />
      </div>
      <div className='min-w-0 flex-1 flex flex-col gap-0.5'>
        <div className='truncate text-[16px] font-[var(--font-weight-medium)] leading-[1.5] tracking-[-0.15px] text-[var(--neutral-900)]'>
          {name}
        </div>
        <p className='truncate text-[14px] font-[var(--font-weight-regular)] leading-[1.2] tracking-[-0.15px] text-[var(--neutral-500)]'>
          {email}
        </p>
      </div>
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,

  // CUSTOM FIELDS
  FormComboboxField,
  FormDatePickerField,
  FormInputField,
  FormTextareaField,
  InfoAdminCard,
  InfoField,
};
