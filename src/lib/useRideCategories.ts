import { useEffect, useState } from 'react';
import { subscribeToRideCategories, type RideCategoryStatus } from '@core/services/pricingService';
import { DEFAULT_RIDE_CATEGORIES } from '@core/config/constants';
import type { RideCategory } from '@core/types';

/** Admin-configured categories; falls back to the built-in list only when none are configured. */
export function useRideCategories(): { categories: RideCategory[]; status: RideCategoryStatus } {
  const [categories, setCategories] = useState<RideCategory[]>([]);
  const [status, setStatus] = useState<RideCategoryStatus>('loading');

  useEffect(
    () =>
      subscribeToRideCategories((cats, s) => {
        setCategories(cats.length ? cats : s === 'unavailable' || s === 'error' ? DEFAULT_RIDE_CATEGORIES : cats);
        setStatus(s);
      }),
    [],
  );

  return { categories, status };
}
