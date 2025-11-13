// Text/styles.ts

import { StyleSheet } from 'react-native';

// Variant styles
const variantStyles = StyleSheet.create({
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'normal',
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: 'normal',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

// Weight styles
const weightStyles = StyleSheet.create({
  light: {
    fontWeight: '300',
  },
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
});

// Align styles
const alignStyles = StyleSheet.create({
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  justify: {
    textAlign: 'justify',
  },
});

// Color styles
const colorStyles = StyleSheet.create({
  primary: {
    color: '#007AFF',
  },
  secondary: {
    color: '#6C757D',
  },
  success: {
    color: '#28A745',
  },
  danger: {
    color: '#DC3545',
  },
  warning: {
    color: '#FF9500',
  },
  muted: {
    color: '#8E8E93',
  },
  white: {
    color: '#FFFFFF',
  },
  black: {
    color: '#000000',
  },
});

// Decoration styles
const decorationStyles = StyleSheet.create({
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});

// Export combined styles
export const textStyles = {
  variants: variantStyles,
  weights: weightStyles,
  aligns: alignStyles,
  colors: colorStyles,
  decorations: decorationStyles,
};