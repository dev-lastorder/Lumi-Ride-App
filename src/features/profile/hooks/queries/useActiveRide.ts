import rideRequestsService from "@/src/features/rideRequests/services";
import { useQuery } from "@tanstack/react-query";

export const useActiveRide = () => {
    return useQuery({
        queryKey: ["activeRide"],
        queryFn: rideRequestsService.acceptRideRequest,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: false,
        
    });
};
