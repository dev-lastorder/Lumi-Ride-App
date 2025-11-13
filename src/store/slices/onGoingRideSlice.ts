// src/store/slices/ride.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RideState {
  onGoingRideData: any | null;
}

const initialState: RideState = {
  onGoingRideData: null,
};

const rideSlice = createSlice({
  name: "onGoingRide",
  initialState,
  reducers: {
    setOnGoingRideData: (state, action: PayloadAction<any>) => {
      state.onGoingRideData = action.payload;
    },
    clearOnGoingRideData: (state) => {
      state.onGoingRideData = null;
    },
  },
});

export const { setOnGoingRideData, clearOnGoingRideData } = rideSlice.actions;
export default rideSlice.reducer;
