import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import { MiniProfileCardProps } from "../types";

const MiniPofileCard = ({
  userDetails,
}: {
  userDetails: MiniProfileCardProps;
}) => {
  const theme = useTheme();
  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Image style={styles.image} source={{ uri: userDetails.profile }} />
        <View>
          <CustomText
            variant="bodyLarge"
            weight="semibold"
            style={{ color: theme.colors.colorText }}
          >
            {userDetails.name}
          </CustomText>
          <CustomText
            variant="caption"
            weight="medium"
            style={{ color: theme.colors.colorTextMuted }}
          >
            {userDetails.email}
          </CustomText>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <View style={styles.starComponent}>
          <AntDesign name="star" size={20} color={theme.colors.yellow} />
          <CustomText
            variant="bodyLarge"
            weight="semibold"
            style={{ color: theme.colors.colorText }}
          >
            {userDetails.rating}
          </CustomText>
        </View>
        {Number(userDetails.totalReviews) > 0 && (
          <CustomText
            variant="caption"
            weight="medium"
            style={{ color: theme.colors.gray800 }}
          >
            <CustomText
              variant="caption"
              weight="medium"
              style={{ color: theme.colors.gray800 }}
            >
              {userDetails.totalReviews}
            </CustomText>
          </CustomText>
        )}
      </View>
    </View>
  );
};

export default MiniPofileCard;

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  ratingContainer: {
    alignItems: "center",
    gap: 6,
  },
  starComponent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
