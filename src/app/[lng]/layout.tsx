import './global.css';

import { dir } from 'i18next';
import { languages, fallbackLng } from '../i18n/settings';
import { useTranslation } from '../i18n';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng);
  return {
    title: t('title'),
    content:
      'A playground to explore new Next.js 14 app directory features such as nested layouts, instant loading states, streaming, and component level data fetching.',
  };
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>{children}</body>
    </html>
  );
}
