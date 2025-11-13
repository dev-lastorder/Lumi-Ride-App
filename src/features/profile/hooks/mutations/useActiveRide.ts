import rideRequestsService from "@/src/features/rideRequests/services";
import { useMutation } from "@tanstack/react-query";

export const useAcceptRide = () => {
  return useMutation({
    mutationFn: rideRequestsService.acceptRideRequest,
  });
};
