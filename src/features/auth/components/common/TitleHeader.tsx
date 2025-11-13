import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface TitleProps {
  heading: string;
  subheading: string;
  headingStyle?: TextStyle;
  subheadingStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const Title: React.FC<TitleProps> = ({ 
  heading, 
  subheading, 
  headingStyle, 
  subheadingStyle,
  containerStyle 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.heading, headingStyle]}>
        {heading}
      </Text>
      <Text style={[styles.subheading, subheadingStyle]}>
        {subheading}
      </Text>
    </View>
  );
};

export default Title;

interface Styles {
  container: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3853A4',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#969696',
    fontWeight: '400',
  },
});