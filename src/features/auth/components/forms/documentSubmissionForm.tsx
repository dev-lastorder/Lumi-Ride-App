// DocumentSubmissionForm.tsx - FIXED VALIDATION VERSION

import Button from "@/src/components/ui/Button ";
import { useAppSelector } from "@/src/store/hooks";
import { selectDocumentSubmission } from "@/src/store/selectors/signup.selectors";
import { types as DocumentTypes, pick } from "@react-native-documents/picker";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import ImagePicker from "react-native-image-crop-picker";
import FileUploadInput, { UploadedFile } from "../common/FileUploadInput";

export interface DocumentSubmissionFormValues {
  profilePicture: UploadedFile[];
  driverLicenseFront: UploadedFile[];
  driverLicenseBack: UploadedFile[];
  nationalIdFront: UploadedFile[];
  nationalIdBack: UploadedFile[];
  vehicleRegistrationFront: UploadedFile[];
  vehicleRegistrationBack: UploadedFile[];
  companyRegistration: UploadedFile[];
}

interface DocumentSubmissionFormProps {
  onSubmit: (values: DocumentSubmissionFormValues) => void;
  initialValues?: Partial<DocumentSubmissionFormValues>;
}

const DocumentSubmissionForm: React.FC<DocumentSubmissionFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const savedDocuments = useAppSelector(selectDocumentSubmission);

  const [profilePicture, setProfilePicture] = useState<UploadedFile[]>(
    initialValues?.profilePicture || savedDocuments.profilePicture || []
  );
  const [driverLicenseFront, setDriverLicenseFront] = useState<UploadedFile[]>(
    initialValues?.driverLicenseFront || savedDocuments.driverLicenseFront || []
  );
  const [driverLicenseBack, setDriverLicenseBack] = useState<UploadedFile[]>(
    initialValues?.driverLicenseBack || savedDocuments.driverLicenseBack || []
  );
  const [nationalIdFront, setNationalIdFront] = useState<UploadedFile[]>(
    initialValues?.nationalIdFront || savedDocuments.nationalIdFront || []
  );
  const [nationalIdBack, setNationalIdBack] = useState<UploadedFile[]>(
    initialValues?.nationalIdBack || savedDocuments.nationalIdBack || []
  );
  const [vehicleRegistrationFront, setVehicleRegistrationFront] = useState<
    UploadedFile[]
  >(
    initialValues?.vehicleRegistrationFront ||
      savedDocuments.vehicleRegistrationFront ||
      []
  );
  const [vehicleRegistrationBack, setVehicleRegistrationBack] = useState<
    UploadedFile[]
  >(
    initialValues?.vehicleRegistrationBack ||
      savedDocuments.vehicleRegistrationBack ||
      []
  );

  const [companyRegistration, setCompanyRegistration] = useState<UploadedFile[]>(
    initialValues?.companyRegistration || savedDocuments.companyRegistration || []
  );

  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [errors, setErrors] = useState<
    Partial<Record<keyof DocumentSubmissionFormValues, string>>
  >({});

  // -----------------------------
  // Helpers
  // -----------------------------

  const makeImageObj = (image: any): UploadedFile => {
    return {
      uri: image?.sourceURL ? image?.sourceURL : image?.path,
      name:
        image?.filename ||
        image?.path?.split("/")?.pop() ||
        image?.sourceURL?.split("/")?.pop() ||
        "photo.jpg",
      type: image?.mime || "image/jpeg",
      size: image?.size,
    };
  };

  const makeDocumentObj = (doc: any): UploadedFile => {
    return {
      uri: doc?.uri,
      name: doc?.name || "document.pdf",
      type: doc?.mimeType || doc?.type || "application/pdf",
      size: doc?.size || 0,
    };
  };

  const simulateProgress = (callback: () => void) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            callback();
            setUploading(null);
            setUploadProgress(0);
          }, 200);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  const handleImagePick = async (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    field: keyof DocumentSubmissionFormValues
  ) => {
    try {
      setUploading(field);

      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });

      if (image) {
        simulateProgress(() => {
          const file = makeImageObj(image);
          setter([file]);
          validateField(field, [file]);
        });
      }
    } catch (error: any) {
      setUploading(null);
      if (error.code !== "E_PICKER_CANCELLED") {
        Alert.alert("Error", "Failed to pick image");
      }
    }
  };

  const handleDocumentPick = async (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    field: keyof DocumentSubmissionFormValues
  ) => {
    try {
      setUploading(field);
      const results = await pick({
        type: [DocumentTypes.pdf, DocumentTypes.images],
      });

      if (results && results.length > 0) {
        simulateProgress(() => {
          const file = makeDocumentObj(results[0]);
          setter([file]);
          validateField(field, [file]);
        });
      }
    } catch (err: any) {
      setUploading(null);
      if (err?.name === "DocumentPickerCanceled") return;
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleRemoveFile = (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    index: number,
    field: keyof DocumentSubmissionFormValues
  ) => {
    setter((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      validateField(field, updated);
      return updated;
    });
  };

  const validateField = (
    field: keyof DocumentSubmissionFormValues,
    value: UploadedFile[]
  ) => {
    if (value.length === 0) {
      setErrors((prev) => ({ ...prev, [field]: "This field is required" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // -----------------------------
  // FORM VALIDATION
  // -----------------------------

  const validate = (): boolean => {
    const newErrors: Partial<
      Record<keyof DocumentSubmissionFormValues, string>
    > = {};

    if (profilePicture.length === 0)
      newErrors.profilePicture = "Profile picture is required";

    if (driverLicenseFront.length === 0 || driverLicenseBack.length === 0)
      newErrors.driverLicenseFront =
        "Driver's license (front & back) are required";

    if (nationalIdFront.length === 0 || nationalIdBack.length === 0)
      newErrors.nationalIdFront = "National ID / Passport (front & back) required";

    if (vehicleRegistrationFront.length === 0 || vehicleRegistrationBack.length === 0)
      newErrors.vehicleRegistrationFront =
        "Vehicle registration (front & back) are required";

    // ✅ Now properly validated
    if (companyRegistration.length === 0)
      newErrors.companyRegistration = "Company registration is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // SUBMIT HANDLER
  // -----------------------------

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert("Validation Error", "Please upload all required documents");
      return;
    }

    const values: DocumentSubmissionFormValues = {
      profilePicture,
      driverLicenseFront,
      driverLicenseBack,
      nationalIdFront,
      nationalIdBack,
      vehicleRegistrationFront,
      vehicleRegistrationBack,
      companyRegistration,
    };

    onSubmit(values);
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Document Submission</Text>

        {/* Profile Picture */}
        <FileUploadInput
          label="Profile Picture"
          placeholder="image.jpeg"
          files={profilePicture}
          onUpload={() => handleImagePick(setProfilePicture, "profilePicture")}
          onRemove={(i) =>
            handleRemoveFile(setProfilePicture, i, "profilePicture")
          }
          error={errors.profilePicture}
          uploading={uploading === "profilePicture"}
          uploadProgress={uploadProgress}
        />

        {/* Driver License Front/Back */}
        <FileUploadInput
          label="Driver's License (Front & Back)"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={[...driverLicenseFront, ...driverLicenseBack]}
          onUpload={() => {
            if (driverLicenseFront.length === 0)
              handleDocumentPick(setDriverLicenseFront, "driverLicenseFront");
            else handleDocumentPick(setDriverLicenseBack, "driverLicenseBack");
          }}
          onRemove={(index) => {
            if (index < driverLicenseFront.length) {
              handleRemoveFile(setDriverLicenseFront, index, "driverLicenseFront");
            } else {
              handleRemoveFile(
                setDriverLicenseBack,
                index - driverLicenseFront.length,
                "driverLicenseBack"
              );
            }
          }}
          maxFiles={2}
          error={
            errors.driverLicenseFront || errors.driverLicenseBack
              ? "Both front & back are required"
              : undefined
          }
          uploading={
            uploading === "driverLicenseFront" ||
            uploading === "driverLicenseBack"
          }
          uploadProgress={uploadProgress}
          helperText="valid & not expired"
        />

        {/* National ID / Passport */}
        <FileUploadInput
          label="National ID / Passport (Front & Back)"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={[...nationalIdFront, ...nationalIdBack]}
          onUpload={() => {
            if (nationalIdFront.length === 0)
              handleDocumentPick(setNationalIdFront, "nationalIdFront");
            else handleDocumentPick(setNationalIdBack, "nationalIdBack");
          }}
          onRemove={(index) => {
            if (index < nationalIdFront.length) {
              handleRemoveFile(setNationalIdFront, index, "nationalIdFront");
            } else {
              handleRemoveFile(
                setNationalIdBack,
                index - nationalIdFront.length,
                "nationalIdBack"
              );
            }
          }}
          maxFiles={2}
          error={
            errors.nationalIdFront || errors.nationalIdBack
              ? "Both front & back are required"
              : undefined
          }
          uploading={
            uploading === "nationalIdFront" || uploading === "nationalIdBack"
          }
          uploadProgress={uploadProgress}
          helperText="valid & not expired"
        />

        {/* Vehicle Registration */}
        <FileUploadInput
          label="Vehicle Registration (Front & Back)"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={[...vehicleRegistrationFront, ...vehicleRegistrationBack]}
          onUpload={() => {
            if (vehicleRegistrationFront.length === 0)
              handleDocumentPick(
                setVehicleRegistrationFront,
                "vehicleRegistrationFront"
              );
            else
              handleDocumentPick(
                setVehicleRegistrationBack,
                "vehicleRegistrationBack"
              );
          }}
          onRemove={(index) => {
            if (index < vehicleRegistrationFront.length) {
              handleRemoveFile(
                setVehicleRegistrationFront,
                index,
                "vehicleRegistrationFront"
              );
            } else {
              handleRemoveFile(
                setVehicleRegistrationBack,
                index - vehicleRegistrationFront.length,
                "vehicleRegistrationBack"
              );
            }
          }}
          maxFiles={2}
          error={
            errors.vehicleRegistrationFront || errors.vehicleRegistrationBack
              ? "Both front & back are required"
              : undefined
          }
          uploading={
            uploading === "vehicleRegistrationFront" ||
            uploading === "vehicleRegistrationBack"
          }
          uploadProgress={uploadProgress}
          helperText="Estimara"
        />

        {/* Company Registration */}
        <FileUploadInput
          label="Company Commercial Registration"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={companyRegistration}
          onUpload={() =>
            handleDocumentPick(setCompanyRegistration, "companyRegistration")
          }
          onRemove={(i) =>
            handleRemoveFile(setCompanyRegistration, i, "companyRegistration")
          }
          maxFiles={1}
          error={errors.companyRegistration}
          uploading={uploading === "companyRegistration"}
          uploadProgress={uploadProgress}
        />

        {/* Submit */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save & Next"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            fullWidth
            style={styles.submitButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DocumentSubmissionForm;



const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  formContainer: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#3853A4",
    height: 56,
  },
});
