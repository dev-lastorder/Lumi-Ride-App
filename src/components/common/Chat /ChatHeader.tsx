import CustomText from "@/src/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface ChatHeaderProps {
  name: string;
  profileImage?: string;
  showBackButton?: boolean;
  showPhoneButton?: boolean;
  showProfileImage?: boolean;
  onBackPress?: () => void;
  onPhonePress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  profileImage,
  showBackButton = true,
  showPhoneButton = true,
  showProfileImage = true,
  onBackPress,
  onPhonePress,
}) => {
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color="#000" />
        </TouchableOpacity>
      )}

      <View style={styles.centerContent}>
        {showProfileImage && (
          profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <CustomText style={styles.placeholderText}>
                {name.charAt(0).toUpperCase()}
              </CustomText>
            </View>
          )
        )}
        <CustomText style={styles.nameText}>{name}</CustomText>
      </View>

      {showPhoneButton && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPhonePress}
          activeOpacity={0.7}
        >
          <Ionicons name="call-outline" size={18} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  placeholderImage: {
    backgroundColor: "#DAD5FB",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5B4BA0",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600", 
    color: "#000",
  },
});