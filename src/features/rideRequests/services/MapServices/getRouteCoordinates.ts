import { BACKEND_URL } from "@/environment";


const BASE_URL = BACKEND_URL.PRODUCTION

export const fetchGoogleRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  stops: { lat: number; lng: number }[] = []
) => {
  try {
    const url = `${BASE_URL}/api/v1/maps/route?originLat=${origin.lat}&originLng=${origin.lng}&destinationLat=${destination.lat}&destinationLng=${destination.lng}`;

    const res = await fetch(url);
    const data = await res.json();


    if (!data?.path || !Array.isArray(data.path)) {
      console.warn("⚠️ No valid path found in response");
      return [];
    }

    // Convert [lat, lng] pairs into { latitude, longitude } objects
    const routeCoords = data.path.map(([lat, lng]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }));

    return routeCoords;
  } catch (error) {
    console.error("❌ Error fetching route:", error);
    return [];
  }
};
