import { useSeo } from '@/lib/seo';
import { ContentHero } from '@/components/ContentHero';
import { SITE } from '@/seo/site';
import { SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY } from '@core/config/constants';
import { telHref, whatsappHref } from '@/lib/contact';

export function ContactPage() {
  useSeo({
    title: 'Contact Theni Taxi',
    description: 'Call, WhatsApp or email Theni Taxi to book a local or outstation cab, or ask about fares and availability.',
    canonical: '/contact',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }],
  });

  return (
    <div>
      <ContentHero eyebrow="We're here 24/7" title="Contact Theni Taxi" breadcrumb="Contact"
        intro="For a booking, call or WhatsApp us directly — it's faster than email for same-day trips." />

      <section className="band">
        <div className="wrap feature-row">
          <div className="feature-list">
            <div className="feature-list__item">
              <span className="feature-list__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.7 3.6.8.6 0 1 .5 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.2c.5 0 1 .4 1 1 .1 1.3.4 2.5.8 3.6.1.4 0 .8-.2 1L6.6 10.8z" /></svg>
              </span>
              <div>
                <h4>Call us</h4>
                <p><a href={telHref()}>{SUPPORT_PHONE_DISPLAY}</a></p>
              </div>
            </div>
            <div className="feature-list__item">
              <span className="feature-list__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2z" /></svg>
              </span>
              <div>
                <h4>WhatsApp</h4>
                <p><a href={whatsappHref()} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></p>
              </div>
            </div>
            <div className="feature-list__item">
              <span className="feature-list__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4zM4 4l8 8 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div>
                <h4>Email</h4>
                <p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
              </div>
            </div>
            <div className="feature-list__item">
              <span className="feature-list__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 11.6 7.3 11.9a1 1 0 0 0 1.4 0C13 21.6 20 15.4 20 10c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" /></svg>
              </span>
              <div>
                <h4>Head office</h4>
                <p>Theni, Tamil Nadu 625531, India</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <iframe
              title="Theni Taxi service area map"
              width="100%"
              height="320"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=Theni,Tamil+Nadu&z=11&output=embed`}
            />
          </div>
        </div>
      </section>

      <section className="band band--surface">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <p className="muted">{SITE.legalName} &middot; Operating as Theni Taxi</p>
        </div>
      </section>
    </div>
  );
}
