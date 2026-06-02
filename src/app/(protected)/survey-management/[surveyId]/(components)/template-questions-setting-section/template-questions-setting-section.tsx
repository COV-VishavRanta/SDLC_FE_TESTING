import { QuestionSettings } from '@/components';
import { useTranslations } from 'next-intl';

export default function TemplateQuestionsSettingSection() {
  const t = useTranslations('surveyManagement.template.common-template.settings');

  return (
    <div className='flex flex-col gap-5 xl:sticky xl:top-6 xl:w-101 xl:self-start'>
      <h2 className='text-[14px] font-medium leading-5 tracking-[-0.15px] text-(--neutral-900) sm:text-[16px]'>
        {t('sectionTitle')}
      </h2>
      <div className='max-h-[calc(100vh-80px)] overflow-y-auto rounded-xl border border-(--neutral-300) bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8'>
        <QuestionSettings />
      </div>
    </div>
  );
}
