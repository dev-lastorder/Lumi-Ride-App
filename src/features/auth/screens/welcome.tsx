import { useTheme } from '@/src/context/ThemeContext';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthActionButtons from '../components/welcome/AuthActionsButtons';
import AuthHeader from '../components/welcome/AuthHeader';

const WelcomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme(); // Get theme colors

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.BACKGROUND, // Dynamic background (white/dark)
          paddingTop: insets.top + 40, 
          paddingBottom: insets.bottom + 40 
        }
      ]}
    >
      {/* Background Image */}
      <Image 
        source={require("@/src/assets/images/roundedBg.png")}
        style={styles.backgroundImage}
        resizeMode='cover' 
      />

      {/* Top Section - Logo and subtitle */}
      <View style={styles.topSection}>
        <AuthHeader 
          subtitle="Are you ready to talk?"
          showSubtitle={true}
        />
      </View>

      {/* Bottom Section - Action buttons */}
      <View style={styles.bottomSection}>
        <AuthActionButtons />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'space-between',
    paddingHorizontal: 24, 
    // backgroundColor removed - using theme colors dynamically
    position: 'relative',
    overflow: 'visible', 
  },
  backgroundImage: {
    position: 'absolute', 
    width: 240,
    height: 600, 
    right: 0, 
    top: 40,
    opacity: 0.3, // Subtle decorative element
  },
  topSection: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1, 
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 20,
    zIndex: 1, 
  },
});

export default WelcomeScreen;