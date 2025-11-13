import { CustomIcon } from "@/src/components/ui/Icon";
import CustomInput from "@/src/components/ui/Input";
import { InputType } from "@/src/components/ui/Input/types";
import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

const profileFormTextField = ({
  label,
  input,
  setinput,
  placeholder,
  iconName,
  type,
  instructions,
}: {
  label: string;
  input: string;
  placeholder?: string;
  iconName?: string;
  setinput: (text: string) => void;
  type?: InputType;
  instructions?: string;
}) => {
  const theme = useTheme();

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          width: "100%",
        }}
      >
        <View style={{ width: "100%" }}>
          <CustomText
            variant="body"
            weight="medium"
            style={{ color: theme.colors.colorText, lineHeight: 18 }}
          >
            {label}
          </CustomText>
          <CustomInput
            value={input}
            onChangeText={(text) => {
              setinput(text);
            }}
            variant="outline"
            size="medium"
            style={{ borderRadius: 200, width: "100%" }}
            placeholder={placeholder}
            type={type}
            rightIcon={
              iconName ? (
                <CustomIcon
                  icon={{
                    name: iconName,
                    type: "AntDesign",
                    color: theme.colors.colorTextMuted,
                    size: 20,
                  }}
                />
              ) : undefined
            }
            containerStyle={{ marginVertical: 0, marginTop: 8 }}
          />
          {instructions && (
            <CustomText variant="caption">{instructions}</CustomText>
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(profileFormTextField);

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});
