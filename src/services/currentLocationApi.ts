import { API_ENDPOINTS, client } from "@/src/lib/axios";

export const updateRiderCurrentLocation = async (
  latitude: number,
  longitude: number
): Promise<void> => {
  try {
    await client.patch(API_ENDPOINTS.USER.CURRENT_LOCATION, {
      latitude,
      longitude,
    });
  } catch (error: any) {
    console.log("🚀 ~ updateRiderCurrentLocation ~ error:", error);
    throw error;
  }
};
