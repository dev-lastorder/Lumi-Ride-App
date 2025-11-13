// src/components/common/BackButton.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  iconSize?: number;
  iconColor?: string;
  size?: number; // button width & height (default 56)
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  style,
  iconSize = 24,
  iconColor = '#000000',
  size = 56,
  borderColor = '#D1D5DB', // gray-300
  borderWidth = 1,
  backgroundColor = 'transparent',
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) onPress();
    else router.back();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          borderWidth,
          backgroundColor,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
