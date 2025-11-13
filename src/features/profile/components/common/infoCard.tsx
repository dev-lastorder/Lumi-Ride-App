import { CustomIcon } from "@/src/components/ui/Icon";
import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { handleTruncate } from "@/src/utils/helper";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const infoCard = ({
  title,
  description,
  onPress,
  icon
}: {
  title: string;
  description: string;
    onPress?: () => void;
    icon?: string;
}) => {
  const theme = useTheme();

  const getIconConfig = (icon?:string) => {
    switch (icon) {
      case "user":
        return { name: "user", type: "Feather" };
      case "card":
        return { name: "credit-card", type: "Feather" };
      case "support":
        return { name: "support", type: "SimpleLineIcons" };
      case "security":
        return { name: "settings", type: "Feather" };
      default:
        return { name: "user", type: "Feather" };
    }
  };

  const iconConfig = getIconConfig(icon);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <CustomIcon
          icon={{
            ...iconConfig,
            size: 24,
          }}
        />

        <View>
          <CustomText
            variant="body"
            weight="medium"
            style={{ color: theme.colors.colorText }}
          >
            {title}
          </CustomText>
          <CustomText
            variant="caption"
            weight="medium"
            style={{ color: theme.colors.colorTextMuted }}
          >
            {handleTruncate(35, description)}
          </CustomText>
        </View>
      </View>
      <AntDesign name="right" size={20} color={theme.colors.colorIcon} />
    </TouchableOpacity>
  );
};

export default infoCard;

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
