import { CustomIcon } from "@/src/components/ui/Icon";
import CustomText from "@/src/components/ui/Text";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { maskNumber } from "@/src/utils/helper";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const paymentMethodCard = ({
  name,
  number,
  isDefault = false,
  onPress,
}: {
  name?: string;
  number: string;
  isDefault?: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.flexRowCenter,
        globalStyles.containerPadding,
        { paddingVertical: 12 },
      ]}
    >
      <View style={styles.flexRowCenter}>
        <View
          style={[
            styles.paymentImageContainer,
            { backgroundColor: theme.colors.colorBg,  borderColor: theme.colors.colorBorder},
          ]}
        >
          <CustomIcon icon={{ name:name, type: "FontAwesome5" }} />
        </View>
        <CustomText>{maskNumber(number, 4)}</CustomText>
        {isDefault && (
          <View
            style={[
              styles.defaultLabel,
              { backgroundColor: theme.colors.colorBgSecondary },
            ]}
          >
            <CustomText>Default</CustomText>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={onPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <CustomIcon icon={{ name: "dots-three-vertical", type: "Entypo",size: 18 }} />
      </TouchableOpacity>
    </View>
  );
};

export default paymentMethodCard;

const styles = StyleSheet.create({
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
  },
  paymentImageContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: 46,
    height: 32,
    borderWidth: 1,
  },
  defaultLabel: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
});
