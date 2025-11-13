import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ZoneState {
  zoneId: string | null;
}

const initialState: ZoneState = {
  zoneId: null,
};

const zoneSlice = createSlice({
  name: "zone",
  initialState,
  reducers: {
    setZoneId: (state, action: PayloadAction<string>) => {
      state.zoneId = action.payload;
    },
    clearZoneId: (state) => {
      state.zoneId = null;
    },
  },
});

export const { setZoneId, clearZoneId } = zoneSlice.actions;
export default zoneSlice.reducer;
