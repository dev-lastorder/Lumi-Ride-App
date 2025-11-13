import { DriverStatus } from '@/src/features/rideRequests/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DriverStatusState = {
  status: DriverStatus;
};

const initialState: DriverStatusState = {
  status: 'online',
};

const driverStatusSlice = createSlice({
  name: 'driverStatus',
  initialState,
  reducers: {
    setDriverStatus: (state, action: PayloadAction<DriverStatus>) => {
      state.status = action.payload;
    },
    toggleDriverStatus: (state) => {
      state.status = state.status === 'online' ? 'offline' : 'online';
    },
  },
});

export const { setDriverStatus, toggleDriverStatus } = driverStatusSlice.actions;
export default driverStatusSlice.reducer;
