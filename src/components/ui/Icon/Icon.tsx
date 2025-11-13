import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';
import React, { memo } from 'react';

import { useTheme } from '@/src/context/ThemeContext';
import { ICustomIconComponentProps } from '@/src/types';
import { Text } from 'react-native';

const ICON_MAP = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Fontisto,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

const CustomIconComponent = ({ icon, className, textStyle, isDefaultColor = true, rest }: ICustomIconComponentProps) => {
  
  const currentTheme = useTheme()
  const defaultColor = currentTheme.colors.colorIcon

  const { size = 24, color } = icon;
  const type = icon.type ?? 'AntDesign';
  const Icon = ICON_MAP[type as keyof typeof ICON_MAP] ?? AntDesign;

  const iconProps: any = {
    name: icon.name,
    size,
    ...(isDefaultColor && !className ? { color: color ?? defaultColor } : {}),
  };

  return className ? (
    <Text  className={className} style={textStyle}>
      <Icon {...iconProps} {...rest} />
    </Text>
  ) : (
    <Icon {...iconProps} />
  );
};

export const CustomIcon = memo(CustomIconComponent);
