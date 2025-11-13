import { ButtonSize, ButtonVariant } from "./types";

export interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    style?: any;
    textStyle?: any;
  }
  
  export interface IconButtonProps {
    onPress: () => void;
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: number;
    disabled?: boolean;
    style?: any;
  }
  
  export interface ButtonStyleConfig {
    base: any;
    baseText: any;
    variants: Record<ButtonVariant, any>;
    variantTexts: Record<ButtonVariant, any>;
    sizes: Record<ButtonSize, any>;
    sizeTexts: Record<ButtonSize, any>;
    disabled: any;
    disabledText: any;
    fullWidth: any;
  }
