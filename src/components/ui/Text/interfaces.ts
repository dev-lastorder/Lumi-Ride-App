// Text/interfaces.ts

import { TextAlign, TextColor, TextVariant, TextWeight } from './types';

export interface CustomTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
  color?: TextColor;
  italic?: boolean;
  underline?: boolean;
  lineThrough?: boolean;
  uppercase?: boolean;
  numberOfLines?: number;
  style?: any;
  onPress?: () => void;
}