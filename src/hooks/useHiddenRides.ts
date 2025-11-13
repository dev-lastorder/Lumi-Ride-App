import { useCallback, useEffect, useState } from 'react';
import { HiddenRidesStorage } from '@/src/services/hiddenRidesStorage';

export const useHiddenRides = () => {
  const [hiddenRides, setHiddenRides] = useState<Set<string>>(new Set());

  const loadHiddenRides = useCallback(async () => {
    const hidden = await HiddenRidesStorage.getHiddenRides();
    setHiddenRides(hidden);
  }, []);

  const hideRide = useCallback(async (rideId: string) => {
    await HiddenRidesStorage.hideRide(rideId);
    setHiddenRides(prev => new Set([...prev, rideId]));
  }, []);

  const unhideRide = useCallback(async (rideId: string) => {
    await HiddenRidesStorage.unhideRide(rideId);
    setHiddenRides(prev => {
      const newSet = new Set(prev);
      newSet.delete(rideId);
      return newSet;
    });
  }, []);

  const isRideHidden = useCallback((rideId: string) => {
    return hiddenRides.has(rideId);
  }, [hiddenRides]);

  useEffect(() => {
    loadHiddenRides();
  }, [loadHiddenRides]);

  return {
    hiddenRides,
    hideRide,
    unhideRide,
    isRideHidden,
    loadHiddenRides,
  };
};