import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { Image, StyleSheet, View } from 'react-native';

interface PaymentDetailsCardProps {
  method: string;
}

const PaymentDetailsCard = ({ details }: { details: PaymentDetailsCardProps }) => {
  const cashImage = require('@/src/assets/images/cash.png')
  const theme = useTheme()
  return (
    <View style={styles.container}>
      <CustomText style={{color: theme.colors.colorTextMuted}}>
        Payment
      </CustomText>

      <View style={styles.paymentContainer}>
        <Image source={cashImage} style={styles.image} resizeMode='contain' />
        <CustomText>{details.method}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    gap: 12,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default PaymentDetailsCard;