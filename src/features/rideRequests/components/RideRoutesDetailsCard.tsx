import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { Image, StyleSheet, View } from 'react-native';

interface RideRoutesDetailsCardProps {
  startLocation: string;
  endLocation: string;
}

const RideRoutesDetailsCard = ({ details }: { details: RideRoutesDetailsCardProps }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <CustomText style={{color: theme.colors.colorTextMuted}}>
        Your ride route
      </CustomText>

      <View style={styles.routeContainer}>
        <Image 
          source={require('@/assets/images/toIcon.png')} 
          style={styles.icon} 
          resizeMode="contain" 
        />
        <CustomText>{details.startLocation}</CustomText>
      </View>
      <View style={styles.routeContainer}>
        <Image 
          source={require('@/assets/images/fromIcon.png')} 
          style={styles.icon} 
          resizeMode="contain" 
        />
        <CustomText>{details.endLocation}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    gap: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default RideRoutesDetailsCard;