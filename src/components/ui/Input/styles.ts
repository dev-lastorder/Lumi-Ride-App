// Input/styles.ts

import { StyleSheet } from 'react-native';

// Base styles
const baseStyles = StyleSheet.create({
  container: {
    marginVertical: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333333',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    color: '#DC3545',
  },
  iconContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Variant styles
const variantStyles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  filled: {
    borderWidth: 0,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
  },
  underline: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    borderRadius: 0,
  },
});

// Variant input styles
const variantInputStyles = StyleSheet.create({
  outline: {
    paddingVertical: 12,
  },
  filled: {
    paddingVertical: 12,
  },
  underline: {
    paddingVertical: 8,
  },
});

// Size styles
const sizeStyles = StyleSheet.create({
  small: {
    minHeight: 36,
  },
  medium: {
    minHeight: 44,
  },
  large: {
    minHeight: 52,
  },
});

// Size input styles
const sizeInputStyles = StyleSheet.create({
  small: {
    fontSize: 14,
    paddingVertical: 8,
  },
  medium: {
    fontSize: 16,
    paddingVertical: 10,
  },
  large: {
    fontSize: 18,
    paddingVertical: 12,
  },
});

// State styles
const stateStyles = StyleSheet.create({
  focused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  focusedUnderline: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
  error: {
    borderColor: '#DC3545',
  },
  errorUnderline: {
    borderBottomColor: '#DC3545',
  },
  disabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.6,
  },
  disabledText: {
    color: '#999999',
  },
});

// Export combined styles
export const inputStyles = {
  container: baseStyles.container,
  inputContainer: baseStyles.inputContainer,
  input: baseStyles.input,
  label: baseStyles.label,
  helperText: baseStyles.helperText,
  errorText: baseStyles.errorText,
  iconContainer: baseStyles.iconContainer,
  variants: variantStyles,
  variantInputs: variantInputStyles,
  sizes: sizeStyles,
  sizeInputs: sizeInputStyles,
  states: stateStyles,
};