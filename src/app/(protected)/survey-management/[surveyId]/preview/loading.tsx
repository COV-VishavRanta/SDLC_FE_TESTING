import { PageRoot, Skeleton } from '@/components';
import { SurveyPreviewLoading as SurveyPreviewContentLoading } from '@/components/survey-creator/survey-preview/survey-preview.loading';

export default function SurveyPreviewLoading() {
  return (
    <PageRoot>
      {/* Back Link Skeleton */}
      <Skeleton className='h-[21px] w-36 rounded' />

      {/* Header Skeleton */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-[42px] w-56 rounded-lg' />
        </div>
        <Skeleton className='h-12 w-36 rounded-lg' />
      </div>

      {/* Survey Preview Content Skeleton */}
      <SurveyPreviewContentLoading />
    </PageRoot>
  );
}
