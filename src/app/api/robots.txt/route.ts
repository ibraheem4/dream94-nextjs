// src/app/api/robots.txt/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://94dream.com/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
