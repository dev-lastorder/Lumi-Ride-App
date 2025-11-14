import CustomText from "@/src/components/ui/Text";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  variant?: "default" | "promo";
}

const BottomModal: React.FC<Props> = ({
  visible,
  onClose,
  children,
  title,
  variant = "default",
}) => {
  const insets = useSafeAreaInsets();

  const containerFlex = variant === "promo" ? 0.3 : 0.2;

  return (
    <Modal
      visible={visible}
      animationType={Platform.OS === "android" ? "fade" : "slide"}
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            {
              flex: containerFlex,
              paddingTop: insets.top / 2,
            }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <CustomText>{title}</CustomText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    padding: 4,
  },
});

export default BottomModal;