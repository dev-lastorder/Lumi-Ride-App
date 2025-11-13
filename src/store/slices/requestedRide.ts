import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RideState {
  newRideRequest: any | null;
}

const initialState: RideState = {
  newRideRequest: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setNewRideRequest: (state, action: PayloadAction<any>) => {
      state.newRideRequest = action.payload;
    },
    clearNewRideRequest: (state) => {
      state.newRideRequest = null;
    },
  },
});

export const { setNewRideRequest, clearNewRideRequest } = rideSlice.actions;
export default rideSlice.reducer;
