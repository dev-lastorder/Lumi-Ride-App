import { BACKEND_URL } from "@/environment";
import { API_ENDPOINTS, client } from "@/src/lib/axios";
import { selectToken } from "@/src/store/selectors/authSelectors";
import { store } from "@/src/store/store";
import axios from "axios";
import {
  DriverStatus,
  RideRequest,
  RideRequestResponse,
  ScheduledRidesResponse,
} from "../types";

const BASE_URL = BACKEND_URL.PRODUCTION;

const API_BASE = `${BASE_URL}`;

let _isAcceptingRide = false;

// Mock data for development - replace with actual API calls
export const rideRequestsService = {
  // Get active ride requests
  getActiveRequests: async (
    latitude: number,
    longitude: number,
    radius: number = 5000,
    token?: string // optional auth token
  ): Promise<RideRequest[]> => {
    const state = store.getState();
    const newToken = selectToken(state);
    console.log("token", newToken);

    try {
      // Todo: need to get latitude and longitude from driver location slice
      const { latitude, longitude } = state.driverLocation;
        if (
    latitude === null ||
    longitude === null ||
    latitude === undefined ||
    longitude === undefined
  ) {
    console.error("Driver location not available yet!");
    return [];
  }
    //   const latitude =  33.767144;
    //  const longitude = 72.807414;

      const response = await axios.get(
        `${API_BASE}/api/v1/ride-vehicles/nearby/${latitude}/${longitude}/${radius}?radius=${radius}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
      const data = response.data;

      console.log("Ride request data ", data);

      const requests: RideRequest[] = data.map((item: any) => {
        const stops =
          Array.isArray(item.stops) && item.stops.length > 0
            ? item.stops.map((stop: any) => ({
              latitude: stop.lat ?? stop.dropoff?.lat ?? 0,
              longitude: stop.lng ?? stop.dropoff?.lng ?? 0,
              address:
                stop.address || stop.dropoff_location || "Stop Location",
            }))
            : [];

        return {
          id: item.id,
          profileImg: item?.passenger?.profile,
          passenger: {
            id: item.passenger_id,
            name: item.passenger?.name ?? "Unknown Passenger",
            phoneNumber: item.passenger?.phone ?? "",
            rating: item.reviews?.averageRating ?? 0,
            totalRides: item.reviews?.count ?? 0,
          },
          passengerId: item?.passenger_id,
          pickupLocation: {
            latitude: item.locations?.pickup?.lat ?? item.pickup?.lat ?? 0,
            longitude: item.locations?.pickup?.lng ?? item.pickup?.lng ?? 0,
            address:
              item.locations?.pickup_location ||
              item.pickup_location ||
              "Pickup Location",
          },
          dropoffLocation: {
            latitude: item.locations?.dropoff?.lat ?? item.dropoff?.lat ?? 0,
            longitude: item.locations?.dropoff?.lng ?? item.dropoff?.lng ?? 0,
            address:
              item.locations?.dropoff_location ||
              item.dropoff_location ||
              "Dropoff Location",
          },
          stops, // ✅ Include parsed stops here
          requestTime: item.is_scheduled ? item.scheduled_at : item.createdAt,
          estimatedFare: parseFloat(item.offered_fair) || 0,
          distance: item.distance ?? item?.estimated_distance,
          estimatedDuration: item?.estimated_time,
          status: item.status?.toLowerCase?.() ?? "unknown",
          rideType: item.is_hourly
            ? "hourly"
            : item.is_scheduled
              ? "scheduled"
              : "standard",
          paymentMethod: item.payment_via?.toLowerCase?.() ?? "cash",
          specialInstructions: null,
          rideTypeId: item?.ride_type_id,
        };
      });

      return requests;
    } catch (error: any) {
      console.error("Error fetching ride requests:", error.response.data);
      throw error;
    }
  },

  // Accept a ride request
  acceptRideRequest: async (): Promise<RideRequestResponse> => {
    const state = store.getState();
    const token = selectToken(state);
    console.log("token", token);

    try {
      _isAcceptingRide = true;

      const response = await axios.get(
        `${API_BASE}/api/v1/rides/ongoing/active/driver`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Ride accepted successfully:", data);

      return data;
    } catch (error: any) {
      console.error(
        "Error accepting ride request:",
        error.response?.data || error
      );
      throw {
        success: false,
        message:
          error.response?.data?.message || "Failed to accept ride request",
      };
    } finally {
      _isAcceptingRide = false;
    }
  },

  // Optional: expose loading state for UI
  isAcceptingRide: () => _isAcceptingRide,

  // Decline a ride request
  declineRideRequest: async (
    requestId: string
  ): Promise<RideRequestResponse> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.post(`/api/ride-requests/${requestId}/decline`);
      // return response.data;

      // Mock response
      return {
        success: true,
        message: "Ride request declined",
      };
    } catch (error) {
      console.error("Error declining ride request:", error);
      throw error;
    }
  },
  getMyRiderId: async () => {
    const state = store.getState();
    const token = selectToken(state);

    try {
      const response = await axios.get(
        `${API_BASE}/api/v1/ride-vehicles/rider/get-my-rider-id`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ My Rider Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching rider ID:", error);
      throw error;
    }
  },

  getZone: async (lat?: number, lng?: number) => {
    try {
      console.log("Fetching zone for:", lat, lng);

      const response = await axios.get(`${API_BASE}/api/v1/zones/check`, {
        params: { lat, lng },
      });
      return response.data;
    } catch (error: any) {
      // Log the error from backend
      if (error.response?.data?.message) {
        console.error("Backend error message:", error.response.data.message);
        // Throw the backend message so hook can catch it
        throw new Error(error.response.data.message.join(", "));
      }

      console.error("Failed to fetch zone:", error);
      throw error;
    }
  },

  startMyRide: async (rideId: any) => {
    const state = store.getState();
    const token = selectToken(state);

    try {
      const response = await axios.patch(
        `${API_BASE}/api/v1/rides/${rideId}/start-ride/${rideId}`,
        {}, // no body data here (use {} if none)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Ride started:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error starting ride:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  completeMyRide: async (rideId: any) => {
    const state = store.getState();
    const token = selectToken(state);

    try {
      const response = await axios.patch(
        `${API_BASE}/api/v1/rides/${rideId}/complete-ride`,
        {}, // no body data here (use {} if none)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Ride started:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error completing ride:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  checkCurrency: async () => {
    const state = store.getState();
    const token = selectToken(state);

    console.log("📤 checkCurrency called with token:", token);

    try {
      const response = await axios.get(`${API_BASE}/api/v1/currency`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ checking my currency:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Error in getting Currency", error.response);
      throw error; // allow upper layers (hook) to handle it
    }
  },

  giveDriverRating: async (
    payload: {
      description: string;
      rating: number;
      reviewedId: string;
      rideId: string;
    },
    reviewerId: string
  ) => {
    const state = store.getState();
    const token = selectToken(state);

    try {
      const response = await axios.post(`${API_BASE}/api/v1/reviews`, payload, {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Rating submitted:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error giving ride rating:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  checkRideAmount: async (rideId: string, zoneId: any) => {
    const state = store.getState();
    const token = selectToken(state);

    try {
      const response = await axios.get(
        `${API_BASE}/api/v1/rides/riders/check/have-enough-amount/for-ride/${rideId}/${zoneId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Ride amount check response:", response.data);
      return response.data;
    } catch (error: any) {
      const errData = error.response?.data || error.message;
      console.error("❌ Error checking ride amount:", errData);
      return { success: false, error: errData };
    }
  },

  // Update driver status
  updateDriverStatus: async (
    status: DriverStatus
  ): Promise<{ success: boolean }> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.put('/api/driver/status', { status });
      // return response.data;

      // Mock response
      return { success: true };
    } catch (error) {
      console.error("Error updating driver status:", error);
      throw error;
    }
  },

  // get scheduled ride requests
  getScheduledRideRequests: async (): Promise<ScheduledRidesResponse[]> => {
    try {
      const response = await client.get(
        API_ENDPOINTS.RIDE_REQUESTS.SCHEDULED_RIDES
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching scheduled ride requests:", error);
      throw error;
    }
  },

  cancelScheduledRideRequest: async (id: string): Promise<void> => {
    try {
      console.log("🚀 Canceling schedlued ride request:", id);
      await client.patch(API_ENDPOINTS.RIDE_REQUESTS.CANCEL_SCHEDULED_RIDE(id));
      console.log("✅ Ride canceled successfully");
    } catch (error) {
      console.error("❌ Error while canceling ride request:", error);
      throw error;
    }
  },
};

export default rideRequestsService;
