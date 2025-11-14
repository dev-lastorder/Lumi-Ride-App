import { CustomIcon } from "@/src/components/ui/Icon";
import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { StyleSheet, View } from "react-native";

const InstructionDetailsCard = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <CustomText variant="bodyLarge" weight="semibold">
        Things to keep in mind
      </CustomText>

      <View style={styles.itemContainer}>
        <CustomIcon
          icon={{ type: "FontAwesome", name: "hourglass-o", size: 22 }}
        />
        <View style={styles.textContainer}>
          <CustomText weight="semibold">Wait time</CustomText>
          <CustomText style={{ color: theme.colors.colorTextMuted }}>
            5 minutes of wait time included to meet your ride.
          </CustomText>
        </View>
      </View>

      <View style={styles.itemContainer}>
        <CustomIcon icon={{ type: "Feather", name: "shield", size: 22 }} />
        <View style={styles.textContainer}>
          <CustomText weight="semibold">Cancellation policy</CustomText>
          <CustomText style={{ color: theme.colors.colorTextMuted }}>
            Cancel for free up to 60 minutes before your reservation.
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    gap: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  textContainer: {
    marginTop: -4,
    paddingHorizontal: 4,
  },
});

export default InstructionDetailsCard;
