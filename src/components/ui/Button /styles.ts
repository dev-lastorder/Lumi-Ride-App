// Button/styles.ts

import { StyleSheet } from 'react-native';

// Base styles
const baseStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  disabledText: {
    color: '#666666',
  },
  fullWidth: {
    width: '100%',
  },
});

// Variant styles
const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: '#3853A4',
  },
  secondary: {
    backgroundColor: '#6C757D',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3853A4',
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: '#DC3545',
  },
  success: {
    backgroundColor: '#28A745',
  },
  warning: {
    backgroundColor: '#FF9500',
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  gradient: {
    backgroundColor: '#5E35B1',
    shadowColor: '#5E35B1',
    shadowOpacity: 0.3,
    elevation: 5,
  },
});

// Variant text styles
const variantTextStyles = StyleSheet.create({
  primary: {
    color: '#FFFFFF',
  },
  secondary: {
    color: '#FFFFFF',
  },
  outline: {
    color: '#3853A4',
  },
  danger: {
    color: '#FFFFFF',
  },
  success: {
    color: '#FFFFFF',
  },
  warning: {
    color: '#FFFFFF',
  },
  ghost: {
    color: '#3853A4',
  },
  gradient: {
    color: '#FFFFFF',
  },
});

// Size styles
const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});

// Size text styles
const sizeTextStyles = StyleSheet.create({
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
});

// Icon Button Styles
export const iconButtonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
});

// Export combined styles
export const buttonStyles = {
  base: baseStyles.base,
  baseText: baseStyles.baseText,
  variants: variantStyles,
  variantTexts: variantTextStyles,
  sizes: sizeStyles,
  sizeTexts: sizeTextStyles,
  disabled: baseStyles.disabled,
  disabledText: baseStyles.disabledText,
  fullWidth: baseStyles.fullWidth,
};