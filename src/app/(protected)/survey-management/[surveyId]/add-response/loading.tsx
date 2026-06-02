import { PageRoot } from '@/components';
import { SurveyPreviewLoading as SurveyPreviewContentLoading } from '@/components/survey-creator/survey-preview/survey-preview.loading';

export default function AddResponseLoading() {
  return (
    <PageRoot>
      <div className='h-8 w-24 animate-pulse rounded-md bg-[var(--neutral-300)]' />
      <div className='h-9 w-64 animate-pulse rounded-md bg-[var(--neutral-300)]' />

      {/* Survey Preview Content Skeleton */}
      <SurveyPreviewContentLoading />
    </PageRoot>
  );
}
