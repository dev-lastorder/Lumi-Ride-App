// Input/interfaces.ts

import { KeyboardTypeOptions, ReturnKeyTypeOptions } from 'react-native';
import { InputSize, InputType, InputVariant } from './types';

export interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  type?: InputType;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  errorMessage?: string;
  showErrorMessage?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  autoFocus?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  secureTextEntry?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  style?: any;
  inputStyle?: any;
  containerStyle?: any;
}