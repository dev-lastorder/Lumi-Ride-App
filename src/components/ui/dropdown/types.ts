// src/components/ui/dropdown/types.ts

export type DropdownSize = 'small' | 'medium' | 'large';

export type DropdownVariant = 'outline' | 'filled' | 'underline';

export interface DropdownItem {
  label: string;
  value: string | number;
  key?: string;
}