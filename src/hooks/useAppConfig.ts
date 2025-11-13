import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import rideRequestsService from '../features/rideRequests/services';
import { AppConfigState, setCurrency, setError, setLoading } from '../store/slices/appConfigSlice';
import { AppDispatch, RootState } from '../store/store';



export const useAppConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector<RootState, AppConfigState>((state) => state.appConfig);

  useEffect(() => {
    console.log("⚙️ useAppConfig mounted");
    const loadConfig = async () => {
      dispatch(setLoading(true));
      try {
        console.log("📡 Loading currency config...");
        await fetchCurrency();
      } catch (err: any) {
        console.log("❌ Config error:", err);
        dispatch(setError(err.message || 'Something went wrong'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadConfig();
  }, [dispatch]);

  const fetchCurrency = async () => {
    try {
      console.log("🪙 Calling rideRequestsService.checkCurrency()");
      const data = await rideRequestsService.checkCurrency();
      console.log("🪙 Currency response:", data);

      if (!Array.isArray(data)) {
        throw new Error('Invalid currency data format');
      }
      const activeCurrency = data.find((item) => item.isActive) || null;

      dispatch(setCurrency(activeCurrency));
      console.log('✅ Fetched active currency:', activeCurrency);
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch currency'));
    }
  };

  return config;
};

