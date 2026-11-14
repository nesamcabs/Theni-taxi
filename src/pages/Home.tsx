import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LocationField } from '@/components/LocationField';
import { TripTypeTabs } from '@/components/TripTypeTabs';
import { useSeo, useSiteSchema } from '@/lib/seo';
import { readDraft, writeDraft, defaultScheduledAt, type BookingDraft } from '@/lib/bookingDraft';
import { scheduleProblem } from '@core/utils/bookingRules';
import { ROUTES } from '@/data/routesData';
import { SITE } from '@/seo/site';
import { ReviewsSection, CatalogSection } from '@/shared/components/PublicContentSections';
import { telHref, whatsappHref } from '@/lib/contact';
import { SUPPORT_PHONE_DISPLAY } from '@core/config/constants';

const SERVICES = [
  { to: '/local-taxi', title: 'Local Taxi', text: 'Hourly and point-to-point rides within Theni, Bodi, Cumbum and Periyakulam.', icon: 'local' },
  { to: '/outstation-taxi', title: 'Outstation Taxi', text: 'One-way drops and round trips to Madurai, Kodaikanal, Coimbatore and beyond.', icon: 'outstation' },
  { to: '/airport-taxi', title: 'Airport Taxi', text: 'Flight-timed pickups and drops to Madurai, Coimbatore and Trichy airports.', icon: 'airport' },
  { to: '/tour-packages', title: 'Tour Packages', text: 'Temple tours, hill-station getaways and multi-day sightseeing packages.', icon: 'tour' },
];

const STEPS = [
  { title: 'Tell us your trip', text: 'Pickup, drop, date and time — local, outstation, airport or rental.' },
  { title: 'See the upfront fare', text: 'Pick a cab and see the exact price before you confirm. No surprises.' },
  { title: 'Verify by OTP', text: 'A quick one-time code on your phone confirms the booking is yours.' },
  { title: 'Ride with Theni Taxi', text: 'Your driver arrives on time — pay by cash or UPI after the trip.' },
];

function ServiceIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    local: 'M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13m-14 0v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5m-14 0h14M7.5 16h.01M16.5 16h.01',
    outstation: 'M3 12l2.5-6.5A2 2 0 0 1 7.4 4h9.2a2 2 0 0 1 1.9 1.5L21 12m-18 0v6a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1h11v1a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1v-6m-18 0h18',
    airport: 'M10.5 21l1-4-5-1 1.5-2 4 1 1.5-6-1.5-5.5L13.5 3l1.5 6.5 5 1-1 3-5-1-1.5 6 2 2-1 1-3-1.5-3 1.5-1-1z',
    tour: 'M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 14.8 7.1 17.2l.9-5.5-4-3.9 5.5-.8z',
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] ?? paths.local} />
    </svg>
  );
}

export function HomePage() {
  useSiteSchema();
  useSeo({
    title: 'Theni Taxi | Local & Outstation Cab Booking in Theni',
    description: 'Book a reliable taxi in Theni — local rides, Theni to Madurai drop taxi, Kodaikanal hill cabs and airport transfers. Upfront fares, verified drivers, 24/7.',
    keywords: 'theni taxi, taxi in theni, theni to madurai taxi, cab booking theni, theni local taxi, theni to kodaikanal taxi',
    canonical: '/',
  });

  const navigate = useNavigate();
  const [draft, setDraft] = useState<BookingDraft>(() => readDraft());
  const [error, setError] = useState('');

  function update(patch: Partial<BookingDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function handleSearch() {
    setError('');
    if (!draft.pickup || !draft.drop) return setError('Choose both pickup and drop locations.');
    const problem = scheduleProblem(new Date(draft.scheduledAt));
    if (problem) return setError(problem);
    writeDraft(draft);
    navigate('/book');
  }

  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">Theni &middot; Bodinayakanur &middot; Cumbum &middot; Periyakulam</span>
            <h1>Theni&rsquo;s own local taxi, booked in minutes</h1>
            <p>
              Local rides, one-way drop taxis, round trips and airport transfers across Theni district —
              upfront fares you see before you book, and drivers who know every ghat road to Kodaikanal and Munnar.
            </p>
            <div className="hero__trust">
              <div><strong>10+ yrs</strong><span>Serving Theni</span></div>
              <div><strong>24/7</strong><span>Always on call</span></div>
              <div><strong>4.8&#9733;</strong><span>Rider rating</span></div>
              <div><strong>50+</strong><span>Routes covered</span></div>
            </div>
            <div className="hero__badges">
              <span className="badge">Upfront fares</span>
              <span className="badge">Verified drivers</span>
              <span className="badge">Cash or UPI</span>
            </div>
          </div>

          <div className="book-widget">
            <div className="book-widget__head">
              <h2>Book your taxi</h2>
            </div>
            <TripTypeTabs value={draft.tripType} onChange={(t) => update({ tripType: t })} />
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <LocationField id="home-pickup" label="Pickup" placeholder="Theni, your address…" value={draft.pickup} onChange={(p) => update({ pickup: p })} allowCurrentLocation />
              <LocationField id="home-drop" label="Drop" placeholder="Madurai, Kodaikanal, airport…" value={draft.drop} onChange={(p) => update({ drop: p })} />
              <div className="field">
                <label htmlFor="home-time">Pickup date &amp; time</label>
                <input id="home-time" type="datetime-local" value={draft.scheduledAt} min={defaultScheduledAt()} onChange={(e) => update({ scheduledAt: e.target.value })} />
              </div>
              {error ? <p className="field__error">{error}</p> : null}
              <button type="submit" className="btn btn--primary btn--lg btn--block">See fares</button>
            </form>
            <p className="book-widget__note">No prepayment &middot; Pay the driver after your trip</p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <header className="sec-head">
            <span className="eyebrow">What we offer</span>
            <h2>Every kind of trip out of Theni</h2>
            <p className="sec-head__text">From a quick hop across town to a multi-day hill-station tour, booked the same simple way.</p>
          </header>
          <div className="grid grid--4">
            {SERVICES.map((s) => (
              <Link to={s.to} key={s.to} className="service-card">
                <span className="service-card__icon"><ServiceIcon name={s.icon} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="service-card__link">Learn more &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--surface">
        <div className="wrap">
          <header className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>Booking a cab with us is this simple</h2>
          </header>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step__num">{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <header className="sec-head">
            <span className="eyebrow">Popular routes</span>
            <h2>Theni to everywhere riders ask for</h2>
          </header>
          <div className="route-grid">
            {ROUTES.map((r) => (
              <Link key={r.slug} to={`/theni-to/${r.slug}`} className="route-card">
                <span>Theni &rarr; {r.destination}<small>{r.distanceKm} km &middot; {r.travelTime}</small></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--surface">
        <ReviewsSection brand={SITE.name} />
      </section>

      <section className="band">
        <CatalogSection brand={SITE.name} />
      </section>

      <section className="band">
        <div className="wrap">
          <div className="cta-band">
            <div>
              <h2>Need a cab right now?</h2>
              <p>Call or WhatsApp us — we&rsquo;ll have a driver on the way.</p>
            </div>
            <div className="cta-band__actions">
              <a className="btn btn--on-dark btn--lg" href={telHref()}>Call {SUPPORT_PHONE_DISPLAY}</a>
              <a className="btn btn--teal btn--lg" href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
