import { useMutation, useQueryClient } from '@tanstack/react-query';
import rideRequestsService from '../../services';


export const useCancelScheduledRideRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rideRequestsService.cancelScheduledRideRequest(id),
    onSuccess: () => {
      console.log('✅ Ride request canceled successfully');
      // Invalidate reservations to refresh the list
    //   queryClient.invalidateQueries({
    //     queryKey: ['getReservations'],
    //   });
      // Show success message (you can add toast here)
    },
    onError: (error) => {
      console.error('❌ Failed to cancel reservation:', error);
      // Show error message (you can add toast here)
    },
  });
};