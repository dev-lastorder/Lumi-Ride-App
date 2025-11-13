import { store } from '@/src/store/store';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import rideRequestsService from '../../services';

// Query keys
export const RIDE_REQUESTS_QUERY_KEYS = {
  all: ['rideRequests'] as const,
  active: ['rideRequests', 'active'] as const,
};

    const state = store.getState();
      const { latitude, longitude } = state.driverLocation;

// Hook to fetch active ride requests
export const useActiveRideRequests = () => {
  const latitude = useSelector(state => state.driverLocation.latitude);
  const longitude = useSelector(state => state.driverLocation.longitude);

  return useQuery({
    queryKey: ['rideRequests', 'active', latitude, longitude],
    queryFn: () => rideRequestsService.getActiveRequests(latitude, longitude),
    enabled: !!latitude && !!longitude, // Only run if location is avail
    // refetchInterval: 10000, // Refetch every 10 seconds
    // staleTime: 5000, // Consider data stale after 5 seconds
  });
};

// Hook to fetch scheduled ride requests
export const useScheduledRideRequests = () => {
  return useQuery({
    queryKey: ['scheduledRideRequests'],
    queryFn: rideRequestsService.getScheduledRideRequests,
    staleTime: 7000, // Consider data stale after 7 seconds
  });
}

export default useActiveRideRequests;

