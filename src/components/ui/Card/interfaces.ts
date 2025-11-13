// Card/interfaces.ts

import { CardPadding, CardRadius, CardVariant } from './types';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  backgroundColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  style?: any;
}

export interface CardContentProps {
  children: React.ReactNode;
  style?: any;
}

export interface CardFooterProps {
  children: React.ReactNode;
  style?: any;
}

export interface CardImageProps {
  source: any;
  height?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  style?: any;
}