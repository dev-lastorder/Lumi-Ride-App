
import { useTheme } from '@/src/context/ThemeContext';
import useCurrentZone from '@/src/hooks/useCurrentZone';
import { useDriverLocation } from '@/src/hooks/useDriverLocation';
import { useAppSelector } from '@/src/store/hooks';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyStateProps {
  isOnline: boolean;
  title?: string;
  description?: string;
}

export const OfflineScreen: React.FC<EmptyStateProps> = ({ isOnline, title, description }) => {
  const { colors } = useTheme();
  const { latitude, longitude ,hasLocation} = useAppSelector((state) => state.driverLocation);
  const { zone, loading } = useCurrentZone();
  //   const latitude = 31.5204;
  // const longitude = 74.3587;

  const { requestPermissionAndFetchLocation, startLocationTracking } = useDriverLocation();

  // useEffect(() => {
  //   (async () => {
  //     const granted = await requestPermissionAndFetchLocation();
  //     // if (granted) startLocationTracking();
  //   })();
  // }, []);

  const checkingStatus = isOnline && !!latitude && !!longitude;
  // const hasLocation = !!latitude && !!longitude;


  // console.log("checkingStatus", checkingStatus)


  // console.log('Latitude:', latitude);
  // console.log('Longitude:', longitude);


  const handleGoToSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  

  if (!hasLocation) {
    return (
      <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          <View style={[styles.illustration]}>
            <Image
              source={require('@/assets/images/turnOnLocation.png')} 
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Turn your location on</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Your location info in needed to find ride requests in your current area
        </Text>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: '#4F46E5' }]}
          onPress={handleGoToSettings}
        >
          <Text style={styles.settingsButtonText}>Go to settings</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (hasLocation && !isOnline) {
    return (
      <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          <View style={[styles.illustration]}>
            {/* <Image
            source={require('@/assets/images/goOnline.png')} // you can create or use any placeholder
            style={styles.carImage}
            resizeMode="contain"
          /> */}
          </View>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>You’re offline</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Turn yourself online to start receiving ride requests nearby.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="car-outline" size={64} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title ?? 'No Active Requests'}</Text>


      {/* Show zone error if it exists */}
      {zone && zone.toLowerCase().includes('outside the valid service zone') ? (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {zone}
        </Text>
      ) : (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description ??
            `You're online and ready to accept rides.\nNew requests will appear here automatically.`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  illustrationContainer: {
    marginBottom: 40,
  },
  illustration: {
    width: 280,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  settingsButton: {
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    maxWidth: 400,
  },
  settingsButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OfflineScreen;