// Card/styles.ts

import { StyleSheet } from 'react-native';

// Base styles
const baseStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  pressable: {
    opacity: 1,
  },
  disabled: {
    opacity: 0.6,
  },
});

// Variant styles
const variantStyles = StyleSheet.create({
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  filled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
});

// Padding styles
const paddingStyles = StyleSheet.create({
  none: {
    padding: 0,
  },
  small: {
    padding: 8,
  },
  medium: {
    padding: 16,
  },
  large: {
    padding: 24,
  },
});

// Radius styles
const radiusStyles = StyleSheet.create({
  none: {
    borderRadius: 0,
  },
  small: {
    borderRadius: 4,
  },
  medium: {
    borderRadius: 8,
  },
  large: {
    borderRadius: 16,
  },
  full: {
    borderRadius: 999,
  },
});

// Card Header styles
const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  action: {
    marginLeft: 12,
  },
});

// Card Content styles
const contentStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

// Card Footer styles
const footerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 8,
  },
});

// Card Image styles
const imageStyles = StyleSheet.create({
  image: {
    width: '100%',
  },
});

// Export combined styles
export const cardStyles = {
  card: baseStyles.card,
  pressable: baseStyles.pressable,
  disabled: baseStyles.disabled,
  variants: variantStyles,
  paddings: paddingStyles,
  radius: radiusStyles,
  header: headerStyles,
  content: contentStyles,
  footer: footerStyles,
  image: imageStyles,
};