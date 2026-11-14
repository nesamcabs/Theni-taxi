import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SUPPORT_PHONE_DISPLAY } from '@core/config/constants';
import { telHref } from '@/lib/contact';

const NAV_LINKS = [
  { to: '/local-taxi', label: 'Local Taxi' },
  { to: '/outstation-taxi', label: 'Outstation' },
  { to: '/airport-taxi', label: 'Airport' },
  { to: '/tour-packages', label: 'Tour Packages' },
  { to: '/fare-tariff', label: 'Fare & Tariff' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link to="/" className="brand-mark" onClick={() => setOpen(false)}>
          <span className="brand-mark__badge">T</span>
          <span className="brand-mark__text">
            <strong>Theni Taxi</strong>
            <span>Local &amp; outstation cabs</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-call" href={telHref()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.7 3.6.8.6 0 1 .5 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.2c.5 0 1 .4 1 1 .1 1.3.4 2.5.8 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
            </svg>
            <span>{SUPPORT_PHONE_DISPLAY}</span>
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${open ? 'is-open' : ''}`}>
        <ul className="mobile-nav__list">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mobile-nav__cta">
          <Link to="/book" className="btn btn--primary btn--block" onClick={() => setOpen(false)}>
            Book a taxi
          </Link>
          <a className="btn btn--secondary" href={telHref()}>
            Call
          </a>
        </div>
      </div>
    </header>
  );
}
