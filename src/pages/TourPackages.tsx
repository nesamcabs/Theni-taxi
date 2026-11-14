import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { faqSchema } from '@/seo/site';
import { ContentHero } from '@/components/ContentHero';
import { FaqAccordion } from '@/components/FaqAccordion';
import { CatalogSection } from '@/shared/components/PublicContentSections';
import { SITE } from '@/seo/site';
import { telHref, whatsappHref } from '@/lib/contact';
import { SUPPORT_PHONE_DISPLAY } from '@core/config/constants';

const PACKAGES = [
  { title: 'Kodaikanal Day Trip', text: 'Lake, Coakers Walk, Pillar Rocks & Bryant Park — out and back the same day.' },
  { title: 'Munnar & Thekkady, 2 Days', text: 'Tea estates and Top Station on day one, Periyar safari on day two.' },
  { title: 'Madurai Temple Tour', text: 'Meenakshi Amman Temple and the old city, with driver-guided stops.' },
  { title: 'Rameswaram Pilgrimage', text: 'Ramanathaswamy Temple, Pamban Bridge and Dhanushkodi, overnight stay.' },
];

const FAQS = [
  { q: 'Can you customise a tour package?', a: 'Yes — call or WhatsApp us with your preferred stops and days, and we’ll quote a tailored package.' },
  { q: 'Does the package price include the driver’s stay?', a: 'For multi-day tours, driver accommodation and daily allowance are included in the quoted package price.' },
  { q: 'Can I book a package online?', a: 'Tour packages are confirmed by phone or WhatsApp so we can tailor the itinerary; browse packages below and enquire for a quote.' },
];

export function TourPackagesPage() {
  useSeo({
    title: 'Tour Packages from Theni',
    description: 'Temple tours, hill-station getaways and multi-day sightseeing packages from Theni — Kodaikanal, Munnar, Thekkady, Madurai and Rameswaram.',
    keywords: 'theni tour package, theni to kodaikanal package, theni to munnar tour, theni temple tour taxi',
    canonical: '/tour-packages',
    schema: faqSchema(FAQS),
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Tour Packages', path: '/tour-packages' }],
  });

  return (
    <div>
      <ContentHero eyebrow="Multi-day & sightseeing" title="Tour Packages from Theni" breadcrumb="Tour Packages"
        intro="Temple circuits, hill-station getaways and pilgrimage tours — planned with local drivers who know the stops worth the stop.">
        <div className="content-cta">
          <a className="btn btn--on-dark btn--lg" href={telHref()}>Call {SUPPORT_PHONE_DISPLAY}</a>
          <a className="btn btn--teal btn--lg" href={whatsappHref('I would like a tour package quote.')} target="_blank" rel="noopener noreferrer">WhatsApp for a quote</a>
        </div>
      </ContentHero>

      <section className="band">
        <div className="wrap">
          <header className="sec-head"><h2>Popular packages</h2></header>
          <div className="grid grid--2">
            {PACKAGES.map((p) => (
              <div key={p.title} className="service-card">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--surface">
        <CatalogSection brand={SITE.name} />
      </section>

      <section className="band">
        <div className="wrap">
          <header className="sec-head"><h2>Tour package FAQs</h2></header>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <section className="band">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <Link to="/book" className="btn btn--secondary btn--lg">Or book a single trip instead &rarr;</Link>
        </div>
      </section>
    </div>
  );
}
