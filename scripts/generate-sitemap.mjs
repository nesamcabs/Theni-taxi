// Regenerates public/sitemap.xml. Run after changing the static route list below or
// src/data/routesData.ts (the slugs here must match — there's no shared import since
// this runs in plain Node before the TypeScript build).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE_URL = 'https://www.thenitaxi.in';

const STATIC_PATHS = ['/', '/book', '/local-taxi', '/outstation-taxi', '/airport-taxi', '/tour-packages', '/fare-tariff', '/about', '/contact', '/faq'];

// Keep in sync with the `slug` values in src/data/routesData.ts.
const ROUTE_SLUGS = [
  'madurai',
  'madurai-airport',
  'kodaikanal',
  'munnar',
  'thekkady',
  'coimbatore',
  'dindigul',
  'trichy',
  'rameswaram',
  'kanyakumari',
];

const paths = [...STATIC_PATHS, ...ROUTE_SLUGS.map((s) => `/theni-to/${s}`)];

const today = new Date().toISOString().slice(0, 10);
const urls = paths
  .map((p) => {
    const priority = p === '/' ? '1.0' : p === '/book' ? '0.9' : '0.7';
    return `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const here = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(here, '../public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`Wrote ${paths.length} URLs to ${outPath}`);
