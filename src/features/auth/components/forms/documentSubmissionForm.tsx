// DocumentSubmissionForm.tsx - REVERTED to single company registration
import Button from "@/src/components/ui/Button ";
import { useAppSelector } from "@/src/store/hooks";
import { selectDocumentSubmission } from "@/src/store/selectors/signup.selectors";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
// import DocumentPicker from "react-native-document-picker";
import { types as DocumentTypes, pick } from "@react-native-documents/picker";

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
  companyRegistration: UploadedFile[]; // ✅ Single field
}

interface DocumentSubmissionFormProps {
  onSubmit: (values: DocumentSubmissionFormValues) => void;
  initialValues?: Partial<DocumentSubmissionFormValues>;
}

const DocumentSubmissionForm: React.FC<DocumentSubmissionFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  // Get saved data from Redux store
  const savedDocuments = useAppSelector(selectDocumentSubmission);

  // Use saved data from Redux if available, otherwise use prop initialValues or empty defaults
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
  >(initialValues?.vehicleRegistrationFront || savedDocuments.vehicleRegistrationFront || []);
  const [vehicleRegistrationBack, setVehicleRegistrationBack] = useState<
    UploadedFile[]
  >(initialValues?.vehicleRegistrationBack || savedDocuments.vehicleRegistrationBack || []);

  // ✅ REVERTED: Single company registration field
  const [companyRegistration, setCompanyRegistration] = useState<UploadedFile[]>(
    initialValues?.companyRegistration || savedDocuments.companyRegistration || []
  );

  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentSubmissionFormValues, string>>>({});

  // Helper function to create file object from image picker
  const makeImageObj = (image: any): UploadedFile => {
    console.log("Image object:", image);
    let obj: UploadedFile = {
      uri: "",
      name: "",
      type: "",
    };

    if (image) {
      obj.uri = image?.sourceURL ? image?.sourceURL : image?.path;
      obj.name = image?.filename
        ? image?.filename
        : image?.path
          ? image?.path?.split('/')[image?.path?.split('/')?.length - 1]
          : image?.sourceURL?.split('/')[image?.sourceURL?.split('/')?.length - 1];
      obj.type = image?.mime || "image/jpeg";
      obj.size = image?.size;
    }

    return obj;
  };

  // Helper function to create file object from document picker
  const makeDocumentObj = (doc: any): UploadedFile => {
    console.log("Document object:", doc);
    return {
      uri: doc?.uri,
      name: doc?.name || "document.pdf",
      type: doc?.mimeType || doc?.type || "application/pdf", // supports both for backward compatibility
      size: doc?.size || 0,
    };
  };


  // Simulate upload progress
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

  // Image Picker Handler (for Profile Picture)
  const handleImagePick = async (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    field: string
  ) => {
    try {
      console.log("Opening image picker...");
      setUploading(field);

      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });

      console.log("Image picked:", image);

      if (image) {
        simulateProgress(() => {
          const file = makeImageObj(image);
          console.log("File object created:", file);
          setter([file]);
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        });
      }
    } catch (error: any) {
      console.error("Image picker error:", error);
      setUploading(null);
      if (error.code !== "E_PICKER_CANCELLED") {
        Alert.alert("Error", "Failed to pick image. Please try again.");
      }
    }
  };

  // Document Picker Handler (for PDFs and Images)
  // const handleDocumentPick = async (
  //   setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
  //   field: string
  // ) => {

  //   console.log("hitting this");
  //   // try {
  //   //   console.log("Opening document picker...");
  //   //   setUploading(field);

  //   //   const res = await DocumentPicker.pick({
  //   //     type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
  //   //   });

  //   //   console.log("Document picked:", res);

  //   //   simulateProgress(() => {
  //   //     const file = makeDocumentObj(res[0]);
  //   //     console.log("File object created:", file);
  //   //     setter([file]);
  //   //     setErrors((prev) => ({ ...prev, [field]: undefined }));
  //   //   });
  //   // } catch (err: any) {
  //   //   console.error("Document picker error:", err);
  //   //   setUploading(null);
  //   //   if (DocumentPicker.isCancel(err)) {
  //   //     console.log("User canceled the picker");
  //   //   } else {
  //   //     Alert.alert("Error", "Failed to pick document. Please try again.");
  //   //   }
  //   // }
  // };


  const handleDocumentPick = async (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    field: string
  ) => {
    console.log("hitting this");
    try {
      console.log("Opening document picker...");
      setUploading(field);

      // pick returns an array of selected files (even if you only allow single selection)
      const results = await pick({
        type: [DocumentTypes.pdf, DocumentTypes.images],
        // if you want to restrict it to single selection you may not need extra flag
        // new API doesn't use pickSingle, just pick()
        // allowMultiSelection: false // if available in this version
      });

      console.log("Documents picked:", results);

      if (results && results.length > 0) {
        simulateProgress(() => {
          const file = makeDocumentObj(results[0]);
          console.log("File object created:", file);
          setter([file]);
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        });
      }

    } catch (err: any) {
      console.error("Document picker error:", err);
      setUploading(null);
      // The new package may still throw a cancellation error
      if (err?.name === "DocumentPickerCanceled" || /* maybe a helper function */ false) {
        console.log("User canceled the picker");
      } else {
        Alert.alert("Error", "Failed to pick document. Please try again.");
      }
    }
  };

  // Remove File Handler
  const handleRemoveFile = (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DocumentSubmissionFormValues, string>> = {};

    if (profilePicture.length === 0) {
      newErrors.profilePicture = "Profile picture is required";
    }
    if (driverLicenseFront.length === 0) {
      newErrors.driverLicenseFront = "Driver's license front is required";
    }
    if (driverLicenseBack.length === 0) {
      newErrors.driverLicenseBack = "Driver's license back is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = () => {
    console.log("🔘 Submit button clicked!");

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
      companyRegistration, // ✅ Single field
    };

    console.log("✅ Form values:", values);
    onSubmit(values);
  };

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
          onRemove={(index: number) => handleRemoveFile(setProfilePicture, index)}
          error={errors.profilePicture}
          uploading={uploading === "profilePicture"}
          uploadProgress={uploadProgress}
        />

        {/* Driver's License (Front & Back) */}
        <FileUploadInput
          label="Driver's License (Front & Back)"
          placeholder="Driving-license.pdf"
          files={[...driverLicenseFront, ...driverLicenseBack]}
          onUpload={() => {
            if (driverLicenseFront.length === 0) {
              handleDocumentPick(setDriverLicenseFront, "driverLicenseFront");
            } else {
              handleDocumentPick(setDriverLicenseBack, "driverLicenseBack");
            }
          }}
          onRemove={(index: number) => {
            if (index < driverLicenseFront.length) {
              handleRemoveFile(setDriverLicenseFront, index);
            } else {
              handleRemoveFile(
                setDriverLicenseBack,
                index - driverLicenseFront.length
              );
            }
          }}
          error={errors.driverLicenseFront || errors.driverLicenseBack}
          maxFiles={2}
          uploading={
            uploading === "driverLicenseFront" ||
            uploading === "driverLicenseBack"
          }
          uploadProgress={uploadProgress}
          helperText="valid & not expired"
        />

        {/* National ID / Passport (Front & Back) */}
        <FileUploadInput
          label="National ID / Passport (Front & Back)"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={[...nationalIdFront, ...nationalIdBack]}
          onUpload={() => {
            if (nationalIdFront.length === 0) {
              handleDocumentPick(setNationalIdFront, "nationalIdFront");
            } else {
              handleDocumentPick(setNationalIdBack, "nationalIdBack");
            }
          }}
          onRemove={(index: number) => {
            if (index < nationalIdFront.length) {
              handleRemoveFile(setNationalIdFront, index);
            } else {
              handleRemoveFile(
                setNationalIdBack,
                index - nationalIdFront.length
              );
            }
          }}
          maxFiles={2}
          uploading={
            uploading === "nationalIdFront" || uploading === "nationalIdBack"
          }
          uploadProgress={uploadProgress}
          helperText="valid & not expired"
        />

        {/* Vehicle Registration (Front & Back) */}
        <FileUploadInput
          label="Vehicle Registration (Front & Back)"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={[...vehicleRegistrationFront, ...vehicleRegistrationBack]}
          onUpload={() => {
            if (vehicleRegistrationFront.length === 0) {
              handleDocumentPick(
                setVehicleRegistrationFront,
                "vehicleRegistrationFront"
              );
            } else {
              handleDocumentPick(
                setVehicleRegistrationBack,
                "vehicleRegistrationBack"
              );
            }
          }}
          onRemove={(index: number) => {
            if (index < vehicleRegistrationFront.length) {
              handleRemoveFile(setVehicleRegistrationFront, index);
            } else {
              handleRemoveFile(
                setVehicleRegistrationBack,
                index - vehicleRegistrationFront.length
              );
            }
          }}
          maxFiles={2}
          uploading={
            uploading === "vehicleRegistrationFront" ||
            uploading === "vehicleRegistrationBack"
          }
          uploadProgress={uploadProgress}
          helperText="Estimara"
        />

        {/* ✅ REVERTED: Company Commercial Registration - Single file only */}
        <FileUploadInput
          label="Company Commercial Registration (Optional)"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={companyRegistration}
          onUpload={() => handleDocumentPick(setCompanyRegistration, "companyRegistration")}
          onRemove={(index: number) => handleRemoveFile(setCompanyRegistration, index)}
          maxFiles={1}
          uploading={uploading === "companyRegistration"}
          uploadProgress={uploadProgress}
        />

        {/* Submit Button */}
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