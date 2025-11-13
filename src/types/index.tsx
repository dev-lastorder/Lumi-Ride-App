import type {
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
import React from 'react';
import { StyleProp, TextStyle, ViewProps } from 'react-native';

export interface IGlobalProps {
  children?: React.ReactNode;
}

interface IIconBaseProps {
  size?: number;
  color?: string;
}


export interface IGlobalComponentProps extends IGlobalProps {
  className?: string;
}


export interface IAntDesignIconProps extends IIconBaseProps {
  type?: 'AntDesign' | 'default';
  name: keyof typeof AntDesign.glyphMap;
}

export interface IEntypoIconProps extends IIconBaseProps {
  type: 'Entypo';
  name: keyof typeof Entypo.glyphMap;
}

export interface IEvilIconsIconProps extends IIconBaseProps {
  type: 'EvilIcons';
  name: keyof typeof EvilIcons.glyphMap;
}

export interface IFeatherIconProps extends IIconBaseProps {
  type: 'Feather';
  name: keyof typeof Feather.glyphMap;
}

export interface IFontistoIconProps extends IIconBaseProps {
  type: 'Fontisto';
  name: keyof typeof Fontisto.glyphMap;
}

export interface IFontAwesomeIconProps extends IIconBaseProps {
  type: 'FontAwesome';
  name: keyof typeof FontAwesome.glyphMap;
}

export interface IFontAwesome5IconProps extends IIconBaseProps {
  type: 'FontAwesome5';
  name: keyof typeof FontAwesome5.glyphMap;
}

export interface IFontAwesome6IconProps extends IIconBaseProps {
  type: 'FontAwesome6';
  name: keyof typeof FontAwesome6.glyphMap;
}

export interface IFoundationIconProps extends IIconBaseProps {
  type: 'Foundation';
  name: keyof typeof Foundation.glyphMap;
}

export interface IIoniconsIconProps extends IIconBaseProps {
  type: 'Ionicons';
  name: keyof typeof Ionicons.glyphMap;
}

export interface IMaterialCommunityIconsIconProps extends IIconBaseProps {
  type: 'MaterialCommunityIcons';
  name: keyof typeof MaterialCommunityIcons.glyphMap;
}

export interface IMaterialIconsIconProps extends IIconBaseProps {
  type: 'MaterialIcons';
  name: keyof typeof MaterialIcons.glyphMap;
}

export interface IOcticonsIconProps extends IIconBaseProps {
  type: 'Octicons';
  name: keyof typeof Octicons.glyphMap;
}

export interface ISimpleLineIconsIconProps extends IIconBaseProps {
  type: 'SimpleLineIcons';
  name: keyof typeof SimpleLineIcons.glyphMap;
}

export interface IZocialIconProps extends IIconBaseProps {
  type: 'Zocial';
  name: keyof typeof Zocial.glyphMap;
}


export type SpecificIconProps =
  | IAntDesignIconProps
  | IEntypoIconProps
  | IEvilIconsIconProps
  | IFeatherIconProps
  | IFontistoIconProps
  | IFontAwesomeIconProps
  | IFontAwesome5IconProps
  | IFontAwesome6IconProps
  | IFoundationIconProps
  | IIoniconsIconProps
  | IMaterialCommunityIconsIconProps
  | IMaterialIconsIconProps
  | IOcticonsIconProps
  | ISimpleLineIconsIconProps
  | IZocialIconProps;
  
export interface ICustomIconComponentProps extends IGlobalComponentProps, ViewProps {
  textStyle?:StyleProp<TextStyle>;
  icon: SpecificIconProps;
  isDefaultColor?: boolean;
  [key: string]: any;
}