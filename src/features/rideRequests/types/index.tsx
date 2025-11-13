// Ride Request Types and Interfaces

export type RideStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export type DriverStatus = 'online' | 'offline' | 'busy';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
}

export interface Passenger {
  id: string;
  name: string;
  phoneNumber: string;
  rating: number;
  profileImage?: string;
  totalRides?: number;
  totalRatings?: number;
}

export interface RideRequest {
  is_scheduled: any;
  is_hourly: any;
  profileImg: any;
  id: string;
  passenger: Passenger;
  pickupLocation: Location;
  dropoffLocation: Location;
  requestTime: string;
  estimatedFare: number;
  distance: number; // in kilometers
  estimatedDuration: number; // in minutes
  status: RideStatus;
  paymentMethod: 'cash' | 'card' | 'wallet';
  specialInstructions?: string;
  rideType: 'scheduled' | 'standard' | 'hourly';
  
}

export interface DriverProfile {
  id: string;
  name: string;
  phoneNumber: string;
  vehicleNumber: string;
  vehicleModel: string;
  rating: number;
  totalRides: number;
  status: DriverStatus;
}

export interface RideRequestsState {
  activeRequests: RideRequest[];
  isOnline: boolean;
  currentRide: RideRequest | null;
  driverProfile: DriverProfile | null;
}

export interface RideRequestResponse {
  success: boolean;
  message: string;
  data?: RideRequest;
}


export interface ScheduledRidesResponse {
  success: boolean;
  message: string;
  data: RideRequest[];
}
