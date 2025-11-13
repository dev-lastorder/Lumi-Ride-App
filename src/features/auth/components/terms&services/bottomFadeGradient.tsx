import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

interface BottomFadeGradientProps {
  isVisible: boolean;
  height?: number;
}

export default function BottomFadeGradient({ 
  isVisible, 
  height = 120 
}: BottomFadeGradientProps) {
  if (!isVisible) return null;

  return (
    <LinearGradient
      colors={[
        'rgba(255, 255, 255, 0)', 
        'rgba(255, 255, 255, 0.9)', 
        'rgba(255, 255, 255, 1)'
      ]}
      style={[styles.gradient, { height }]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
});