import { ArrowLeftIcon, PageRoot, Skeleton } from '@/components';
import SurveyPreviewLoading from '@/components/survey-creator/survey-preview/survey-preview.loading';

export default function TemplatePreviewLoading() {
  return (
    <PageRoot>
      <div className='flex w-fit items-center gap-2.5 py-[3px]'>
        <ArrowLeftIcon className='size-4 text-[var(--primary-400)]' aria-hidden='true' />
        <Skeleton className='h-5 w-32' />
      </div>

      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-12 w-32 rounded-lg' />
      </div>

      <div className='mt-8'>
        <SurveyPreviewLoading />
      </div>
    </PageRoot>
  );
}
