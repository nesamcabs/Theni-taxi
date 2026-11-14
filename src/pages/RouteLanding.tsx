import { Link, Navigate, useParams } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { faqSchema } from '@/seo/site';
import { ContentHero } from '@/components/ContentHero';
import { FaqAccordion } from '@/components/FaqAccordion';
import { findRoute, ROUTES } from '@/data/routesData';
import { formatINR } from '@core/utils/format';

export function RouteLandingPage() {
  const { slug = '' } = useParams();
  const route = findRoute(slug);

  useSeo(
    route
      ? {
          title: route.h1,
          description: `${route.h1} — ${route.distanceKm} km, about ${route.travelTime}. ${route.intro} Upfront fares, verified drivers.`,
          keywords: `theni to ${route.destination.toLowerCase()} taxi, theni ${route.destination.toLowerCase()} cab, theni to ${route.destination.toLowerCase()} taxi fare`,
          canonical: `/theni-to/${route.slug}`,
          schema: faqSchema(route.faqs),
          breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Outstation Taxi', path: '/outstation-taxi' }, { name: `Theni to ${route.destination}`, path: `/theni-to/${route.slug}` }],
        }
      : { title: 'Route not found', noindex: true },
  );

  if (!route) return <Navigate to="/outstation-taxi" replace />;

  const others = ROUTES.filter((r) => r.slug !== route.slug).slice(0, 4);

  return (
    <div>
      <ContentHero eyebrow={`${route.distanceKm} km · ${route.travelTime}`} title={route.h1} breadcrumb={`Theni to ${route.destination}`} intro={route.intro}>
        <div className="content-cta">
          <Link to="/book" className="btn btn--primary btn--lg">Book this route</Link>
        </div>
      </ContentHero>

      <section className="band">
        <div className="wrap feature-row">
          <div className="prose">
            <h2>About this route</h2>
            <p>{route.overview}</p>
            <h2>Places on the way / at {route.destination}</h2>
            <ul>{route.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          </div>

          <aside className="card card--pad">
            <h3>Indicative fare</h3>
            <p className="small muted" style={{ marginTop: 4 }}>Confirmed live when you book — this is a starting estimate.</p>
            <div className="review-list" style={{ marginTop: 14 }}>
              <div className="review-row"><span>Sedan</span><span>{formatINR(route.sedanFareFrom)}+</span></div>
              <div className="review-row"><span>SUV</span><span>{formatINR(route.suvFareFrom)}+</span></div>
              <div className="review-row"><span>Distance</span><span>{route.distanceKm} km</span></div>
              <div className="review-row"><span>Travel time</span><span>{route.travelTime}</span></div>
            </div>
            <Link to="/book" className="btn btn--primary btn--block" style={{ marginTop: 16 }}>Get exact fare</Link>
          </aside>
        </div>
      </section>

      <section className="band band--surface">
        <div className="wrap">
          <header className="sec-head"><h2>Theni to {route.destination} — FAQs</h2></header>
          <FaqAccordion items={route.faqs} />
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <header className="sec-head"><h2>Other popular routes</h2></header>
          <div className="route-grid">
            {others.map((r) => (
              <Link key={r.slug} to={`/theni-to/${r.slug}`} className="route-card">
                <span>Theni &rarr; {r.destination}<small>{r.distanceKm} km</small></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
