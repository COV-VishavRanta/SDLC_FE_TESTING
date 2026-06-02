import { Toaster } from '@/components';
import { IntlProvider } from '@/i18n';
import { defaultLocale, LOCALE_COOKIE_NAME, locales, type Locale } from '@/i18n/config';
import { ApolloProvider } from '@/lib';
import { ConfigureAmplifyClientSide } from '@/lib/amplify';
import { promises as fs } from 'fs';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import path from 'path';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'POP Logic',
  description: 'Manage multi‑store promotional campaign execution',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read user's preferred locale from cookie
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const userLocale = (
    locales.includes(localeCookie as Locale) ? localeCookie : defaultLocale
  ) as Locale;

  // Load messages for user's preferred locale server-side to prevent flash
  let messages = {};
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', userLocale, 'translation.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    messages = JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to load server-side messages:', error);
  }

  return (
    <html lang={userLocale} className={inter.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConfigureAmplifyClientSide />
        <IntlProvider initialMessages={messages} initialLocale={userLocale}>
          <ApolloProvider>
            <Toaster position='top-right' richColors />
            <NuqsAdapter>{children}</NuqsAdapter>
          </ApolloProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
