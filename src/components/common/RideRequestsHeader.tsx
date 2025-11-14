import { useTheme } from '@/src/context/ThemeContext';
import { useDriverStatus } from '@/src/hooks/useDriverStatus';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RideRequestsHeader: React.FC = () => {
  const { colors } = useTheme();
  const { driverStatus, toggleDriverStatus } = useDriverStatus();
  
  // Animation for toggle switch
  const toggleAnimation = useRef(new Animated.Value(driverStatus === 'online' ? 1 : 0)).current;

  // Sync animation with status changes
  useEffect(() => {
    const targetValue = driverStatus === 'online' ? 1 : 0;
    
    // Use timing animation for better Android performance
    Animated.timing(toggleAnimation, {
      toValue: targetValue,
      duration: Platform.OS === 'android' ? 200 : 300,
      useNativeDriver: true,
    }).start();
  }, [driverStatus, toggleAnimation]);

  const handleStatusToggle = () => {
    // Toggle status first, animation will follow via useEffect
    toggleDriverStatus();
  };

  
  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <StatusBar
        barStyle={colors.GRADIENT_COLORS[0] === '#DAD5FB' ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <View style={styles.content}>
        {/* Left Section - Menu Button */}
        {/* <TouchableOpacity style={[styles.menuButton, { backgroundColor: colors.card }]}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity> */}

        {/* Center Section - Toggle Switch */}
        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={handleStatusToggle}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleBackground, { backgroundColor: colors.border }]}>
            {/* Labels */}
            <View style={styles.toggleLabels}>
              <Text style={[styles.toggleLabel, { color: colors.textTertiary }, driverStatus === 'offline' && styles.toggleLabelActive]}>
                Offline
              </Text>
              <Text style={[styles.toggleLabel, { color: colors.textTertiary }, driverStatus === 'online' && styles.toggleLabelActive]}>
                Online
              </Text>
            </View>
            
            {/* Sliding Indicator */}
            <Animated.View
              style={[
                styles.toggleIndicator,
                {
                  backgroundColor: driverStatus === 'online' ? '#10B981' : '#EF4444',
                  transform: [
                    {
                      translateX: toggleAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 80],
                        extrapolate: 'clamp', // Prevent over-animation on Android
                      }),
                    },
                  ],
                },
              ]}
              renderToHardwareTextureAndroid={true} // Android optimization
              shouldRasterizeIOS={true} // iOS optimization
            >
              <Text style={styles.toggleIndicatorText}>
                {driverStatus === 'online' ? 'Online' : 'Offline'}
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Right Section - Settings Button */}
        {/* <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.card }]}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 10 : StatusBar.currentHeight || 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,        
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    position: 'relative',
  },
  toggleBackground: {
    width: 180,
    height: 44,
    borderRadius: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
    textAlign: 'center',
  },
  toggleLabelActive: {
    color: '#FFF',
  },
  toggleIndicator: {
    position: 'absolute',
    width: 90,
    height: 40,
    borderRadius: 20,
    top: 2,
    left: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 5 : 3, // Higher elevation for Android
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      borderWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.1)',
    }),
  },
  toggleIndicatorText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RideRequestsHeader;
