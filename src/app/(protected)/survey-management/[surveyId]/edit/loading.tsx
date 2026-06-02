import { PageRoot, Skeleton } from '@/components';

export default function EditSurveyLoading() {
  return (
    <PageRoot>
      {/* Back Link Skeleton */}
      <Skeleton className='h-[21px] w-36 rounded' />

      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        {/* Title Skeleton */}
        <Skeleton className='h-[42px] w-56 rounded-lg' />

        {/* Actions Skeleton */}
        <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center'>
          <Skeleton className='h-10 w-full rounded-md sm:w-[220px]' />
          <Skeleton className='h-10 w-full rounded-md sm:w-24' />
        </div>
      </div>

      <div className='flex flex-col gap-12'>
        <div className='flex flex-col gap-5 xl:flex-row xl:items-start'>
          {/* Left Column (SurveyDetails + QuestionBuilder) */}
          <div className='flex min-w-0 flex-1 flex-col gap-5'>
            {/* SurveyDetails Form Area Skeleton */}
            <div className='rounded-xl border border-(--neutral-300) bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8'>
              <Skeleton className='mb-4 h-6 w-32 rounded' />
              <div className='flex flex-col gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24 rounded' />
                  <Skeleton className='h-10 w-full rounded-md' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24 rounded' />
                  <Skeleton className='h-24 w-full rounded-md' />
                </div>
              </div>
            </div>

            {/* QuestionBuilder Skeleton */}
            <div className='flex flex-col gap-4 pt-4'>
              <Skeleton className='h-8 w-48 rounded' />
              <Skeleton className='h-32 w-full rounded-xl' />
              <div className='flex justify-center'>
                <Skeleton className='h-10 w-40 rounded-md' />
              </div>
            </div>
          </div>

          {/* Right Column (TemplateQuestionsSettingSection) */}
          <div className='flex flex-col gap-5 xl:w-101'>
            <div className='rounded-xl border border-(--neutral-300) bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8'>
              <Skeleton className='mb-4 h-6 w-32 rounded' />
              <Skeleton className='h-24 w-full rounded-md' />
            </div>
          </div>
        </div>
      </div>
    </PageRoot>
  );
}
