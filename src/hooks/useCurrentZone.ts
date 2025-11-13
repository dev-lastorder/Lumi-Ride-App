import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import rideRequestsService from '../features/rideRequests/services';
import { setZoneId } from '../store/slices/zoneSlice';
import { RootState } from '../store/store';


const useCurrentZone = () => {
    const { latitude, longitude } = useSelector(
        (state: RootState) => state.driverLocation
    );
    const [zone, setZone] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
    const cancelTokenRef = useRef<AbortController | null>(null);
    const dispatch = useDispatch();

    const fetchZone = useCallback(async (lat: number, lng: number) => {
        if (
            lastCoordsRef.current &&
            Math.abs(lastCoordsRef.current.lat - lat) < 0.0001 &&
            Math.abs(lastCoordsRef.current.lng - lng) < 0.0001
        ) {
            return;
        }

        lastCoordsRef.current = { lat, lng };
        setLoading(true);

        if (cancelTokenRef.current) cancelTokenRef.current.abort();
        cancelTokenRef.current = new AbortController();

        try {
            const data = await rideRequestsService.getZone(lat, lng);
            setZone(data?.id ?? 'Unknown zone');
            dispatch(setZoneId(data?.id))
        } catch (error: any) {
            // Set zone to the backend error message
            setZone(error.message || 'Unknown zone');
            console.error('Zone fetch failed:', error.message || error);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        if (latitude != null && longitude != null) {
            fetchZone(latitude, longitude);
        }

        // Cleanup on unmount
        return () => {
            if (cancelTokenRef.current) cancelTokenRef.current.abort();
        };
    }, [latitude, longitude, fetchZone]);

    return { zone, loading };
};

export default useCurrentZone;
