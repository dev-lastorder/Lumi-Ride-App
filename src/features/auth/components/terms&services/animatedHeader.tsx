import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnimatedHeaderProps {
  scrollY: Animated.Value;
  title: string;
  subtitle: string;
  lastUpdated?: string;
}

export default function AnimatedHeader({ 
  scrollY, 
  title, 
  subtitle, 
  lastUpdated
}: AnimatedHeaderProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get('window');
  const BASE_HEADER_HEIGHT = screenHeight * 0.15;
  const HEADER_HEIGHT = BASE_HEADER_HEIGHT + insets.top;

  const topColor = scrollY.interpolate({
    inputRange: [0, BASE_HEADER_HEIGHT],
    outputRange: ['#DAD5FB', '#ffffff'],
    extrapolate: 'clamp',
  });

  const bottomColor = scrollY.interpolate({
    inputRange: [0, BASE_HEADER_HEIGHT],
    outputRange: ['#fcfcfc', '#ffffff'],
    extrapolate: 'clamp',
  });

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, BASE_HEADER_HEIGHT / 2],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
    extrapolate: 'clamp',
  });

  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <AnimatedGradient
      colors={[topColor, bottomColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.gradientContainer, { height: HEADER_HEIGHT, paddingTop: insets.top }]}
    >
      <Animated.View 
        style={[styles.overlay, { backgroundColor: headerBackgroundColor }]} 
      />
      <View style={styles.contentWrapper}>
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.title}>{title}</Text>
          {lastUpdated && (
            <Text style={styles.lastUpdated}>{lastUpdated}</Text>
          )}
        </View>
      </View>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  subtitle: {
    color: '#9F9F9F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#494949',
    fontSize: 30,
    fontWeight: 'bold',
  },
  lastUpdated: {
    color: '#7C7C7C',
    fontSize: 14,
  },
});