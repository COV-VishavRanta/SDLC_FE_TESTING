'use client';

import { AlertRow } from '@/components/ui/alert';
import { AlertType } from '@/constant';

interface SectionErrorFallbackProps {
  title: string;
  description: string;
}

/**
 * Inline error alert shown when a dashboard section fails to load.
 * Figma: node-id 4852-39246
 */
export function SectionErrorFallback({ title, description }: SectionErrorFallbackProps) {
  return <AlertRow type={AlertType.ERROR} title={title} description={description} />;
}
