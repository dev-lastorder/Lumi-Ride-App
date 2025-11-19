// services/websocketService.ts
import rideRequestsService from "@/src/features/rideRequests/services";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { setOnGoingRideData } from "@/src/store/slices/onGoingRideSlice";
import { setNewRideRequest } from "@/src/store/slices/requestedRide";
import { store } from "@/src/store/store";
import { router } from "expo-router";
import { Alert } from "react-native";
import io, { Socket } from "socket.io-client";
// Types matching your backend
interface IsentMessage {
  sender: string;
  receiver: string;
  text: string;
}

interface IReceivedMessage {
  sender: string;
  receiver: string;
  text: string;
}

interface IRiderLocation {
  riderUserId: string;
  customerUserId: string;
  latitude: number;
  longitude: number;
}

// WebSocket configuration
const IS_DEV = __DEV__;
const WEBSOCKET_URL = IS_DEV
  ? "https://ride-server.lumi.qa"
  : "https://ride-server.lumi.qa";

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private currentUserId: string | null = null;
  private messageListeners: ((message: IReceivedMessage) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];

  // Initialize WebSocket connection
  connect(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket && this.isConnected && this.currentUserId === userId) {
          console.log("✅ WebSocket already connected for user:", userId);
          resolve(true);
          return;
        }

        // Disconnect existing connection if different user
        if (this.socket) {
          this.disconnect();
        }

        console.log("🔌 Connecting to WebSocket:", WEBSOCKET_URL);
        this.socket = io(WEBSOCKET_URL, {
          transports: ["websocket"],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 10000,
          timeout: 20000,
        });

        this.socket.on("connect", () => {
          console.log("✅ WebSocket connected with ID:", this.socket?.id);
          this.isConnected = true;
          this.currentUserId = userId;

          // Add user to backend connected users
          this.socket?.emit("add-user", userId);
          console.log("📤 Emitted add-user for:", userId);

          // Notify connection listeners
          this.connectionListeners.forEach((listener) => listener(true));
          resolve(true);
        });

        this.socket.on("disconnect", () => {
          console.log("❌ WebSocket disconnected");
          this.isConnected = false;
          this.connectionListeners.forEach((listener) => listener(false));
        });

        this.socket.on("connect_error", (error: any) => {
          console.error("❌ WebSocket connection error:", error);
          this.isConnected = false;
          this.connectionListeners.forEach((listener) => listener(false));
          reject(error);
        });

        // Listen for incoming messages (matching backend event)
        this.socket.on("receive-message", (message: IReceivedMessage) => {
          console.log("📥 Received message:", message);
          this.messageListeners.forEach((listener) => listener(message));
        });

        this.socket.on("new-ride-request-for-driver", (updatedRide) => {
          store.dispatch(setNewRideRequest(updatedRide));
          const { latitude, longitude } = store.getState().driverLocation;
          queryClient.invalidateQueries({
            queryKey: ["rideRequests", "active", latitude, longitude],
          });
          //TODO: Match the event data with the api data
          // const { latitude, longitude } = store.getState().driverLocation;
          // console.log("🔥 Received new ride for driver:",updatedRide, latitude, longitude);

          // // Update all query cache entries of active ride requests
          // queryClient.setQueryData(
          //   ["rideRequests", "active", latitude, longitude],
          //   (oldList: any[] | undefined) => {
          //     console.log(
          //       "🔄 Updating ride requests cache with new ride:",
          //       oldList
          //     );
          //     if (!oldList || !Array.isArray(oldList)) return [updatedRide]; // if list empty → create new list

          //     const rideExists = oldList.some(
          //       (ride) => ride.id === updatedRide.id
          //     );

          //     if (rideExists) {
          //       // 🔄 Update existing ride
          //       return oldList.map((ride) =>
          //         ride.id === updatedRide.id
          //           ? {
          //               ...ride,
          //               offered_fair:
          //                 parseFloat(updatedRide.offeredFair) ??
          //                 ride.offered_fair,
          //               // any other fields to update here...
          //             }
          //           : ride
          //       );
          //     }

          //     // 🆕 Append new ride at the top (or bottom)
          //     return [updatedRide, ...oldList]; // OR [...oldList, updatedRide]
          //   }
          // );
        });
        this.socket.on("ride-started", async(data)=>{

          console.log("ride have start :", data)
        })
         this.socket.on("ride-completed", async(data)=>{

          console.log("ride have start :", data)
        })
        this.socket.on("ride-cancelled", async(data)=>{

          console.log("ride have start :", data)
            router.push("/(tabs)/(rideRequests)/rideRequest");
        })

        this.socket.on("bid-accepted", async (data) => {
          console.log("🎯 Bid accepted event received:", data);

          if (data.message === "Your bid was accepted. Ride started!") {
            console.log("✅ Bid accepted! Fetching ride data...");

            try {
              const rideData = await rideRequestsService.acceptRideRequest();

              if (rideData) {
                console.log("✅ Ride data fetched successfully:", rideData);

                // ✅ Save to Redux before navigation
                store.dispatch(setOnGoingRideData(rideData));

                // ✅ Navigate only after ride data is stored
                setTimeout(() => {
                  router.push("/tripDetail");
                }, 300);
              } else {
                console.warn("⚠️ No ride data returned from API.");
              }
            } catch (err) {
              console.error(
                "❌ Error fetching ride data after bid accepted:",
                err
              );
            }
          } 
          else if (data.message === "Your bid was accepted. Ride schedule!") {
            // ✅ Show alert when scheduled ride is accepted
            Alert.alert(
              "Ride Scheduled",
              "Your bid has been accepted and the ride has been scheduled successfully.",
              [{ text: "OK" }]
            );
          } 
          else {
            console.log("ℹ️ Unhandled bid-accepted message:", data.message);
          }
        });

        this.socket.on("ride-request-fare-raised", async (updatedRide) => {
          console.log("ℹ️ ride-request-fare-raised:", updatedRide);

          // Update all query cache entries of active ride requests
          store.dispatch(setNewRideRequest(updatedRide));
          const { latitude, longitude } = store.getState().driverLocation;
          queryClient.invalidateQueries({
            queryKey: ["rideRequests", "active", latitude, longitude],
          });
        });

        // Connection timeout
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error("WebSocket connection timeout"));
          }
        }, 10000); // 10 second timeout
      } catch (error) {
        console.error("❌ WebSocket connection error:", error);
        reject(error);
      }
    });
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      console.log("🔌 Disconnecting WebSocket");
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentUserId = null;
    this.connectionListeners.forEach((listener) => listener(false));
  }
  // Emit a "place-bid" event
  placeBid(payload: {
    riderId: string;
    rideRequestId: string;
    price: number;
    startType?: any;
    // userId: string;
  }): void {
    if (!this.socket || !this.isConnected) {
      console.error("❌ Cannot place bid — WebSocket not connected");
      return;
    }

    console.log("📤 Emitting place-bid event:", payload);
    this.socket.emit("place-bid", payload);
  }


  startRide ( payload : {
    rideId:string;
    genericUserId:string

  }): void {

     if (!this.socket || !this.isConnected){
       console.error("❌ Cannot start ride— WebSocket not connected");
      return;
     }

     console.log("📤 Emitting Start ride  event:", payload);
     this.socket.emit("ride-started", payload);

  }

  rideCompleted ( payload : {
    rideId:string;
    genericUserId:string

  }): void {

     if (!this.socket || !this.isConnected){
       console.error("❌ Cannot start ride— WebSocket not connected");
      return;
     }

     console.log("📤 Emitting ride completed  event:", payload);
     this.socket.emit("ride-completed", payload);

  }

  // onBidAccepted(callback: (data: any) => void): () => void {
  //   if (!this.socket) {
  //     console.warn("⚠️ Socket not initialized, cannot listen for bid-accepted");
  //     return () => {};
  //   }

  //   const handler = (data: any) => {
  //     console.log("📥 Bid accepted by backend:", data);
  //     callback(data);
  //   };

  //   this.socket.on("bid-accepted", handler);

  //   return () => {
  //     this.socket?.off("bid-accepted", handler);
  //   };
  // }

  // Send message via WebSocket (matching backend interface)
  sendMessage(message: IsentMessage): void {
    if (!this.socket || !this.isConnected) {
      console.error("❌ WebSocket not connected, cannot send message");
      return;
    }

    console.log("📤 Sending message via WebSocket:", message);
    this.socket.emit("send-message", message);
  }

  // Add listener for incoming messages
  onMessage(callback: (message: IReceivedMessage) => void): () => void {
    this.messageListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.messageListeners.indexOf(callback);
      if (index > -1) {
        this.messageListeners.splice(index, 1);
      }
    };
  }

  // Add listener for connection status changes
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.connectionListeners.indexOf(callback);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }
  // onNewRideRequest(callback: (data: any) => void): () => void {
  //   if (!this.socket) {
  //     console.warn(
  //       "⚠️ Socket not initialized, cannot listen for new ride requests"
  //     );
  //     return () => {};
  //   }

  //   const handler = (data: any) => {
  //     console.log("📥 New ride request for driver:", data);
  //     callback(data);
  //   };

  //   this.socket.on("new-ride-request-for-driver", handler);

  //   // Return an unsubscribe function
  //   return () => {
  //     this.socket?.off("new-ride-request-for-driver", handler);
  //   };
  // }

  // Update rider's current location while on a trip
  updateRiderLocation(location: IRiderLocation): void {
    if (!this.socket || !this.isConnected) {
      console.error("❌ WebSocket not connected, cannot update rider location");
      return;
    }

    console.log("📍 Updating rider location via WebSocket:", location);

    // Use acknowledgement to get server response
    this.socket.emit(
      "update-rider-current-location",
      location,
      (response: any) => {
        if (response?.success) {
          console.log(
            "✅ Rider location update acknowledged by server:",
            response
          );
        } else {
          console.error("❌ Server rejected location update:", response);
        }
      }
    );
  }

  // Get connection status
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  // Reconnect if disconnected
  reconnect(): void {
    if (this.currentUserId && !this.isConnected) {
      console.log("🔄 Attempting to reconnect WebSocket");
      this.connect(this.currentUserId);
    }
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();

// Export types
export type { IReceivedMessage, IRiderLocation, IsentMessage };
