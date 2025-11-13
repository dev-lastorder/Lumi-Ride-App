import CustomText from "@/src/components/ui/Text";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface QuickReplyButton {
  id: string;
  text: string;
}

interface QuickReplyButtonsProps {
  buttons: QuickReplyButton[];
  onPress: (button: QuickReplyButton) => void;
}

const QuickReplyButtons: React.FC<QuickReplyButtonsProps> = ({
  buttons,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <TouchableOpacity
          key={button.id}
          style={styles.button}
          onPress={() => onPress(button)}
          activeOpacity={0.7}
        >
          <CustomText style={styles.buttonText}>{button.text}</CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuickReplyButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
    justifyContent: "flex-end", // Align to right side
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#1691BF",
  },
  buttonText: {
    fontSize: 15,
    color: "#09090B",
    fontWeight: "400",
  },
});