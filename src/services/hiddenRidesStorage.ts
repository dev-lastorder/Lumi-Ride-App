import AsyncStorage from '@react-native-async-storage/async-storage';

const HIDDEN_RIDES_KEY = 'hidden_rides';

export class HiddenRidesStorage {
  static async getHiddenRides(): Promise<Set<string>> {
    try {
      const hiddenRidesJson = await AsyncStorage.getItem(HIDDEN_RIDES_KEY);
      if (hiddenRidesJson) {
        const hiddenRidesArray = JSON.parse(hiddenRidesJson);
        return new Set(hiddenRidesArray);
      }
      return new Set();
    } catch (error) {
      console.error('Error getting hidden rides:', error);
      return new Set();
    }
  }

  static async hideRide(rideId: string): Promise<void> {
    try {
      const hiddenRides = await this.getHiddenRides();
      hiddenRides.add(rideId);
      await AsyncStorage.setItem(HIDDEN_RIDES_KEY, JSON.stringify([...hiddenRides]));
    } catch (error) {
      console.error('Error hiding ride:', error);
    }
  }

  static async unhideRide(rideId: string): Promise<void> {
    try {
      const hiddenRides = await this.getHiddenRides();
      hiddenRides.delete(rideId);
      await AsyncStorage.setItem(HIDDEN_RIDES_KEY, JSON.stringify([...hiddenRides]));
    } catch (error) {
      console.error('Error unhiding ride:', error);
    }
  }

  static async isRideHidden(rideId: string): Promise<boolean> {
    try {
      const hiddenRides = await this.getHiddenRides();
      return hiddenRides.has(rideId);
    } catch (error) {
      console.error('Error checking if ride is hidden:', error);
      return false;
    }
  }
}