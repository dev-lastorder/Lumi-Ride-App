import { useMutation, useQueryClient } from '@tanstack/react-query';
import rideRequestsService from '../../services';
import { DriverStatus } from '../../types';
import { RIDE_REQUESTS_QUERY_KEYS } from '../queries';

// Hook to accept a ride request
export const useAcceptRideRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => rideRequestsService.acceptRideRequest(requestId),
    onSuccess: () => {
      // Invalidate and refetch active requests
      queryClient.invalidateQueries({ queryKey: RIDE_REQUESTS_QUERY_KEYS.active });
    },
  });
};

// Hook to decline a ride request
export const useDeclineRideRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => rideRequestsService.declineRideRequest(requestId),
    onSuccess: () => {
      // Invalidate and refetch active requests
      queryClient.invalidateQueries({ queryKey: RIDE_REQUESTS_QUERY_KEYS.active });
    },
  });
};

// Hook to update driver status
export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: DriverStatus) => rideRequestsService.updateDriverStatus(status),
    onSuccess: () => {
      // Invalidate and refetch active requests if needed
      queryClient.invalidateQueries({ queryKey: RIDE_REQUESTS_QUERY_KEYS.active });
    },
  });
};

export default {
  useAcceptRideRequest,
  useDeclineRideRequest,
  useUpdateDriverStatus,
};

