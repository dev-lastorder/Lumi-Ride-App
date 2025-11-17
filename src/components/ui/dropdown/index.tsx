// src/components/ui/dropdown/index.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { CustomDropdownProps } from './interfaces';

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  items,
  onChange,
  placeholder = 'Select an option',
  variant = 'outline',
  size = 'medium',
  disabled = false,
  error,
  errorMessage,
  showErrorMessage = true,
  helperText,
  onBlur,
  containerStyle,
  open,
  setOpen,
}) => {
  // Get height based on size
  const getHeight = () => {
    if (size === 'small') return 36;
    if (size === 'large') return 52;
    return 44;
  };

  // Get styles based on variant
  const getDropdownStyle = () => {
    const baseStyle: any = {
      minHeight: getHeight(),
      borderRadius: 8,
    };

    if (variant === 'outline') {
      baseStyle.borderColor = (error || errorMessage) ? '#DC3545' : '#D1D5DB';
      baseStyle.borderWidth = 1;
      baseStyle.backgroundColor = '#FFFFFF';
    } else if (variant === 'filled') {
      baseStyle.borderWidth = 0;
      baseStyle.backgroundColor = '#F3F4F6';
    } else if (variant === 'underline') {
      baseStyle.borderWidth = 0;
      baseStyle.borderBottomWidth = 1;
      baseStyle.borderBottomColor = (error || errorMessage) ? '#DC3545' : '#D1D5DB';
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderRadius = 0;
    }

    return baseStyle;
  };

  const getDropdownContainerStyle = () => {
    return {
      borderColor: (error || errorMessage) ? '#DC3545' : '#D1D5DB',
    };
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Dropdown */}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = typeof callback === 'function' ? callback(value) : callback;
          onChange(newValue);
        }}
        setItems={() => { }}
        placeholder={placeholder}
        disabled={disabled}
        style={getDropdownStyle()}
        dropDownContainerStyle={getDropdownContainerStyle()}
        textStyle={styles.text}
        placeholderStyle={styles.placeholder}
        listMode="SCROLLVIEW"
        dropDownDirection="BOTTOM"
        onClose={() => onBlur?.()}
        zIndex={2000}
        zIndexInverse={3000}
      />


      {/* Helper Text */}
      {helperText && !error && !errorMessage && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {/* Error Message */}
      {(error || errorMessage) && showErrorMessage && (
        <Text style={styles.errorText}>{error || errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  text: {
    fontSize: 16,
    color: '#111827',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    color: '#DC3545',
  },
});

export default CustomDropdown;