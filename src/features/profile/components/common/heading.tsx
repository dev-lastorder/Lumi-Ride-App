import CustomText from "@/src/components/ui/Text";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import React from "react";
import { View } from "react-native";

const heading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const theme = useTheme();

  return (
    <View style={[globalStyles.containerPadding, { paddingVertical: 12 }]}>
      <CustomText variant="h1" style={{ color: theme.colors.colorText }}>
        {title}
      </CustomText>
      <CustomText
        variant="bodySmall"
        style={{ color: theme.colors.colorTextMuted }}
      >
        {description}
      </CustomText>
    </View>
  );
};

export default heading;
