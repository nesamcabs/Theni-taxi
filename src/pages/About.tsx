import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { ContentHero } from '@/components/ContentHero';
import { SITE } from '@/seo/site';

export function AboutPage() {
  useSeo({
    title: 'About Theni Taxi',
    description: 'Theni Taxi is a local taxi service by NESAM Tours and Travels, serving Theni district with local rides, outstation cabs and airport transfers since day one.',
    canonical: '/about',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }],
  });

  return (
    <div>
      <ContentHero eyebrow="Who we are" title="About Theni Taxi" breadcrumb="About"
        intro="A local taxi service built for Theni district — run by people who grew up on these roads." />

      <section className="band">
        <div className="wrap prose">
          <p>
            Theni Taxi is the local taxi brand of {SITE.legalName}, headquartered right here in Theni. We started by
            driving the roads our riders actually use every day — the Periyakulam–Kodaikanal ghat, the Bodinayakanur
            crossing into Kerala, the NH 85 run to Madurai — and built our service around knowing them well.
          </p>
          <h2>What makes us different</h2>
          <ul>
            <li>Upfront fares calculated before you confirm — never negotiated at the roadside.</li>
            <li>Drivers from Theni district who know the ghat roads, shortcuts and local landmarks.</li>
            <li>24/7 availability for local rides, outstation trips, airport transfers and hourly rentals.</li>
            <li>Verified vehicles and drivers, with a boarding OTP to confirm you&rsquo;re in the right car.</li>
          </ul>
          <h2>Where we operate</h2>
          <p>
            Based in Theni, Tamil Nadu, we cover local rides across Theni, Bodinayakanur, Cumbum, Periyakulam, Kambam,
            Chinnamanur, Uthamapalayam and Andipatti, with outstation trips to Madurai, Kodaikanal, Munnar, Thekkady,
            Coimbatore, Dindigul, Tiruchirappalli, Rameswaram and beyond.
          </p>
        </div>
      </section>

      <section className="band band--surface">
        <div className="wrap stat-row">
          <div className="stat-tile"><strong>10+</strong><span>Years serving Theni</span></div>
          <div className="stat-tile"><strong>8</strong><span>Towns covered locally</span></div>
          <div className="stat-tile"><strong>10+</strong><span>Outstation routes</span></div>
          <div className="stat-tile"><strong>24/7</strong><span>Booking &amp; support</span></div>
        </div>
      </section>

      <section className="band" style={{ textAlign: 'center' }}>
        <Link to="/book" className="btn btn--primary btn--lg">Book your first ride</Link>
      </section>
    </div>
  );
}
