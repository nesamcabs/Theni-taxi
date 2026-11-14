import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { faqSchema } from '@/seo/site';
import { ContentHero } from '@/components/ContentHero';
import { FaqAccordion } from '@/components/FaqAccordion';

const FAQS = [
  { q: 'What counts as a local taxi trip in Theni?', a: 'Any pickup and drop within about 40 km of each other — anywhere inside Theni, Bodinayakanur, Cumbum, Periyakulam, Kambam and Chinnamanur, or between them.' },
  { q: 'Can I book a taxi for a few hours, not just point-to-point?', a: 'Yes — choose Hourly Rental when booking for a package of 4, 8 or 12 hours with an included kilometre allowance, ideal for shopping, hospital visits or running errands across town.' },
  { q: 'How quickly can a local taxi reach me in Theni?', a: 'Most local pickups are arranged within 15–30 minutes, depending on driver availability near your location.' },
  { q: 'Do local taxi fares include waiting time?', a: 'A short wait at pickup is included; extended waiting is billed per the category’s waiting rate, shown upfront in your fare breakdown before you confirm.' },
];

export function LocalTaxiPage() {
  useSeo({
    title: 'Local Taxi in Theni',
    description: 'Book a local taxi in Theni for point-to-point rides or hourly rentals across Theni, Bodinayakanur, Cumbum and Periyakulam. Upfront fares, 24/7.',
    keywords: 'theni local taxi, taxi in theni, theni cab booking, hourly taxi theni, bodinayakanur taxi, cumbum taxi, periyakulam taxi',
    canonical: '/local-taxi',
    schema: faqSchema(FAQS),
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Local Taxi', path: '/local-taxi' }],
  });

  return (
    <div>
      <ContentHero eyebrow="Within Theni district" title="Local Taxi in Theni" breadcrumb="Local Taxi"
        intro="Point-to-point rides and hourly rentals across Theni, Bodinayakanur, Cumbum, Periyakulam, Kambam and Chinnamanur — booked in minutes, priced upfront.">
        <div className="content-cta">
          <Link to="/book" className="btn btn--primary btn--lg">Book a local ride</Link>
        </div>
      </ContentHero>

      <section className="band">
        <div className="wrap feature-row">
          <div>
            <h2>Built for getting around town</h2>
            <p className="muted" style={{ marginTop: 10 }}>
              Whether it&rsquo;s a quick trip to the bus stand, a hospital visit, or a half-day of errands across Theni and the
              surrounding towns, our local taxi service is sized to match. Choose a one-off point-to-point ride, or an hourly
              package when the driver needs to wait between stops.
            </p>
          </div>
          <div className="feature-list">
            <div className="feature-list__item">
              <span className="feature-list__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div><h4>Quick pickup</h4><p>Most local rides are arranged within 15–30 minutes.</p></div>
            </div>
            <div className="feature-list__item">
              <span className="feature-list__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M5 12h14" strokeLinecap="round" /></svg>
              </span>
              <div><h4>Upfront pricing</h4><p>See the exact fare — base fare, distance and GST — before you confirm.</p></div>
            </div>
            <div className="feature-list__item">
              <span className="feature-list__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div><h4>Hourly packages</h4><p>4, 8 or 12-hour rental packages when the driver needs to wait for you.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="band band--surface">
        <div className="wrap">
          <header className="sec-head">
            <h2>Towns we cover locally</h2>
          </header>
          <p className="muted">Theni &middot; Bodinayakanur &middot; Cumbum &middot; Periyakulam &middot; Kambam &middot; Chinnamanur &middot; Uthamapalayam &middot; Andipatti</p>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <header className="sec-head"><h2>Local taxi FAQs</h2></header>
          <FaqAccordion items={FAQS} />
        </div>
      </section>
    </div>
  );
}
