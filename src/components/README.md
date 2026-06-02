# Components

This folder contains all the UI components for the Pop Logic project.

## Structure

All components are exported from the `index.ts` file for centralized imports.

```tsx
// Example usage
import { ComponentName } from '@/components';
```

## Guidelines

- Each component should have its own folder with the following structure:

  ```
  {ComponentName}/
  ├── {ComponentName}.tsx       # Main component file
  ├── {ComponentName}.test.tsx  # Unit tests (optional)
  └── ... (any other related files)
  ```

- All related files (tests, styles, variants, utilities) for a component should live inside its folder
- Export all components from the root `src/components/index.ts` file

## Icons

UI icons (email, password, eye, chevron, etc.) are stored as **inline SVG React components** in the `icons/` subfolder.

### Icons Folder Structure

```
components/
├── icons/
│   ├── UserIcon.tsx
│   ├── EmailIcon.tsx
│   ├── PhoneIcon.tsx
│   ├── LockIcon.tsx
│   ├── EyeOffIcon.tsx
│   ├── ArrowLeftIcon.tsx
│   ├── ChevronDownIcon.tsx
│   ├── ErrorIcon.tsx
│   ├── LanguageIcon.tsx
│   └── index.ts          # Barrel export for all icons
└── index.ts              # Barrel export for all components & icons
```

### Why Icon Components?

- ✅ **Themeable:** Use `currentColor` for dynamic colors
- ✅ **Styleable:** Apply Tailwind classes (`className`)
- ✅ **Tree-shakeable:** Only bundled when imported
- ✅ **Type-safe:** Full TypeScript support
- ✅ **No requests:** Inlined in bundle (no HTTP overhead)
- ✅ **Server Component compatible:** No `'use client'` needed

### Creating Icon Components

```tsx
// components/icons/EmailIcon.tsx
export function EmailIcon() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
      <path
        d='M15.8331 0.833313H2.49966C1.57919 0.833313 0.833008 1.57952 0.833008 2.49999V12.5C0.833008 13.4205 1.57919 14.1667 2.49966 14.1667H15.8331C16.7535 14.1667 17.4997 13.4205 17.4997 12.5V2.49999C17.4997 1.57952 16.7535 0.833313 15.8331 0.833313Z'
        stroke='#6B7280'
        strokeWidth='1.66667'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17.5006 2.83301L10.0256 7.58298C9.76841 7.74418 9.47091 7.82968 9.16731 7.82968C8.86371 7.82968 8.56625 7.74418 8.30898 7.58298L0.833984 2.83301'
        stroke='#6B7280'
        strokeWidth='1.66667'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
```

### Usage

```tsx
import { EmailIcon, LockIcon, EyeOffIcon, Button, Input, Label } from '@/components';

export function LoginForm() {
  return (
    <div className='space-y-6'>
      {/* Email Field */}
      <div className='space-y-2'>
        <Label>Email</Label>
        <div className='relative'>
          <div className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'>
            <EmailIcon />
          </div>
          <Input type='email' placeholder='Enter your email' className='pl-12' />
        </div>
      </div>

      {/* Password Field */}
      <div className='space-y-2'>
        <Label>Password</Label>
        <div className='relative'>
          <div className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'>
            <LockIcon />
          </div>
          <Input type='password' placeholder='Enter your password' className='pl-12 pr-10' />
          <button
            type='button'
            className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
          >
            <EyeOffIcon />
          </button>
        </div>
      </div>

      <Button>Login</Button>
    </div>
  );
}
```

### Available Icons

The following icons are available in the `icons/` folder:

- **UserIcon** — User profile icon for name/account fields
- **EmailIcon** — Email envelope icon for email input fields
- **PhoneIcon** — Phone icon for phone number fields
- **LockIcon** — Lock icon for password fields
- **EyeOffIcon** — Eye with slash icon for password visibility toggle
- **ArrowLeftIcon** — Left arrow icon for navigation/back links
- **ChevronDownIcon** — Chevron down icon for dropdowns and menus
- **ErrorIcon** — Error icon for form error display
- **LanguageIcon** — Language globe icon for language selection

### Icon Props Pattern

Current icons are simple components without props. To extend icons with customization in the future:

```tsx
interface IconProps {
  className?: string; // Tailwind classes for styling (e.g., 'text-red-500')
  size?: number; // Optional: SVG width/height (default: 20)
  strokeWidth?: number; // Optional: for outline icons
  'aria-hidden'?: boolean; // Accessibility (default: true)
}
```

### Icons vs Assets/Images

| Use Case                    | Location            | Implementation                |
| --------------------------- | ------------------- | ----------------------------- |
| UI Icons (email, lock, eye) | `components/icons/` | Inline SVG components         |
| Logos, backgrounds          | `assets/images/`    | Static imports with `<Image>` |
| Favicons, metadata          | `public/`           | Direct URL reference          |

### Exporting Icons

All icons are exported from the icons barrel file and re-exported in the main components barrel export:

```tsx
// components/icons/index.ts
export { UserIcon } from './UserIcon';
export { EmailIcon } from './EmailIcon';
export { PhoneIcon } from './PhoneIcon';
export { LockIcon } from './LockIcon';
export { EyeOffIcon } from './EyeOffIcon';
export { ArrowLeftIcon } from './ArrowLeftIcon';
export { ChevronDownIcon } from './ChevronDownIcon';
export { ErrorIcon } from './ErrorIcon';
export { LanguageIcon } from './LanguageIcon';

// components/index.ts
export * from './icons';
export { LanguageSwitcher } from './LanguageSwitcher/LanguageSwitcher';
export * from './ui/button';
// ... other components
```

**Usage:**

```tsx
import { EmailIcon, LockIcon, EyeOffIcon, Button } from '@/components';
```

## UI Library

This project uses **shadcn/ui** components as the primary UI library, built with Tailwind CSS and Radix UI primitives.

## Available Components

### Icon Components

- **UserIcon** — User profile icon for name/account fields
- **EmailIcon** — Email envelope icon for email input fields
- **PhoneIcon** — Phone icon for phone number fields
- **LockIcon** — Lock icon for password fields
- **EyeOffIcon** — Eye with slash icon for password visibility toggle
- **ArrowLeftIcon** — Left arrow icon for navigation/back links
- **ChevronDownIcon** — Chevron down icon for dropdowns and menus
- **ErrorIcon** — Error icon for form error display
- **LanguageIcon** — Language globe icon for language selection

### Custom Components

- **LanguageSwitcher** — Component for switching between languages in the application (see LanguageSwitcher/LanguageSwitcher.tsx)

### shadcn/ui Components

- **button** — Button component for actions and interactions
- **card** — Card component for content containers
- **field** — Field component for form layout (includes custom Error icon for error display)
- **input** — Input component for text input fields
- **input-otp** — OTP input component for multi-digit codes
- **label** — Label component for form labels
- **separator** — Separator component for visual dividers
- **dropdown-menu** — Dropdown menu component for actions and navigation

---

## Adding a New Component

1. Create a new folder with the component name: `{ComponentName}/`
2. Add your main component file: `{ComponentName}/{ComponentName}.tsx`
3. Add any related files (tests, styles, etc.) inside the same folder
4. Export the component from the root `src/components/index.ts`

Example:

```tsx
// src/components/Button/Button.tsx
export const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

// src/components/Button/Button.test.tsx (optional)
// Tests for Button component

// src/components/index.ts
export { Button } from './Button/Button';
```
