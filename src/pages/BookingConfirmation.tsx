import { Link, useParams } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { SUPPORT_PHONE_DISPLAY } from '@core/config/constants';
import { telHref, whatsappHref } from '@/lib/contact';

export function BookingConfirmationPage() {
  const { id } = useParams();
  useSeo({ title: 'Booking Confirmed', canonical: '/book/confirmation', noindex: true });

  return (
    <div className="wrap confirm-page">
      <span className="confirm-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h1>Your trip is booked</h1>
      <p className="muted" style={{ maxWidth: 480 }}>
        We&rsquo;ve received your request and our team is confirming a driver. You&rsquo;ll get a call or SMS shortly with the driver and vehicle details.
      </p>
      {id ? <span className="confirm-id">Booking ID: {id}</span> : null}

      <div className="confirm-actions">
        {id ? <Link to={`/trip/${id}`} className="btn btn--primary btn--lg">Track this trip</Link> : null}
        <a className="btn btn--secondary" href={telHref()}>Call {SUPPORT_PHONE_DISPLAY}</a>
        <a className="btn btn--secondary" href={whatsappHref(`Hi, I just booked trip ${id ?? ''} on Theni Taxi.`)} target="_blank" rel="noopener noreferrer">
          WhatsApp us
        </a>
      </div>
      <Link to="/" className="muted small" style={{ marginTop: 24 }}>&larr; Back to home</Link>
    </div>
  );
}
