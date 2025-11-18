import { useCallback } from "react";
import { useDispatch } from "react-redux";
import rideRequestsService from "../features/rideRequests/services";
import { setOnGoingRideData } from "../store/slices/onGoingRideSlice";

export const useFetchActiveRide = (setRideData: (data: any) => void, setLoading: (value: boolean) => void) => {
    const dispatch = useDispatch();

    const fetchActiveRide = useCallback(async () => {
        try {
            const data = await rideRequestsService.acceptRideRequest();
            console.log("✅ Ride result:", data);

            setRideData(data);
            dispatch(setOnGoingRideData(data));
        } catch (err) {
            console.error("❌ Error fetching active ride:", err);
        } finally {
            setLoading(false);
        }
    }, [dispatch, setRideData, setLoading]);

    return fetchActiveRide;
};
