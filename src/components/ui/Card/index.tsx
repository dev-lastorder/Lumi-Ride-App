// Card/index.tsx

import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
    CardContentProps,
    CardFooterProps,
    CardHeaderProps,
    CardImageProps,
    CardProps,
} from './interfaces';
import { cardStyles } from './styles';

// Main Card Component
const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  radius = 'medium',
  backgroundColor,
  onPress,
  disabled = false,
  style,
}) => {
  // Combine card styles
  const cardStyle = [
    cardStyles.card,
    cardStyles.variants[variant],
    cardStyles.paddings[padding],
    cardStyles.radius[radius],
    backgroundColor && { backgroundColor },
    disabled && cardStyles.disabled,
    style,
  ];

  // If pressable, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Otherwise, return regular View
  return <View style={cardStyle}>{children}</View>;
};

// Card Header Component
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  action,
  style,
}) => {
  return (
    <View style={[cardStyles.header.container, style]}>
      {/* Avatar */}
      {avatar && (
        <View style={cardStyles.header.avatar}>
          {avatar}
        </View>
      )}

      {/* Text Container */}
      <View style={cardStyles.header.textContainer}>
        <Text style={cardStyles.header.title}>{title}</Text>
        {subtitle && (
          <Text style={cardStyles.header.subtitle}>{subtitle}</Text>
        )}
      </View>

      {/* Action */}
      {action && (
        <View style={cardStyles.header.action}>
          {action}
        </View>
      )}
    </View>
  );
};

// Card Content Component
export const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[cardStyles.content.container, style]}>
      {children}
    </View>
  );
};

// Card Footer Component
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[cardStyles.footer.container, style]}>
      {children}
    </View>
  );
};

// Card Image Component
export const CardImage: React.FC<CardImageProps> = ({
  source,
  height = 200,
  resizeMode = 'cover',
  style,
}) => {
  return (
    <Image
      source={source}
      style={[cardStyles.image.image, { height }, style]}
      resizeMode={resizeMode}
    />
  );
};

export default Card;