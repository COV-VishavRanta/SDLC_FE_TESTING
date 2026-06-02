import loginBg from '@/assets/login-bg.svg';
import logo from '@/assets/logo.svg';
import { LanguageSwitcher } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sign In — POP Logic',
  description: 'Sign in to your POP Logic account to manage promotional campaigns.',
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations('auth.layout');
  return (
    <main id='main-content'>
      {/* Skip to main content – hidden until focused (WCAG 2.4.1) */}
      <a
        href='#auth-card'
        className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#005C8A] focus:shadow-md focus:ring-2 focus:ring-[#005C8A]'
      >
        {t('skipToContent')}
      </a>
      <div className='flex min-h-screen w-full items-center justify-center bg-[#e0f2fe] relative overflow-hidden py-4 sm:py-8 lg:py-16'>
        {/* Background decorative waves */}
        <Image
          src={loginBg}
          alt=''
          className='absolute bottom-0 left-0 w-full h-auto object-cover object-bottom'
        />

        {/* Main content container */}
        <div className='relative z-10 w-full max-w-[1532px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 sm:gap-10 lg:gap-20 xl:gap-24'>
          {/* Left side - Logo and heading */}
          <div className='w-full lg:max-w-[520px] text-center lg:text-left lg:pr-8'>
            {/* Logo */}
            <div className='flex flex-col items-center lg:items-start gap-2 mb-[6px] sm:mb-[10px] lg:mb-[15px]'>
              <Image
                src={logo}
                alt='POPLogic Logo'
                className='w-[180px] h-auto sm:w-[260px] lg:w-[369px] lg:h-[97px] mb-[12px] sm:mb-[24px] lg:mb-[38px]'
              />
              <div className='w-[110px] h-[2px] bg-[#000000] gap-2' />
            </div>

            {/* Heading */}
            <h1 className='text-[20px] sm:text-[24px] font-medium leading-[28px] sm:leading-[32px] text-[#1a1d21] tracking-[-0.3125px] max-w-[auto] mx-auto lg:mx-0'>
              <span className='block'>{t('heading1')}</span>
              <span className='block'>{t('heading2')}</span>
            </h1>
          </div>
          <div className='w-full sm:w-fit flex flex-col gap-4 sm:gap-5 lg:gap-6'>
            {/* Language Switcher */}
            <div className='flex justify-end'>
              <LanguageSwitcher />
            </div>

            {/* Card layout */}
            <div
              id='auth-card'
              className='w-full bg-white rounded-[16px] sm:rounded-[20px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)] p-4 sm:p-10 lg:p-[60px]'
            >
              {children}

              {/* Copyright */}
              <div className='text-center mt-4'>
                <p className='text-[12px] sm:text-[14px] leading-[20px] text-[var(--gray-600)] tracking-[-0.1504px]'>
                  {t('footer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
