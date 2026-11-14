import type { GeoPlace, TripType } from '@core/types';

export interface BookingDraft {
  tripType: TripType;
  pickup: GeoPlace | null;
  drop: GeoPlace | null;
  scheduledAt: string;
  tripEndAt: string | null;
  rentalHours: number | null;
}

const KEY = 'theni_taxi_booking_draft_v1';

export function defaultScheduledAt(): string {
  const d = new Date(Date.now() + 45 * 60000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function emptyDraft(): BookingDraft {
  return { tripType: 'One Way', pickup: null, drop: null, scheduledAt: defaultScheduledAt(), tripEndAt: null, rentalHours: null };
}

export function readDraft(): BookingDraft {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as Partial<BookingDraft>;
    return { ...emptyDraft(), ...parsed };
  } catch {
    return emptyDraft();
  }
}

export function writeDraft(draft: BookingDraft): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* storage blocked — the draft simply isn't remembered across a refresh */
  }
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
