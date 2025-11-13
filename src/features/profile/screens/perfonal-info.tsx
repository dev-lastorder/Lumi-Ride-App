import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import { SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { Heading, PersonalInfoCard } from "../components";
import { useUpdateRiderProfile } from "../hooks/mutations";
import { useFetchRiderProfile } from "../hooks/queries";

const personalInfo = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const { data, isLoading, error, refetch } = useFetchRiderProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateRiderProfile();

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });

      if (image) {
        setSelectedImage(image);
        setShowPhotoModal(true);
      }
    } catch (error: any) {
      console.error("Error picking image:", error);
    }
  };

  const handleUpdatePhoto = async () => {
    try {
      await updateProfile({ profile: selectedImage });
      setShowPhotoModal(false);
      setSelectedImage(null);
    } catch (error: any) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelPhotoUpdate = () => {
    setShowPhotoModal(false);
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#DAD5FB" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Text>Something went wrong</Text>
        <Button
          title="Retry"
          variant="primary"
          onPress={() => {
            refetch();
          }}
        />
      </View>
    );
  }

  const theme = useTheme();

  return (
    <GradientBackground>
      <CustomHeader title="Your Profile" />
      <ScrollView>
        <View style={[globalStyles.containerPadding]}>
          <Heading
            title="Personal info"
            description="Update your personal and contact details."
          />
          <View
            style={[globalStyles.containerPadding, { paddingVertical: 12 }]}
          >
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: data?.user?.profile }}
              />
              <TouchableOpacity
                style={{ position: "absolute", bottom: 0, right: 0 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={pickImage}
              >
                <SimpleLineIcons
                  name="pencil"
                  size={16}
                  color={theme.colors.colorIcon}
                  style={[
                    styles.icon,
                    {
                      backgroundColor: theme.colors.colorBg,
                      borderColor: theme.colors.colorBorder,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>

            <PersonalInfoCard
              title="Name"
              description={data?.user?.name || ""}
              onPress={() => {
                router.navigate("/(tabs)/(profile)/edit-name");
              }}
            />
            <PersonalInfoCard
              title="Phone number"
              description={data?.user.phone || ""}
              onPress={() => {
                router.navigate("/(tabs)/(profile)/edit-phone");
              }}
            />
            <PersonalInfoCard
              title="Email"
              description={data?.user.email || ""}
            />
          </View>
        </View>
      </ScrollView>

      {/* Photo Confirmation Modal */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelPhotoUpdate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile photo</Text>
            <Text style={styles.modalDescription}>
              This is the photo you would like others to see.
            </Text>

            <Button
              title={isUpdating ? "Updating..." : "Update photo"}
              variant="primary"
              onPress={handleUpdatePhoto}
              disabled={isUpdating}
              style={{ marginBottom: 12 }}
              fullWidth={true}
            />

            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleCancelPhotoUpdate}
              disabled={isUpdating}
              fullWidth={true}
            />
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

export default personalInfo;

const styles = StyleSheet.create({
  image: {
    borderRadius: 200,
    width: 96,
    height: 96,
  },
  imageContainer: {
    display: "flex",
    position: "relative",
    alignItems: "flex-start",
    justifyContent: "center",
    width: 96,
    height: 96,
  },
  icon: {
    borderWidth: 1,
    borderRadius: 100,
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1F2937",
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#6B7280",
  },
});
