# Authentication — Section 508 / WCAG 2.2 Accessibility

## Overview

Documents all Section 508 and WCAG 2.2 Level AA accessibility patterns applied to the Pop Logic
authentication screens: the **Login** form (step 1 — email entry) and the **Verification** form
(step 2 — one-time password entry). Both screens share a common `(auth)/layout.tsx` wrapper.

## Status

Implemented

## Architecture Diagram

```
(auth)/layout.tsx
├── Skip-to-content link          ← WCAG 2.4.1
├── <main id="main-content">      ← WCAG 2.4.1 / 1.3.1
│   ├── login/page.tsx            ← metadata export (WCAG 2.4.2)
│   │   ├── LoginForm.tsx         ← email form, live-region, autoComplete
│   │   └── VerificationForm.tsx  ← OTP form, live regions, label association
```

---

## Audit Results

- **Date:** 2026-02-27
- **Compliance Target:** WCAG 2.2 Level AA / Section 508
- **Grade:** AA Compliant (post-fix)
- **Issues Found:** 11
- **Issues Resolved:** 11

### Issues Fixed

| #   | Severity | WCAG SC | Issue                                                                                    | File Fixed             |
| --- | -------- | ------- | ---------------------------------------------------------------------------------------- | ---------------------- |
| 1   | Critical | 2.4.1   | No "Skip to main content" link                                                           | `(auth)/layout.tsx`    |
| 2   | Critical | 4.1.2   | `<Label>` not associated with OTP `<InputOTP>`                                           | `VerificationForm.tsx` |
| 3   | Major    | 2.4.2   | Login page had no unique `<title>` / `metadata` export                                   | `(auth)/layout.tsx`    |
| 4   | Major    | 3.1.1   | `<html lang>` hardcoded `'en'`, ignoring user-selected locale                            | `app/layout.tsx`       |
| 5   | Major    | 1.4.3   | Copyright text `#9ca3af` on white failed 4.5:1 contrast minimum                          | `(auth)/layout.tsx`    |
| 6   | Major    | 4.1.3   | OTP error/success messages not in live regions                                           | `VerificationForm.tsx` |
| 7   | Major    | 1.3.5   | `autoComplete="email"` missing on email input                                            | `LoginForm.tsx`        |
| 8   | Minor    | 1.1.1   | Decorative `EmailIcon` in input had no `aria-hidden`                                     | `LoginForm.tsx`        |
| 9   | Minor    | 1.1.1   | Decorative icons (EmailIcon, ErrorIcon, ArrowLeftIcon, success SVG) had no `aria-hidden` | `VerificationForm.tsx` |
| 10  | Minor    | 4.1.2   | Root/network `FieldError` had no `id`, unreachable via `aria-describedby`                | `LoginForm.tsx`        |
| 11  | Minor    | 4.1.3   | Submit loading state ("Sending…") not announced to screen readers                        | `LoginForm.tsx`        |

---

## Key Concepts

| Concept            | Description                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Skip link          | Visually hidden anchor that becomes visible on keyboard focus; lets keyboard/AT users bypass repeated navigation |
| `aria-live` region | DOM area whose text changes are automatically announced by screen readers without focus movement                 |
| `role="alert"`     | Implicit `aria-live="assertive"` — announces error messages immediately                                          |
| `role="status"`    | Implicit `aria-live="polite"` — announces success messages when idle                                             |
| `aria-describedby` | Associates an input with descriptive text (error messages) by element `id`                                       |
| `aria-invalid`     | Signals to assistive technology that a field value is invalid                                                    |
| `autoComplete`     | Maps browser/AT autocomplete to semantic field purpose (WCAG 1.3.5)                                              |
| `aria-hidden`      | Removes purely decorative elements from the accessibility tree                                                   |

---

## Implementation Details

### 1 — Skip to Main Content Link (WCAG 2.4.1)

Added as the very first child of `<main>` in `(auth)/layout.tsx`. It is visually hidden via
`sr-only` but becomes visible when it receives keyboard focus (`focus:not-sr-only`). It targets
`#auth-card`, the containing card element, allowing keyboard users to bypass the decorative
logo/heading column and jump straight to the form.

```
<a href="#auth-card" className="sr-only focus:not-sr-only ...">
  {t('skipToContent')}   ← translated (en/es/fr)
</a>
```

The translation key `auth.layout.skipToContent` was added to all three locale files
(`public/locales/{en,es,fr}/translation.json`).

### 2 — Page Title (WCAG 2.4.2)

`export const metadata` added to `(auth)/layout.tsx` because `login/page.tsx` is a Client
Component and cannot export metadata itself.

```
title: 'Sign In — POP Logic'
description: 'Sign in to your POP Logic account to manage promotional campaigns.'
```

### 3 — Dynamic `lang` Attribute (WCAG 3.1.1)

The root `app/layout.tsx` computed `userLocale` from the locale cookie but was hardcoding
`lang="en"`. Changed to `lang={userLocale}` so the HTML language declaration always matches
the user's active locale, enabling correct screen-reader pronunciation.

### 4 — Copyright Contrast (WCAG 1.4.3)

`(auth)/layout.tsx` copyright paragraph colour changed from `#9ca3af` (~2.9:1 on white — **fail**)
to `#6b7280` (~5.9:1 on white — **pass**). The `#6b7280` tone is consistent with the body text
palette already used elsewhere in the auth screens.

### 5 — Login Form — Email Input (WCAG 1.3.5, 1.1.1, 4.1.2, 4.1.3)

| Change                                                                       | WCAG SC | Detail                                                                     |
| ---------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `autoComplete="email"` on `<Input>`                                          | 1.3.5   | Enables browser/AT autofill with correct purpose                           |
| `aria-hidden="true"` on icon wrapper `<div>`                                 | 1.1.1   | Removes decorative envelope icon from a11y tree                            |
| `id="email-root-error"` on network `FieldError`                              | 4.1.2   | Allows `aria-describedby` to reference it when a root/network error occurs |
| `aria-describedby` now switches between `email-error` and `email-root-error` | 4.1.2   | Programmatically associates the correct error message                      |
| `aria-live="polite"` sr-only `<div>` that reads `t('sendingCode')`           | 4.1.3   | Announces loading state to screen readers when form submits                |

The `sendingCode` translation key was added to the `auth.layout.loginForm` namespace in all
three locale files.

### 6 — Verification Form — OTP Input (WCAG 1.3.1, 4.1.2, 4.1.3, 1.1.1)

| Change                                                       | WCAG SC       | Detail                                                                                               |
| ------------------------------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------- |
| `<Label htmlFor="otp-input">`                                | 1.3.1 / 4.1.2 | Programmatically associates the visible label with the OTP input                                     |
| `id="otp-input"` on `<InputOTP>`                             | 4.1.2         | Provides the link target for `htmlFor`                                                               |
| `aria-label={t('verificationCodeLabel')}` on `<InputOTP>`    | 4.1.2         | Direct accessible name on the underlying `<input>` for AT that ignores `htmlFor` on compound widgets |
| `aria-describedby="otp-error"` on `<InputOTP>`               | 4.1.2         | Associates error text with the composite OTP widget                                                  |
| `id="otp-error"` on error `<p>`                              | 4.1.2         | Resolves the `aria-describedby` reference target                                                     |
| `role="alert"` on error message container                    | 4.1.3         | Announces OTP error immediately (assertive)                                                          |
| `role="status"` on success/resend message container          | 4.1.3         | Announces resend-code success politely                                                               |
| `aria-hidden="true"` on EmailIcon wrapper in info box        | 1.1.1         | Decorative icon excluded from a11y tree                                                              |
| `aria-hidden="true"` on ErrorIcon wrapper                    | 1.1.1         | Error conveyed by adjacent text — icon is redundant                                                  |
| `aria-hidden="true"` on success SVG wrapper                  | 1.1.1         | Success conveyed by adjacent text — icon is redundant                                                |
| `aria-hidden="true"` on ArrowLeftIcon wrapper in back button | 1.1.1         | Button text "Back to Login" is sufficient — icon is decorative                                       |
| `aria-label={t('title')}` on verification `<form>`           | 1.3.1         | Gives the form landmark an accessible name for AT users                                              |

---

## Implemented Patterns Summary

| Pattern                                               | WCAG SC       | Location                                   |
| ----------------------------------------------------- | ------------- | ------------------------------------------ |
| Skip navigation link                                  | 2.4.1         | `(auth)/layout.tsx`                        |
| Unique descriptive page title                         | 2.4.2         | `(auth)/layout.tsx` (metadata)             |
| Dynamic HTML `lang` attribute                         | 3.1.1         | `app/layout.tsx`                           |
| Sufficient text contrast (≥ 4.5:1)                    | 1.4.3         | `(auth)/layout.tsx` copyright              |
| Input autocomplete purpose                            | 1.3.5         | `LoginForm.tsx` email field                |
| `aria-invalid` + `aria-describedby` on error fields   | 4.1.2         | `LoginForm.tsx`, `VerificationForm.tsx`    |
| `role="alert"` for error status messages              | 4.1.3         | `VerificationForm.tsx`                     |
| `role="status"` for success/informational messages    | 4.1.3         | `VerificationForm.tsx`                     |
| `aria-live="polite"` loading announcement             | 4.1.3         | `LoginForm.tsx`                            |
| Programmatic label association (`htmlFor`)            | 1.3.1 / 4.1.2 | `VerificationForm.tsx` OTP                 |
| `aria-hidden` on all decorative icon wrappers         | 1.1.1         | `LoginForm.tsx`, `VerificationForm.tsx`    |
| Logical heading hierarchy (`h1` → `h2`)               | 1.3.1         | `(auth)/layout.tsx` → form headers         |
| Semantic landmark (`<main>`)                          | 1.3.1         | `(auth)/layout.tsx`                        |
| Keyboard accessibility via shadcn/ui primitives       | 2.1.1         | All interactive elements                   |
| Visible focus indicators (Tailwind `focus-visible:*`) | 2.4.7         | Skip link, all shadcn/ui controls          |
| Target size ≥ 44 px on primary buttons                | 2.5.8         | `h-[44px] sm:h-[48px]` on all form buttons |

---

## Screen Reader Testing Notes

- **VoiceOver (macOS/iOS):** The OTP compound widget (`InputOTP`) is built on `input-otp` which
  renders a single hidden `<input>`. The `aria-label` on `InputOTP` provides a direct accessible
  name that VoiceOver announces. Individual slot `div`s are presentational and not separately
  navigated.
- **NVDA / JAWS:** The `role="alert"` container for OTP errors fires assertive announcements;
  tested to ensure it doesn't re-announce on re-renders where the error text is unchanged.
- **Toasts (Sonner):** Login-redirect reason toasts and success toasts are rendered by Sonner in
  an `aria-live` region managed by the library; this is outside the scope of this document.

## Known Limitations

- **OTP slot-level ARIA:** Individual `InputOTPSlot` `<div>` elements retain `aria-describedby`
  pointing to `otp-error` for assistive technologies that walk through them individually, but the
  primary AT entry point is the parent `InputOTP` hidden `<input>`.
- **Sonner toast contrast:** The Sonner toast component uses its own theme. Toast colour contrast
  has not been audited here and may require a separate review.
- **Resend countdown announcement:** The resend button label updates with the remaining seconds
  `(${resendCooldown}s)`, producing a live button-text update. This is not announced to AT until
  the button receives focus; a dedicated `aria-live` countdown is intentionally omitted to avoid
  spamming screen reader output every second.

---

## Related Documentation

- [Authentication Overview](./auth.overview.md)
- [Login Architecture](./login.architecture.md)
- [Token Refresh Architecture](./token-refresh.architecture.md)
- [Auth Layout](<../../../src/app/(auth)/layout.tsx>)
- [LoginForm](<../../../src/app/(auth)/login/(components)/loginForm/LoginForm.tsx>)
- [VerificationForm](<../../../src/app/(auth)/login/(components)/verificationForm/VerificationForm.tsx>)

---

Last Update:- 06/04/2026
Agent name:- doc-updater
Author:- Vishav Ranta
