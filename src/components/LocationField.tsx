import { useEffect, useRef, useState } from 'react';
import { searchPlaces, getCurrentPosition, reverseGeocode } from '@core/services/geoService';
import { DEFAULT_CENTER } from '@core/config/constants';
import type { GeoPlace } from '@core/types';

interface LocationFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: GeoPlace | null;
  onChange: (p: GeoPlace) => void;
  allowCurrentLocation?: boolean;
}

export function LocationField({ id, label, placeholder, value, onChange, allowCurrentLocation }: LocationFieldProps) {
  const [query, setQuery] = useState(value?.name ?? '');
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => setQuery(value?.name ?? ''), [value]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  function handleInput(v: string) {
    setQuery(v);
    setOpen(true);
    clearTimeout(debounceRef.current);
    if (v.trim().length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const places = await searchPlaces(v, DEFAULT_CENTER);
        setResults(places);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function pick(p: GeoPlace) {
    onChange(p);
    setQuery(p.name);
    setOpen(false);
  }

  async function useCurrentLocation() {
    setLocating(true);
    try {
      const pos = await getCurrentPosition();
      const place = await reverseGeocode(pos);
      pick({ ...place, type: 'current' });
    } catch {
      /* silently let the rider search instead */
    } finally {
      setLocating(false);
    }
  }

  return (
    <div className="field place-field" ref={boxRef}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={query}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => handleInput(e.target.value)}
      />
      {open ? (
        <div className="place-dropdown">
          {allowCurrentLocation ? (
            <button type="button" className="place-dropdown__current" onClick={useCurrentLocation} disabled={locating}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a1 1 0 0 1 1 1v1.06A8 8 0 0 1 19.94 11H21a1 1 0 1 1 0 2h-1.06A8 8 0 0 1 13 19.94V21a1 1 0 1 1-2 0v-1.06A8 8 0 0 1 4.06 13H3a1 1 0 1 1 0-2h1.06A8 8 0 0 1 11 4.06V3a1 1 0 0 1 1-1zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
              </svg>
              {locating ? 'Finding your location…' : 'Use my current location'}
            </button>
          ) : null}
          {loading ? <p className="place-dropdown__empty">Searching…</p> : null}
          {!loading && query.trim().length >= 3 && results.length === 0 ? (
            <p className="place-dropdown__empty">No matches. Try a nearby landmark or town.</p>
          ) : null}
          {results.map((p) => (
            <button key={p.id} type="button" className="place-dropdown__item" onClick={() => pick(p)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 11.6 7.3 11.9a1 1 0 0 0 1.4 0C13 21.6 20 15.4 20 10c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
              <span>
                <span className="place-dropdown__name">{p.name}</span>
                <span className="place-dropdown__addr">{p.address}</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
