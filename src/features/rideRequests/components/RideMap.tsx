import { useAppSelector } from "@/src/store/hooks";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { fetchGoogleRoute } from "../services/MapServices/getRouteCoordinates";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RideMapProps {
  origin: Coordinate;
  destination: Coordinate;
  rideRequest?: any;
  shouldFetchRoute?: boolean; // 👈 Optional prop to control fetching
}

const RideMap: React.FC<RideMapProps> = ({ origin, destination, rideRequest, shouldFetchRoute = true }) => {
  const mapRef = useRef<MapView>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const { latitude, longitude } = useAppSelector(
    (state) => state.driverLocation
  );

  // console.log("rideRequest in map is", rideRequest);

  const fetchRouteOnce = async () => {
    if (hasFetched || !shouldFetchRoute) return;
    if (origin && destination) {
      try {
        setLoading(true);
        const stops =
          rideRequest?.stops?.filter(
            (s: any) => s.latitude !== 0 && s.longitude !== 0
          ) || [];

        const route = await fetchGoogleRoute(
          { lat: origin.latitude, lng: origin.longitude },
          { lat: destination.latitude, lng: destination.longitude },
          stops.map((s: any) => ({ lat: s.latitude, lng: s.longitude }))
        );
        setRouteCoords(route);
        setHasFetched(true);
      } catch (err) {
        console.warn("⚠️ Failed to fetch route:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRouteOnce();
  }, [origin?.latitude, destination?.latitude]);

  useEffect(() => {
    if (mapRef.current && origin && destination) {
      const points = [origin, destination];

      // Include stops for fitToCoordinates
      if (rideRequest?.stops?.length) {
        rideRequest.stops.forEach((stop: any) => {
          if (stop.latitude && stop.longitude) points.push(stop);
        });
      }

      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [origin, destination, rideRequest?.stops]);

  const defaultRegion = {
    latitude: origin?.latitude || 33.6844,
    longitude: origin?.longitude || 73.0479,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={defaultRegion}
      >
        {/* Origin Marker */}
        {origin && (
          <Marker coordinate={origin}>
            <View style={styles.iconContainer}>
              <Image
                source={require("../../../../assets/images/pickup.png")}
                style={styles.pickupIcon}
              />
            </View>
          </Marker>
        )}

        {/* Stops Markers */}
        {rideRequest?.stops?.length > 0 &&
          rideRequest.stops
            .filter((s: { latitude: number; longitude: number; }) => s.latitude !== 0 && s.longitude !== 0)
            .map((stop: { latitude: any; longitude: any; address: any; }, index: number) => (
              <Marker
                key={`stop-${index}`}
                coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                title={`Stop ${index + 1}`}
                description={stop.address || "Intermediate stop"}
              >
                <View style={[styles.iconContainer, { backgroundColor: "orange" }]}>
                  <Image
                   source={require("../../../../assets/images/pickup.png")}
                    style={styles.pickupIcon}
                  />
                </View>
              </Marker>
            ))}
        {latitude && longitude && (
          <Marker
            coordinate={{ latitude, longitude }}
            title="Your Location"
            description="Current driver position"
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#007AFF", borderColor: "white", borderWidth: 2 },
              ]}
            >
              <Image
                source={require("../../../../assets/images/car.png")}
                style={[styles.pickupIcon, { tintColor: "white" }]}
              />
            </View>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker coordinate={destination}>
            <View style={[styles.iconContainer, { backgroundColor: "red" }]}>
              <Image
                source={require("../../../../assets/images/dropoff.png")}
                style={styles.pickupIcon}
              />
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Loading Spinner */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
};


export default RideMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  iconContainer: {
    backgroundColor: "#6EE7B7",
    padding: 6,
    borderRadius: 20,
  },
  pickupIcon: { width: 8, height: 8, tintColor: "#fff" },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
});
