// Input/index.tsx

import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CustomInputProps } from './interfaces';
import { inputStyles } from './styles';

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  variant = 'outline',
  size = 'medium',
  type = 'text',
  disabled = false,
  readOnly = false,
  error,
  errorMessage,
  showErrorMessage = true,
  helperText,
  leftIcon,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  autoFocus = false,
  returnKeyType,
  secureTextEntry = false,
  onFocus,
  onBlur,
  onSubmitEditing,
  style,
  inputStyle,
  containerStyle,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Determine keyboard type based on input type
  const getKeyboardType = () => {
    if (keyboardType) return keyboardType;
    
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  // Handle focus
  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  // Handle blur
  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  // Determine if password should be hidden
  const isSecure = type === 'password' && !showPassword;

  // Combine container styles
  const containerCombinedStyle = [
    inputStyles.container,
    containerStyle,
  ];

  // Combine input container styles
  const inputContainerStyle = [
    inputStyles.inputContainer,
    inputStyles.variants[variant],
    inputStyles.sizes[size],
    focused && (variant === 'underline' 
      ? inputStyles.states.focusedUnderline 
      : inputStyles.states.focused),
    (error || errorMessage) && (variant === 'underline'
      ? inputStyles.states.errorUnderline
      : inputStyles.states.error),
    disabled && inputStyles.states.disabled,
    style,
  ];

  // Combine input text styles
  const inputTextStyle = [
    inputStyles.input,
    inputStyles.variantInputs[variant],
    inputStyles.sizeInputs[size],
    disabled && inputStyles.states.disabledText,
    inputStyle,
  ];

  return (
    <View style={containerCombinedStyle}>
      {/* Label */}
      {label && (
        <Text style={inputStyles.label}>{label}</Text>
      )}

      {/* Input Container */}
      <View style={inputContainerStyle}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={inputStyles.iconContainer}>
            {leftIcon}
          </View>
        )}

        {/* Text Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          style={inputTextStyle}
          editable={!disabled && !readOnly}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          keyboardType={getKeyboardType()}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry || isSecure}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
        />

        {/* Password Toggle Icon */}
        {type === 'password' && (
          <TouchableOpacity
            style={inputStyles.iconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{ fontSize: 20 }}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Right Icon */}
        {rightIcon && type !== 'password' && (
          <View style={inputStyles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>

      {/* Helper Text */}
      {helperText && !error && !errorMessage && (
        <Text style={inputStyles.helperText}>{helperText}</Text>
      )}

      {/* Error Message */}
      {(error || errorMessage) && showErrorMessage && (
        <Text style={inputStyles.errorText}>
          {error || errorMessage}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;