import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { faqSchema } from '@/seo/site';
import { ContentHero } from '@/components/ContentHero';
import { FaqAccordion } from '@/components/FaqAccordion';
import { ROUTES } from '@/data/routesData';

const FAQS = [
  { q: 'What is the difference between one-way and round-trip outstation fares?', a: 'A one-way drop is priced for that single leg only — no charge for the driver’s empty return. A round trip is priced for the full out-and-back journey with one driver for the whole trip.' },
  { q: 'Is there a minimum distance for an outstation booking?', a: 'Trips over about 40 km one way are priced as outstation, which includes a per-km rate plus driver allowance rather than the local fare structure.' },
  { q: 'Can I add stops on a round trip?', a: 'Yes — tell us your planned stops (temples, viewpoints, sightseeing) when booking, or let the driver know en route; waiting time is included in round-trip pricing within reason.' },
  { q: 'Do you charge extra at night?', a: 'A modest night charge applies for pickups between 10 PM and 6 AM, shown in your fare breakdown before you confirm — never added after the trip.' },
];

export function OutstationTaxiPage() {
  useSeo({
    title: 'Outstation Taxi from Theni',
    description: 'One-way drop taxis and round trips from Theni to Madurai, Kodaikanal, Coimbatore, Trichy and beyond. Upfront fares, experienced highway & ghat-road drivers.',
    keywords: 'theni outstation taxi, theni one way taxi, theni round trip cab, theni to madurai taxi, theni to kodaikanal taxi, theni drop taxi',
    canonical: '/outstation-taxi',
    schema: faqSchema(FAQS),
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Outstation Taxi', path: '/outstation-taxi' }],
  });

  return (
    <div>
      <ContentHero eyebrow="Beyond Theni district" title="Outstation Taxi from Theni" breadcrumb="Outstation Taxi"
        intro="One-way drop taxis and round trips to Madurai, Kodaikanal, Munnar, Coimbatore, Trichy, Rameswaram and more — highway and ghat-road drivers who know the way.">
        <div className="content-cta">
          <Link to="/book" className="btn btn--primary btn--lg">Book outstation taxi</Link>
        </div>
      </ContentHero>

      <section className="band">
        <div className="wrap">
          <header className="sec-head">
            <span className="eyebrow">Choose your route</span>
            <h2>Popular outstation routes from Theni</h2>
          </header>
          <div className="route-grid">
            {ROUTES.map((r) => (
              <Link key={r.slug} to={`/theni-to/${r.slug}`} className="route-card">
                <span>Theni &rarr; {r.destination}<small>{r.distanceKm} km &middot; from &#8377;{r.sedanFareFrom}</small></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--surface">
        <div className="wrap feature-row">
          <div>
            <h2>One-way or round trip — your choice</h2>
            <p className="muted" style={{ marginTop: 10 }}>
              Dropping somewhere and flying back, or need the same cab for the whole trip? Pick one-way for a single drop
              with no return charge, or round trip when you want one driver and car for the entire journey, including
              waiting time at your destination.
            </p>
          </div>
          <div className="feature-list">
            <div className="feature-list__item">
              <span className="feature-list__icon">01</span>
              <div><h4>One-way drop</h4><p>Pay only for the distance travelled — no empty-return charge added.</p></div>
            </div>
            <div className="feature-list__item">
              <span className="feature-list__icon">02</span>
              <div><h4>Round trip</h4><p>One car and driver for the whole journey, including stops along the way.</p></div>
            </div>
            <div className="feature-list__item">
              <span className="feature-list__icon">03</span>
              <div><h4>Interstate trips</h4><p>Munnar and Thekkady trips into Kerala are handled, permit included.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <header className="sec-head"><h2>Outstation taxi FAQs</h2></header>
          <FaqAccordion items={FAQS} />
        </div>
      </section>
    </div>
  );
}
