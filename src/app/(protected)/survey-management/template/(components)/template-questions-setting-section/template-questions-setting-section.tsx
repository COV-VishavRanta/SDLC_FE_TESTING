import { QuestionSettings } from '@/components';
import { useTranslations } from 'next-intl';

export default function TemplateQuestionsSettingSection() {
  const t = useTranslations('surveyManagement.template.common-template.settings');

  return (
    <div className='flex flex-col gap-5 xl:sticky xl:top-6 xl:w-[404px] xl:self-start'>
      <h2 className='text-[16px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
        {t('sectionTitle')}
      </h2>
      <div className='max-h-[calc(100vh-80px)] overflow-y-auto rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
        <QuestionSettings />
      </div>
    </div>
  );
}
