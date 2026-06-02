import { ArrowLeftIcon, PageRoot, Skeleton } from '@/components';
import QuestionBuilderLoading from '@/components/survey-creator/question-builder/question-builder.loading';
import QuestionSettingLoading from '@/components/survey-creator/question-setting/question-setting.loading';

export default function EditTemplateLoading() {
  return (
    <PageRoot>
      {/* Back Link Skeleton */}
      <div className='flex w-fit items-center gap-2.5 py-[3px]'>
        <ArrowLeftIcon className='size-4 text-[var(--primary-400)]' aria-hidden='true' />
        <Skeleton className='h-5 w-32' />
      </div>

      {/* Header Skeleton */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-12 w-32 rounded-lg' />
      </div>

      {/* Body Skeleton */}
      <div className='flex flex-col gap-12'>
        <div className='flex flex-col gap-5 xl:flex-row xl:items-start'>
          {/* Main Column */}
          <div className='flex min-w-0 flex-1 flex-col gap-5'>
            {/* TemplateDetails Skeleton */}
            <div className='flex flex-col gap-5'>
              <Skeleton className='h-5 w-32' />
              <div className='flex flex-col gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
                <div className='flex flex-col gap-2'>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='h-[var(--input-height,48px)] w-full rounded-[var(--input-radius,8px)]' />
                </div>
              </div>
            </div>

            {/* QuestionBuilder Skeleton */}
            <div className='rounded-xl border border-[var(--neutral-300)] bg-white'>
              <QuestionBuilderLoading />
            </div>
          </div>

          {/* Settings Section Skeleton */}
          <div className='flex flex-col gap-5 xl:sticky xl:top-6 xl:w-[404px] xl:self-start'>
            <Skeleton className='h-5 w-32' />
            <div className='max-h-[calc(100vh-80px)] overflow-y-auto rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
              <QuestionSettingLoading />
            </div>
          </div>
        </div>
      </div>
    </PageRoot>
  );
}
