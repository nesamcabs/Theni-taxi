import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { subscribeToBoardingOtp, subscribeToBooking, cancelRide, cancellationQuote } from '@core/services/rideService';
import { formatDate, formatDistance, formatINR, formatTime, telHref } from '@core/utils/format';
import type { RidePhase, TripRecord } from '@core/types';

const PHASE_COPY: Record<RidePhase, { title: string; body: string }> = {
  awaiting_review: { title: 'Reviewing your booking', body: 'Our team is reviewing your request — this usually takes a few minutes.' },
  arranging: { title: 'Finding your driver', body: 'We’re lining up a nearby driver for your trip.' },
  partner_confirmed: { title: 'Confirmed — assigning a driver', body: 'Your booking is confirmed. A driver will be assigned shortly.' },
  driver_assigned: { title: 'Driver assigned', body: 'Your driver has been assigned and is getting ready.' },
  driver_en_route: { title: 'Driver is on the way', body: 'Your driver is heading to the pickup point.' },
  driver_arrived: { title: 'Driver has arrived', body: 'Your driver is waiting at the pickup point.' },
  in_trip: { title: 'Trip in progress', body: 'Enjoy the ride — you’re on your way.' },
  completed: { title: 'Trip completed', body: 'Thanks for riding with Theni Taxi!' },
  cancelled: { title: 'Trip cancelled', body: 'This booking was cancelled.' },
};

export function TripStatusPage() {
  const { id = '' } = useParams();
  useSeo({ title: 'Trip Status', canonical: '/trip', noindex: true });

  const [trip, setTrip] = useState<TripRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  useEffect(() => {
    if (!id) return undefined;
    return subscribeToBooking(
      id,
      (s) => { setTrip(s.trip); setLoading(false); },
      () => { setError('We could not load this trip.'); setLoading(false); },
    );
  }, [id]);

  useEffect(() => (id ? subscribeToBoardingOtp(id, setOtp) : undefined), [id]);

  const quote = useMemo(() => (trip ? cancellationQuote(trip) : null), [trip]);

  async function handleCancel(reason: string) {
    if (!trip) return;
    setCancelling(true);
    try {
      await cancelRide(trip, reason);
      setCancelOpen(false);
    } catch (err) {
      setError((err as Error)?.message || 'Could not cancel the trip.');
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="wrap status-page" style={{ textAlign: 'center' }}>
        <span className="spinner spinner--brand" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="wrap status-page">
        <div className="status-card card card--pad" style={{ textAlign: 'center' }}>
          <h2>Trip not found</h2>
          <p className="muted">{error || 'We couldn’t find a booking with that ID.'}</p>
          <Link to="/book" className="btn btn--primary" style={{ marginTop: 16 }}>Book a new trip</Link>
        </div>
      </div>
    );
  }

  const phase = PHASE_COPY[trip.phase];

  return (
    <div className="wrap status-page">
      <div className="status-card">
        <div className="status-phase">
          <span>{phase.title}</span>
        </div>
        <p className="muted" style={{ marginBottom: 20 }}>{phase.body}</p>

        {trip.driver ? (
          <div className="status-driver">
            <img src={trip.driver.photoUrl || undefined} alt="" />
            <div className="status-driver__body">
              <strong>{trip.driver.name}</strong>
              <span>{trip.driver.vehicleModel} · {trip.driver.vehicleNumber}</span>
            </div>
            <a className="btn btn--secondary btn--sm" href={telHref(trip.driver.phone)}>Call</a>
          </div>
        ) : null}

        {otp && (trip.status === 'Assigned' || trip.status === 'Ongoing') ? (
          <div className="card card--pad" style={{ marginBottom: 20, textAlign: 'center' }}>
            <p className="small muted">Share this boarding OTP with your driver</p>
            <div className="status-otp">{otp}</div>
          </div>
        ) : null}

        <div className="review-list">
          <div className="review-row"><span>Pickup</span><span>{trip.pickup.name}</span></div>
          <div className="review-row"><span>Drop</span><span>{trip.drop.name}</span></div>
          <div className="review-row"><span>Date</span><span>{trip.scheduledAt ? `${formatDate(trip.scheduledAt)}, ${formatTime(trip.scheduledAt)}` : trip.date}</span></div>
          <div className="review-row"><span>Distance</span><span>{formatDistance(trip.distanceKm)}</span></div>
          <div className="review-row"><span>Fare</span><span>{formatINR(trip.fare)}</span></div>
        </div>

        {quote?.allowed && !['Completed', 'Cancelled'].includes(trip.status) ? (
          <div style={{ marginTop: 20 }}>
            {!cancelOpen ? (
              <button type="button" className="btn btn--secondary btn--block" onClick={() => setCancelOpen(true)}>Cancel this trip</button>
            ) : (
              <div className="card card--pad">
                <p className="small">{quote.explanation}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button type="button" className="btn btn--ghost" onClick={() => setCancelOpen(false)}>Keep trip</button>
                  <button type="button" className="btn btn--primary" disabled={cancelling} onClick={() => handleCancel('Changed my plans')}>
                    {cancelling ? <span className="spinner" /> : 'Confirm cancellation'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {error ? <p className="alert alert--error" style={{ marginTop: 16 }}>{error}</p> : null}
      </div>
    </div>
  );
}
