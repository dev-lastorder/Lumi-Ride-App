// Text/index.tsx

import React from 'react';
import { Text as RNText, TouchableOpacity } from 'react-native';
import { CustomTextProps } from './interfaces';
import { textStyles } from './styles';

const CustomText: React.FC<CustomTextProps> = ({
  children,
  variant = 'body',
  weight,
  align,
  color,
  italic = false,
  underline = false,
  lineThrough = false,
  uppercase = false,
  numberOfLines,
  style,
  onPress,
}) => {
  // Combine text styles
  const combinedStyle = [
    textStyles.variants[variant],
    weight && textStyles.weights[weight],
    align && textStyles.aligns[align],
    color && textStyles.colors[color],
    italic && textStyles.decorations.italic,
    underline && textStyles.decorations.underline,
    lineThrough && textStyles.decorations.lineThrough,
    uppercase && textStyles.decorations.uppercase,
    style,
  ];

  // If onPress is provided, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <RNText style={combinedStyle} numberOfLines={numberOfLines}>
          {children}
        </RNText>
      </TouchableOpacity>
    );
  }

  // Otherwise, return regular Text
  return (
    <RNText style={combinedStyle} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

export default CustomText;