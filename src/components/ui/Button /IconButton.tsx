// Button/IconButton.tsx

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { IconButtonProps } from './interfaces';
import { iconButtonStyles } from './styles';

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon,
  variant = 'primary',
  size = 50,
  disabled = false,
  style,
}) => {
  // Variant colors
  const variantColors = {
    primary: '#007AFF',
    secondary: '#6C757D',
    danger: '#DC3545',
  };

  // Combine styles
  const buttonStyle = [
    iconButtonStyles.button,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: variantColors[variant],
    },
    disabled && iconButtonStyles.disabled,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default IconButton;