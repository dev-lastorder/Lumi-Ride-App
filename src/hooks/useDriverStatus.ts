import { DriverStatus } from '@/src/features/rideRequests/types';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setDriverStatus, toggleDriverStatus } from '@/src/store/slices/driverStatus.slice';

export const useDriverStatus = () => {
  const dispatch = useAppDispatch();
  const driverStatus = useAppSelector((state) => state.driverStatus.status);

  const setDriverStatusAction = (status: DriverStatus) => {
    dispatch(setDriverStatus(status));
  };

  const toggleDriverStatusAction = () => {
    dispatch(toggleDriverStatus());
  };

  return {
    driverStatus,
    setDriverStatus: setDriverStatusAction,
    toggleDriverStatus: toggleDriverStatusAction,
  };
};
