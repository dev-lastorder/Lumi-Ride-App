// src/components/ui/dropdown/interfaces.ts

import { ViewStyle } from 'react-native';
import { DropdownItem, DropdownSize, DropdownVariant } from './types';

export interface CustomDropdownProps {
  label?: string;
  value: string | number | null;
  items: DropdownItem[];
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  variant?: DropdownVariant;
  size?: DropdownSize;
  disabled?: boolean;
  error?: string;
  errorMessage?: string;
  showErrorMessage?: boolean;
  helperText?: string;
  onBlur?: () => void;
  containerStyle?: ViewStyle;
  open: boolean;
  setOpen: (open: boolean) => void;
}