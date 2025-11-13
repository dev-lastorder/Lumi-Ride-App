import { RideRequest } from '../types';

// Format distance
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

// Format duration
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Calculate estimated earnings
export const calculateEstimatedEarnings = (fare: number, commission: number = 0.2): number => {
  return fare * (1 - commission);
};

// Sort ride requests by time (newest first)
export const sortRideRequestsByTime = (requests: RideRequest[]): RideRequest[] => {
  return [...requests].sort((a, b) => {
    return new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime();
  });
};

// Filter ride requests by status
export const filterRideRequestsByStatus = (
  requests: RideRequest[],
  status: RideRequest['status']
): RideRequest[] => {
  return requests.filter((request) => request.status === status);
};

// Get time elapsed since request
export const getTimeElapsed = (requestTime: string): string => {
  const now = new Date().getTime();
  const requestDate = new Date(requestTime).getTime();
  const diffInSeconds = Math.floor((now - requestDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
};

export default {
  formatDistance,
  formatDuration,
  formatCurrency,
  calculateEstimatedEarnings,
  sortRideRequestsByTime,
  filterRideRequestsByStatus,
  getTimeElapsed,
};

