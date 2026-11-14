import type { TripType } from '@core/types';

const TABS: { value: TripType; label: string }[] = [
  { value: 'One Way', label: 'One Way' },
  { value: 'Round Trip', label: 'Round Trip' },
  { value: 'Airport Taxi', label: 'Airport' },
  { value: 'Local Rental', label: 'Hourly Rental' },
];

export function TripTypeTabs({ value, onChange }: { value: TripType; onChange: (t: TripType) => void }) {
  return (
    <div className="tabs trip-tabs" role="tablist" aria-label="Trip type">
      {TABS.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          className={`tabs__btn ${value === t.value ? 'is-on' : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
