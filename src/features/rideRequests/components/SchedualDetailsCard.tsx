import { CustomIcon } from "@/src/components/ui/Icon";
import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { StyleSheet, View } from 'react-native';

interface SchedualDetailsCardProps {
  day: string;
  time: string;
}

const SchedualDetailsCard = ({ details }: { details: SchedualDetailsCardProps }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <CustomText style={{color: theme.colors.colorTextMuted}}>
        Schedual for
      </CustomText>

      <View style={styles.scheduleContainer}>
        <CustomIcon icon={{ type: 'MaterialCommunityIcons', name: 'calendar-month-outline', size: 25 }} />
        <CustomText>
          {details.day}. {details.time}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    gap: 12,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default SchedualDetailsCard;