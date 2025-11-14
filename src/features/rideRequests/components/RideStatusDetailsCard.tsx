import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { StyleSheet, View } from "react-native";

interface RideStatusDetailsCardProps {
  status: string;
}

const RideStatusDetailsCard = ({
  details,
}: {
  details: RideStatusDetailsCardProps;
}) => {
  const theme = useTheme();
  const bgColor = () => {
    if (details.status === "Scheduled") {
      return "#FEFCE8";
    } else if (details.status === "Completed") {
      return "#F0FDF4";
    } else {
      return "#FEF2F2";
    }
  };
  const textColor = () => {
    if (details.status == "Scheduled" || details.status == "ASSIGNED") {
      return "#A16207";
    } else if (details.status == "Completed") {
      return "#047857";
    } else {
      return "#DC2626";
    }
  };
  return (
    <View style={styles.container}>
      <CustomText style={{ color: theme.colors.colorTextMuted }}>
        Ride status
      </CustomText>

      <View style={[styles.statusContainer, { backgroundColor: bgColor() }]}>
        <CustomText
          weight="semibold"
          style={{ color: theme.colors.colorTextMuted }}
        >
          {details.status}
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
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
});

export default RideStatusDetailsCard;
