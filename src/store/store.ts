// src/store/store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistConfig } from 'redux-persist/es/types';

import authReducer from './slices/auth.slice';
import signupReducer from './slices/signup.slice'; // Import signup reducer
// Slices
import appConfigReducer from './slices/appConfigSlice';
import driverLocationReducer from './slices/driverLocation.slice';
import driverStatusReducer from './slices/driverStatus.slice';
import onGoingRideReducer from "./slices/onGoingRideSlice";
import rideReducer from './slices/requestedRide';
import themeReducer from './slices/theme.slice';
import zoneReducer from "./slices/zoneSlice";



const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  signup: signupReducer, // Add signup reducer
  driverStatus: driverStatusReducer,
  ride: rideReducer,
  appConfig: appConfigReducer,

  driverLocation: driverLocationReducer,
  onGoingRide: onGoingRideReducer,
   zone: zoneReducer,
});

type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'driverStatus', 'auth', 'signup'], // Add 'signup' to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export type { RootState };
