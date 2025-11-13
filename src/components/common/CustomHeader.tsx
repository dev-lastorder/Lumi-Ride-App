import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomText from "../ui/Text";

interface CustomHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  isTitleVisible?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  isTitleVisible = true,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else navigation.goBack();
  };

  return (
    <View
      style={[
        styles.headerContainer,
        globalStyles.containerPadding,
        { paddingTop: insets.top + 5, paddingBottom: 16 },
      ]}
    >
      {showBackButton ? (
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={{
            backgroundColor: theme.colors.colorBgTertiary,
            padding: 5,
            borderRadius: "100%",
          }}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.colorIcon} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 22 }} />
      )}
      {isTitleVisible && (
        <CustomText
          variant="h4"
          weight="semibold"
          style={{ color: theme.colors.colorText }}
        >
          {title}
        </CustomText>
      )}
      <View style={{ width: 22 }} />
    </View>
  );
};

export default React.memo(CustomHeader);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 28,
  },
});
