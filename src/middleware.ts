import { NextResponse, NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|vercel.svg|next.svg).*)',
  ],
};

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip paths that should not be localized
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/vercel.svg') ||
    pathname.startsWith('/next.svg') ||
    pathname.includes('.') // e.g., /favicon.ico or /image.png
  ) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = languages.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  let lng: string | undefined | null;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Rewrite if there is no locale
  if (pathnameIsMissingLocale) {
    return NextResponse.rewrite(
      new URL(
        `/${fallbackLng}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        req.url,
      ),
    );
  }

  // Redirect to remove default locale prefix
  if (pathname.startsWith(`/${fallbackLng}`)) {
    return NextResponse.redirect(
      new URL(
        `${pathname.replace(new RegExp(`^/${fallbackLng}`), '')}`,
        req.url,
      ),
    );
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`),
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
