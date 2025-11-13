// Button/index.tsx

import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { ButtonProps } from "./interfaces";
import { buttonStyles } from "./styles";

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle
}) => {
  // Combine button styles
  const buttonStyle = [
    buttonStyles.base,
    buttonStyles.variants[variant],
    buttonStyles.sizes[size],
    fullWidth && buttonStyles.fullWidth,
    disabled && buttonStyles.disabled,
    style,
  ];

  // Combine text styles
  const textStyleCombined = [
    buttonStyles.baseText,
    buttonStyles.variantTexts[variant],
    buttonStyles.sizeTexts[size],
    disabled && buttonStyles.disabledText,
    textStyle,
  ];

  // Determine loading indicator color
  const loadingColor =
    variant === "outline" || variant === "ghost" ? "#3853A4" : "#FFFFFF";

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor} />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyleCombined}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;