// src/app/sitemap.xml/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const domain = 'https://94dream.com';

function parseSettings() {
  const settingsPath = path.join(
    process.cwd(),
    'src',
    'app',
    'i18n',
    'settings.ts',
  );
  const settingsContent = fs.readFileSync(settingsPath, 'utf8');

  const languagesMatch = settingsContent.match(
    /export const languages\s*=\s*(\[.*?\])/s,
  );
  const fallbackLngMatch = settingsContent.match(
    /export const fallbackLng\s*=\s*['"](.+?)['"]/,
  );

  if (!languagesMatch || !fallbackLngMatch) {
    throw new Error('Unable to parse language settings');
  }

  const languagesStr = languagesMatch[1];
  const languages = languagesStr
    .replace(/[[\]]/g, '')
    .split(',')
    .map((lang) => lang.trim().replace(/['"]/g, ''))
    .filter((lang) => lang !== 'fallbackLng'); // Remove 'fallbackLng' if present

  const fallbackLng = fallbackLngMatch[1];

  return { languages, fallbackLng };
}

function getAllRoutes(): string[] {
  const appDirectory = path.join(process.cwd(), 'src', 'app', '[lng]');
  const routes: string[] = [];

  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        if (item !== 'components' && !item.startsWith('_')) {
          const route = fullPath.replace(appDirectory, '').replace(/\\/g, '/');
          if (route) routes.push(route);
        }
        if (item !== 'components') {
          // Don't scan inside 'components' directory
          scanDirectory(fullPath);
        }
      }
    });
  }

  scanDirectory(appDirectory);
  return routes;
}

function generateSitemap(
  languages: string[],
  fallbackLng: string,
  routes: string[],
): string {
  const entries: string[] = [];

  entries.push(`
  <url>
    <loc>${domain}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`);

  languages.forEach((lang) => {
    if (lang !== fallbackLng) {
      entries.push(`
  <url>
    <loc>${domain}/${lang}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`);
    }
  });

  routes.forEach((route) => {
    entries.push(`
  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`);

    languages.forEach((lang) => {
      if (lang !== fallbackLng) {
        entries.push(`
  <url>
    <loc>${domain}/${lang}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`);
      }
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries.join('')}
</urlset>`;
}

export async function GET() {
  try {
    const { languages, fallbackLng } = parseSettings();
    const routes = getAllRoutes();
    const sitemap = generateSitemap(languages, fallbackLng, routes);

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse(`Error generating sitemap: ${error.message}`, {
      status: 500,
    });
  }
}
