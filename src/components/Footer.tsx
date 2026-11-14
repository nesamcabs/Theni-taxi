import { Link } from 'react-router-dom';
import { SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY } from '@core/config/constants';
import { SITE } from '@/seo/site';
import { telHref, whatsappHref } from '@/lib/contact';
import { ROUTES } from '@/data/routesData';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="meter-strip" aria-hidden="true" />
      <div className="wrap site-footer__top">
        <div className="footer-brand">
          <Link to="/" style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem' }}>
            Theni Taxi
          </Link>
          <p>Local and outstation taxi booking for Theni, Bodinayakanur, Cumbum, Periyakulam and nearby towns — upfront fares, verified drivers.</p>
          <div className="footer-contact">
            <a href={telHref()}>{SUPPORT_PHONE_DISPLAY}</a>
            <a href={whatsappHref()}>WhatsApp us</a>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </div>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            <li><Link to="/local-taxi">Local Taxi</Link></li>
            <li><Link to="/outstation-taxi">Outstation Taxi</Link></li>
            <li><Link to="/airport-taxi">Airport Taxi</Link></li>
            <li><Link to="/tour-packages">Tour Packages</Link></li>
            <li><Link to="/fare-tariff">Fare &amp; Tariff</Link></li>
          </ul>
        </div>

        <div>
          <h4>Popular routes</h4>
          <ul>
            {ROUTES.slice(0, 6).map((r) => (
              <li key={r.slug}><Link to={`/theni-to/${r.slug}`}>Theni to {r.destination}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/book">Book a taxi</Link></li>
          </ul>
        </div>
      </div>

      <div className="wrap site-footer__bottom">
        <span>© {year} Theni Taxi · {SITE.legalName}</span>
        <span>Theni, Tamil Nadu 625531, India</span>
      </div>
    </footer>
  );
}
