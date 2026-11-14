import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationField } from '@/components/LocationField';
import { TripTypeTabs } from '@/components/TripTypeTabs';
import { useAuth } from '@/components/AuthProvider';
import { useSeo } from '@/lib/seo';
import { readDraft, writeDraft, clearDraft, defaultScheduledAt, type BookingDraft } from '@/lib/bookingDraft';
import { useRideCategories } from '@/lib/useRideCategories';
import { getRoute } from '@core/services/geoService';
import { calculateFare, hasEstimate, isOutstation, serviceName } from '@core/services/pricingService';
import { createRideRequest } from '@core/services/rideService';
import { useServerQuotes } from '@core/hooks/useServerQuotes';
import { scheduleProblem, composeBookingNotes, inclusionLine, quotedInclusionLine } from '@core/utils/bookingRules';
import { linesFromBreakdown } from '@core/utils/fareBreakup';
import { formatINR, formatDistance, formatDuration, formatDate, formatTime } from '@core/utils/format';
import { AdditionalCharges } from '@/shared/components/AdditionalCharges';
import { CabIcon } from '@/shared/components/CabParts';
import type { FareBreakdown, GeoPlace, RideCategory, RouteInfo } from '@core/types';
import type { QuoteRequest, ServerCategoryQuote } from '@core/services/quoteService';

/** quotedInclusionLine() can come back blank once a confirmed quote lacks included-km/extra-km fields
 * (common outside Local Rental) — fall back to the category's own line instead of showing nothing. */
function inclusionLineFor(sq: ServerCategoryQuote | undefined, c: RideCategory, outstation: boolean): string {
  return quotedInclusionLine(sq, c, outstation) || inclusionLine(c, outstation);
}

type Step = 'plan' | 'categories' | 'review';
const STEPS: { key: Step; label: string }[] = [
  { key: 'plan', label: 'Trip details' },
  { key: 'categories', label: 'Choose cab' },
  { key: 'review', label: 'Review & book' },
];

export function BookPage() {
  useSeo({ title: 'Book a Taxi in Theni', description: 'Book a local, outstation, airport or hourly-rental taxi in Theni. Upfront fares, instant confirmation.', canonical: '/book', noindex: true });

  const navigate = useNavigate();
  const { requireProfile } = useAuth();
  const [step, setStep] = useState<Step>('plan');
  const [draft, setDraft] = useState<BookingDraft>(() => readDraft());
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [planError, setPlanError] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [flight, setFlight] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => writeDraft(draft), [draft]);

  const { categories } = useRideCategories();
  const pickupTime = useMemo(() => new Date(draft.scheduledAt), [draft.scheduledAt]);

  const quoteRequest: QuoteRequest | null = useMemo(() => {
    if (!draft.pickup || !draft.drop) return null;
    return {
      pickup: draft.pickup,
      drop: draft.drop,
      tripType: draft.tripType,
      scheduledAt: pickupTime.toISOString(),
      tripEndAt: draft.tripType === 'Round Trip' ? draft.tripEndAt || undefined : undefined,
      rentalHours: draft.tripType === 'Local Rental' ? draft.rentalHours : undefined,
      brand: 'theni_taxi',
    };
  }, [draft, pickupTime]);

  const quote = useServerQuotes(quoteRequest, step !== 'plan');

  function updateDraft(patch: Partial<BookingDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  async function goToCategories() {
    setPlanError('');
    if (!draft.pickup || !draft.drop) return setPlanError('Choose both pickup and drop locations.');
    if (draft.pickup.id === draft.drop.id && draft.pickup.lat === draft.drop.lat) return setPlanError('Pickup and drop can’t be the same place.');
    const schedProblem = scheduleProblem(pickupTime);
    if (schedProblem) return setPlanError(schedProblem);
    if (draft.tripType === 'Round Trip' && (!draft.tripEndAt || new Date(draft.tripEndAt) <= pickupTime)) {
      return setPlanError('Choose when your round trip ends.');
    }
    setRouteLoading(true);
    try {
      const r = await getRoute(draft.pickup, draft.drop);
      setRoute(r);
      setStep('categories');
    } catch {
      setPlanError('Could not calculate the route. Please try again.');
    } finally {
      setRouteLoading(false);
    }
  }

  const outstation = route ? isOutstation(route.distanceKm) : false;
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || null;
  const selectedServerQuote = quote.data?.quotes.find((q) => q.categoryId === selectedCategoryId && q.ok);
  const selectedFare: FareBreakdown | null = selectedServerQuote?.fare
    || (selectedCategory && route && hasEstimate(selectedCategory) ? calculateFare({ category: selectedCategory, route, tripType: draft.tripType, pickupTime }) : null);

  async function handleSubmit() {
    if (!draft.pickup || !draft.drop || !route || !selectedCategory || !selectedFare) return;
    if (!termsAccepted) return setSubmitError('Please accept the booking terms to continue.');
    setSubmitError('');
    setSubmitting(true);
    try {
      const profile = await requireProfile();
      const finalNotes = composeBookingNotes({ flight: draft.tripType === 'Airport Taxi' ? flight : undefined, notes });
      const result = await createRideRequest({
        profile,
        pickup: draft.pickup,
        drop: draft.drop,
        category: selectedCategory,
        route,
        fare: selectedFare,
        tripType: draft.tripType,
        paymentMethod: 'Cash',
        couponCode: '',
        notes: finalNotes,
        scheduledAt: pickupTime,
        tripEndAt: draft.tripType === 'Round Trip' && draft.tripEndAt ? new Date(draft.tripEndAt) : undefined,
        termsAccepted: true,
        rentalHours: draft.tripType === 'Local Rental' ? draft.rentalHours : undefined,
        source: 'theni_taxi',
        bookingSource: 'theni_taxi',
        brand: 'theni_taxi',
      });
      clearDraft();
      navigate(`/book/confirmation/${result.id}`);
    } catch (err) {
      setSubmitError((err as Error)?.message || 'Could not submit your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="book-page">
      <div className="wrap">
        <div className="book-progress">
          {STEPS.map((s, i) => (
            <div key={s.key} className={`book-progress__step ${step === s.key ? 'is-active' : ''}`}>
              <div className="book-progress__bar">
                <i style={{ width: STEPS.findIndex((x) => x.key === step) >= i ? '100%' : '0%' }} />
              </div>
              <span>{i + 1}. {s.label}</span>
            </div>
          ))}
        </div>

        <div className="book-shell">
          <div className="book-card">
            {step === 'plan' && (
              <>
                <h2>Where are you headed?</h2>
                <p className="book-card__sub">Local rides, outstation drops, airport transfers or hourly rentals — anywhere out of Theni.</p>
                <TripTypeTabs value={draft.tripType} onChange={(t) => updateDraft({ tripType: t })} />

                <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
                  <LocationField id="pickup" label="Pickup location" placeholder="Theni bus stand, your address…" value={draft.pickup} onChange={(p) => updateDraft({ pickup: p })} allowCurrentLocation />
                  <LocationField id="drop" label="Drop location" placeholder="Madurai, Kodaikanal, airport…" value={draft.drop} onChange={(p) => updateDraft({ drop: p })} />

                  <div className="row-2">
                    <div className="field">
                      <label htmlFor="pickup-time">Pickup date &amp; time</label>
                      <input id="pickup-time" type="datetime-local" value={draft.scheduledAt} min={defaultScheduledAt()} onChange={(e) => updateDraft({ scheduledAt: e.target.value })} />
                    </div>
                    {draft.tripType === 'Round Trip' ? (
                      <div className="field">
                        <label htmlFor="trip-end">Return date &amp; time</label>
                        <input id="trip-end" type="datetime-local" value={draft.tripEndAt ?? ''} min={draft.scheduledAt} onChange={(e) => updateDraft({ tripEndAt: e.target.value })} />
                      </div>
                    ) : null}
                    {draft.tripType === 'Local Rental' ? (
                      <div className="field">
                        <label htmlFor="rental-hours">Package</label>
                        <select id="rental-hours" value={draft.rentalHours ?? ''} onChange={(e) => updateDraft({ rentalHours: e.target.value ? Number(e.target.value) : null })}>
                          <option value="">Shortest available</option>
                          <option value="4">4 hours / 40 km</option>
                          <option value="8">8 hours / 80 km</option>
                          <option value="12">12 hours / 120 km</option>
                        </select>
                      </div>
                    ) : null}
                  </div>
                  {draft.tripType === 'Airport Taxi' ? (
                    <div className="field">
                      <label htmlFor="flight">Flight number (optional)</label>
                      <input id="flight" type="text" placeholder="e.g. 6E 234" value={flight} onChange={(e) => setFlight(e.target.value)} />
                    </div>
                  ) : null}
                </div>

                {planError ? <p className="alert alert--error" style={{ marginTop: 16 }}>{planError}</p> : null}

                <div className="book-actions">
                  <span />
                  <button type="button" className="btn btn--primary btn--lg" onClick={goToCategories} disabled={routeLoading}>
                    {routeLoading ? <span className="spinner" /> : 'Search taxis'}
                  </button>
                </div>
              </>
            )}

            {step === 'categories' && route && (
              <>
                <h2>Choose your cab</h2>
                <p className="book-card__sub">
                  {formatDistance(route.distanceKm)} · {formatDuration(route.durationMin)} · {serviceName(draft.pickup as GeoPlace, draft.drop as GeoPlace, route.distanceKm, draft.tripType)}
                </p>

                {quote.status === 'error' ? <p className="alert alert--info" style={{ marginBottom: 14 }}>Showing estimated fares — exact pricing will confirm shortly.</p> : null}

                <div className="vehicle-list">
                  {categories.map((c) => {
                    const sq = quote.data?.quotes.find((q) => q.categoryId === c.id && q.ok);
                    const fare = sq?.fare ?? (hasEstimate(c) ? calculateFare({ category: c, route, tripType: draft.tripType, pickupTime }) : null);
                    if (!fare) return null;
                    return (
                      <button key={c.id} type="button" className={`vehicle-card ${selectedCategoryId === c.id ? 'is-selected' : ''}`} onClick={() => setSelectedCategoryId(c.id)}>
                        <span className="vehicle-card__thumb">
                          {c.imageUrl ? <img src={c.imageUrl} alt={c.name} /> : <CabIcon kind="road" size={28} />}
                        </span>
                        <span className="vehicle-card__body">
                          <h4>{c.name}</h4>
                          <span className="cabx-facts">
                            <span><CabIcon kind="seat" size={16} /> {c.seats}</span>
                            <span><CabIcon kind="ac" size={16} /> AC</span>
                          </span>
                          <span className="vehicle-card__inclusion">
                            <CabIcon kind="road" size={20} />
                            <span>{inclusionLineFor(sq, c, outstation)}</span>
                          </span>
                        </span>
                        <span className="vehicle-card__price">
                          {sq?.strikeTotal ? <span className="vehicle-card__strike">{formatINR(sq.strikeTotal)}</span> : null}
                          <strong>{formatINR(fare.total)}</strong>
                          <span>{sq?.ok ? 'confirmed fare' : 'estimate'}</span>
                        </span>
                      </button>
                    );
                  })}
                  {categories.length === 0 ? <p className="muted">Loading available cabs…</p> : null}
                </div>

                <div className="book-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setStep('plan')}>Back</button>
                  <button type="button" className="btn btn--primary btn--lg" disabled={!selectedCategoryId} onClick={() => setStep('review')}>
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 'review' && selectedCategory && selectedFare && route && draft.pickup && draft.drop && (
              <>
                <h2>Review your trip</h2>
                <p className="book-card__sub">Pay the driver by cash or UPI after the trip — nothing is charged online.</p>

                <div className="review-list">
                  <div className="review-row"><span>Vehicle</span><span>{selectedCategory.name}</span></div>
                  <div className="review-row"><span>Pickup</span><span>{formatDate(pickupTime)}, {formatTime(pickupTime)}</span></div>
                  <div className="review-row"><span>Trip type</span><span>{draft.tripType}</span></div>
                  <div className="review-row"><span>Distance</span><span>{formatDistance(route.distanceKm)}</span></div>
                </div>

                <div className="field" style={{ marginTop: 16 }}>
                  <label htmlFor="notes">Notes for the driver (optional)</label>
                  <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Landmark, luggage, anything the driver should know" maxLength={250} />
                </div>

                <AdditionalCharges lines={linesFromBreakdown(selectedFare)} footnote="Toll, parking and permit charges (if any) are paid directly by you during the trip." />

                <label className="terms-row">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                  I agree to Theni Taxi&rsquo;s booking &amp; cancellation terms.
                </label>

                {submitError ? <p className="alert alert--error" style={{ marginTop: 14 }}>{submitError}</p> : null}

                <div className="book-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setStep('categories')}>Back</button>
                  <button type="button" className="btn btn--primary btn--lg" onClick={handleSubmit} disabled={submitting || !termsAccepted}>
                    {submitting ? <span className="spinner" /> : 'Confirm booking'}
                  </button>
                </div>
              </>
            )}
          </div>

          {draft.pickup && draft.drop ? (
            <aside className="summary-card">
              <h3>Trip summary</h3>
              <div className="summary-route">
                <div className="summary-route__pt">
                  <span className="summary-route__dot" />
                  <span className="summary-route__text"><strong>{draft.pickup.name}</strong><span>{draft.pickup.address}</span></span>
                </div>
                <div className="summary-route__line" style={{ marginLeft: 5 }} />
                <div className="summary-route__pt summary-route__pt--drop">
                  <span className="summary-route__dot" />
                  <span className="summary-route__text"><strong>{draft.drop.name}</strong><span>{draft.drop.address}</span></span>
                </div>
              </div>
              {route ? (
                <div className="summary-stats">
                  <div><strong>{formatDistance(route.distanceKm)}</strong><span>Distance</span></div>
                  <div><strong>{formatDuration(route.durationMin)}</strong><span>Duration</span></div>
                </div>
              ) : null}
              {selectedFare ? (
                <div className="summary-fare">
                  <div className="summary-fare__row"><span>Fare + GST</span><span>{formatINR(selectedFare.total)}</span></div>
                  <div className="summary-fare__total"><span>Total</span><span>{formatINR(selectedFare.total)}</span></div>
                </div>
              ) : null}
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
