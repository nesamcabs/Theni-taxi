import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { faqSchema } from '@/seo/site';
import { ContentHero } from '@/components/ContentHero';
import { FaqAccordion } from '@/components/FaqAccordion';

const AIRPORTS = [
  { name: 'Madurai Airport (IXM)', distance: '~80 km, 2 hrs', slug: 'madurai-airport' },
  { name: 'Coimbatore Airport (CJB)', distance: '~140 km, 3 hrs', slug: 'coimbatore' },
  { name: 'Tiruchirappalli Airport (TRZ)', distance: '~140 km, 3 hrs', slug: 'trichy' },
];

const FAQS = [
  { q: 'Do you track my flight for airport pickup?', a: 'Yes — share your flight number when booking and we track the actual landing time, adjusting your pickup for reasonable delays at no extra cost.' },
  { q: 'How early should I book an airport drop from Theni?', a: 'Book at least a few hours ahead where possible; for Madurai Airport we recommend leaving 3 hours before departure.' },
  { q: 'Can I book a one-way airport drop only?', a: 'Yes — Airport Taxi bookings are one-way by default; book a separate return trip whenever you land back.' },
  { q: 'Is there a waiting charge at arrivals?', a: 'A reasonable wait at arrivals is included; our driver will have your name ready and meet you at the terminal.' },
];

export function AirportTaxiPage() {
  useSeo({
    title: 'Airport Taxi from Theni',
    description: 'Flight-timed airport taxi from Theni to Madurai, Coimbatore and Trichy airports. Flight tracking, meet & greet, upfront fares.',
    keywords: 'theni airport taxi, theni to madurai airport taxi, theni to coimbatore airport, theni to trichy airport taxi',
    canonical: '/airport-taxi',
    schema: faqSchema(FAQS),
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Airport Taxi', path: '/airport-taxi' }],
  });

  return (
    <div>
      <ContentHero eyebrow="Flight-timed pickups" title="Airport Taxi from Theni" breadcrumb="Airport Taxi"
        intro="Reliable transfers to Madurai, Coimbatore and Tiruchirappalli airports, timed to your actual flight — not a fixed clock time.">
        <div className="content-cta">
          <Link to="/book" className="btn btn--primary btn--lg">Book airport taxi</Link>
        </div>
      </ContentHero>

      <section className="band">
        <div className="wrap">
          <header className="sec-head"><h2>Airports we serve from Theni</h2></header>
          <div className="grid grid--3">
            {AIRPORTS.map((a) => (
              <Link key={a.slug} to={`/theni-to/${a.slug}`} className="service-card">
                <h3>{a.name}</h3>
                <p>{a.distance}</p>
                <span className="service-card__link">See fare &amp; details &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--surface">
        <div className="wrap feature-row">
          <div>
            <h2>Why riders trust us for flight connections</h2>
          </div>
          <div className="feature-list">
            <div className="feature-list__item"><span className="feature-list__icon">&#9992;</span><div><h4>Flight tracking</h4><p>We watch your flight and adjust the pickup time automatically.</p></div></div>
            <div className="feature-list__item"><span className="feature-list__icon">&#128197;</span><div><h4>Advance scheduling</h4><p>Book up to 30 days ahead so your transfer is never a last-minute scramble.</p></div></div>
            <div className="feature-list__item"><span className="feature-list__icon">&#128100;</span><div><h4>Meet &amp; greet</h4><p>Your driver waits at arrivals with your name, ready to load your luggage.</p></div></div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <header className="sec-head"><h2>Airport taxi FAQs</h2></header>
          <FaqAccordion items={FAQS} />
        </div>
      </section>
    </div>
  );
}
