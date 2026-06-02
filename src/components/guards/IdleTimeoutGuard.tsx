'use client';

import { LoginRedirectReason } from '@/constant';
import { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

const DEFAULT_IDLE_TIMEOUT_MINUTES = 120;
const MS_PER_MINUTE = 60_000;
const LAST_ACTIVE_KEY = 'pop_last_active_at';

const idleTimeoutMs =
  (Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES) || DEFAULT_IDLE_TIMEOUT_MINUTES) *
  MS_PER_MINUTE;

function triggerIdleLogout(): void {
  localStorage.removeItem(LAST_ACTIVE_KEY);
  window.location.href = `/logout?reason=${LoginRedirectReason.IDLE_TIMEOUT}`;
}

/**
 * Client-side idle timeout guard for protected routes.
 *
 * Monitors user activity (mouse, keyboard, touch, scroll, etc.) and
 * automatically logs the user out after a configurable period of inactivity.
 *
 * **Two complementary mechanisms:**
 *
 * 1. **`react-idle-timer`** — Fires `onIdle` when the user is inactive while
 *    the tab is open. Cross-tab support ensures activity in any tab resets the
 *    timer across all tabs.
 *
 * 2. **`localStorage` timestamp** — On every activity event the current
 *    timestamp is persisted to `localStorage`. On component mount (i.e. when
 *    the user reopens a closed tab), the elapsed time since the last activity
 *    is checked. If it exceeds the timeout, the user is logged out immediately.
 *    This covers the scenario where all tabs were closed and the user returns
 *    after the idle period.
 *
 * Timeout is configured via `NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES` env variable
 * (defaults to 120 minutes / 2 hours).
 *
 * Logout is handled by navigating to `/logout?reason=idle_timeout`, which
 * triggers the existing proxy middleware to call the backend Logout mutation,
 * clear all cookies, and redirect to the login page with a reason toast.
 */
export function IdleTimeoutGuard() {
  // On mount: check if the user was inactive while all tabs were closed.
  useEffect(() => {
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);

    if (lastActive) {
      const elapsed = Date.now() - Number(lastActive);

      if (elapsed >= idleTimeoutMs) {
        triggerIdleLogout();
        return;
      }
    }

    // Seed the timestamp if this is the first visit (e.g. fresh login).
    localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
  }, []);

  useIdleTimer({
    timeout: idleTimeoutMs,
    crossTab: true,
    onIdle: triggerIdleLogout,
    onAction: () => {
      localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
    },
  });

  return null;
}
