import { useEffect } from 'react';
import { resolveSeo, siteSchema, type SeoProps } from '@/seo/site';

export type { SeoProps, BreadcrumbItem } from '@/seo/site';

function setMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === undefined) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: object | null) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** Keeps title, description, robots, canonical, share tags and page schema in step with the screen. */
export function updateSeo(props: SeoProps): void {
  const s = resolveSeo(props);
  document.title = s.title;
  setMeta('name', 'description', s.description);
  setMeta('name', 'keywords', s.keywords);
  setMeta('name', 'robots', s.robots);
  setCanonical(s.canonical);
  setMeta('property', 'og:url', s.canonical ?? undefined);
  setMeta('property', 'og:title', s.title);
  setMeta('property', 'og:description', s.description);
  setMeta('property', 'og:image', s.image);
  setMeta('property', 'og:image:alt', s.imageAlt);
  setMeta('name', 'twitter:title', s.title);
  setMeta('name', 'twitter:description', s.description);
  setMeta('name', 'twitter:image', s.image);
  setMeta('name', 'twitter:image:alt', s.imageAlt);
  setJsonLd('page-schema', s.schema);
}

/** `null` leaves the page's tags alone. */
export function useSeo(props: SeoProps | null): void {
  const key = JSON.stringify(props);
  useEffect(() => {
    if (props) updateSeo(props);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

/** The business/website JSON-LD, asserted once for the whole session. */
export function useSiteSchema(): void {
  useEffect(() => {
    setJsonLd('site-schema', siteSchema());
  }, []);
}
