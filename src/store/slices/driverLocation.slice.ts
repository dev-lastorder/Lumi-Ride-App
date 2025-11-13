import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DriverLocationState = {
  latitude: number | undefined;
  longitude: number | undefined;
  hasLocation: boolean;
};

const initialState: DriverLocationState = {
  latitude: undefined,
  longitude: undefined,
  hasLocation: true
};

const driverLocationSlice = createSlice({
  name: "driverLocation",
  initialState,
  reducers: {
    setDriverLocation: (state, action: PayloadAction<DriverLocationState>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.hasLocation = true;
    },
    setHasLocation: (state, action: PayloadAction<boolean>) => {
      state.hasLocation = action.payload;
    }
  },
});

export const { setDriverLocation,setHasLocation } = driverLocationSlice.actions;
export default driverLocationSlice.reducer;
