// src/components/common/GradientBackground/GradientBackground.tsx
import { useTheme } from '@/src/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}



export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  className,
}) => {
   const { colors, theme, toggleTheme } = useTheme();
  return (
    <LinearGradient
      colors={colors.GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}    // Start from top
      end={{ x: 0, y: 1 }}      // End at bottom
      style={[{ flex: 1 }, style]}  // <- Add flex: 1 here explicitly
      className={className}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;