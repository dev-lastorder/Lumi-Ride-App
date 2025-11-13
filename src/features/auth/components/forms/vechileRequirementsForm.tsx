// VehicleRequirementsForm.tsx - ACTUALLY FIXED VERSION WITH LOADING STATE
import Button from "@/src/components/ui/Button ";
import CustomInput from "@/src/components/ui/Input";
import CustomDropdown from "@/src/components/ui/dropdown";
import { useAppSelector } from "@/src/store/hooks";
import { selectVehicleRequirements } from "@/src/store/selectors/signup.selectors";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { VehicleRequirementsSchema } from "../../validations/authValidation";

export interface VehicleRequirementsFormValues {
  modelYearLimit: string;
  fourDoorCar: string;
  airConditioning: string;
  noCosmeticDamage: string;
  agreedToTerms: boolean;
  vehicleName: string;
  vehicleColor: string;
  vehicleNumber: string;
}

interface VehicleRequirementsFormProps {
  onSubmit: (values: VehicleRequirementsFormValues) => void;
  onBack?: () => void;
  initialValues?: VehicleRequirementsFormValues;
  isSubmitting?: boolean; // ✅ NEW: Accept loading state from parent
}

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const VehicleRequirementsForm: React.FC<VehicleRequirementsFormProps> = ({
  onSubmit,
  onBack,
  initialValues,
  isSubmitting: externalIsSubmitting = false, // ✅ NEW: Default to false
}) => {
  // Get saved data from Redux store
  const savedVehicleInfo = useAppSelector(selectVehicleRequirements);

  // Use saved data from Redux if available, otherwise use prop initialValues or empty defaults
  const formInitialValues: VehicleRequirementsFormValues = initialValues || savedVehicleInfo || {
    modelYearLimit: "",
    fourDoorCar: "",
    airConditioning: "",
    noCosmeticDamage: "",
    agreedToTerms: false,
    vehicleName: "",
    vehicleColor: "",
    vehicleNumber: "",
  };

  // ✅ FIXED: Added missing < after useState
  const [openDropdown, setOpenDropdown] = useState<
    "fourDoorCar" | "airConditioning" | "noCosmeticDamage" | null
  >(null);

  const handleSubmit = (
    values: VehicleRequirementsFormValues,
    formikHelpers: FormikHelpers<VehicleRequirementsFormValues>
  ) => {
    console.log("🚗 Vehicle Requirements submitted:", values);
    onSubmit(values);
    // Don't call setSubmitting(false) here - let parent control it via API response
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={VehicleRequirementsSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        setFieldTouched,
        handleSubmit: formikSubmit,
        isValid,
      }) => {
        console.log("📝 Vehicle form values:", values);
        console.log("❌ Vehicle form errors:", errors);
        console.log("✅ Vehicle form is valid:", isValid);

        // ✅ Use external loading state if provided, otherwise use Formik's
        const isSubmitting = externalIsSubmitting;

        return (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Vehicle Requirements</Text>

              {/* Model Year Limit */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Model Year Limit</Text>
                <Text style={styles.helperText}>
                  (e.g., not older than 10 - 15 years)
                </Text>
                <CustomInput
                  placeholder="10"
                  value={values.modelYearLimit}
                  onChangeText={handleChange("modelYearLimit")}
                  onBlur={() => setFieldTouched("modelYearLimit", true)}
                  error={touched.modelYearLimit ? errors.modelYearLimit : undefined}
                  variant="outline"
                  size="large"
                  containerStyle={styles.inputField}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Vehicle Name</Text>
                <CustomInput
                  placeholder="Honda Civic"
                  value={values.vehicleName}
                  onChangeText={handleChange("vehicleName")}
                  onBlur={() => setFieldTouched("vehicleName", true)}
                  error={touched.vehicleName ? errors.vehicleName : undefined}
                  variant="outline"
                  size="large"
                  containerStyle={styles.inputField}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Vehicle Color</Text>
                <CustomInput
                  placeholder="Black"
                  value={values.vehicleColor}
                  onChangeText={handleChange("vehicleColor")}
                  onBlur={() => setFieldTouched("vehicleColor", true)}
                  error={touched.vehicleColor ? errors.vehicleColor : undefined}
                  variant="outline"
                  size="large"
                  containerStyle={styles.inputField}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Vehicle Number</Text>
                <CustomInput
                  placeholder="AEW 721"
                  value={values.vehicleNumber}
                  onChangeText={handleChange("vehicleNumber")}
                  onBlur={() => setFieldTouched("vehicleNumber", true)}
                  error={touched.vehicleNumber ? errors.vehicleNumber : undefined}
                  variant="outline"
                  size="large"
                  containerStyle={styles.inputField}
                />
              </View>

              {/* 4-door Car - ✅ REAL FIX: Set value first, then touch+validate */}
              <View
                style={[
                  styles.dropdownWrapper,
                  { zIndex: openDropdown === "fourDoorCar" ? 2000 : 1 },
                ]}
              >
                <CustomDropdown
                  label="4-door Car"
                  placeholder="Yes"
                  value={values.fourDoorCar}
                  items={yesNoOptions}
                  onChange={(value) => {
                    console.log("🚪 4-door changed:", value);
                    // ✅ REAL FIX: First set the value WITHOUT validating
                    setFieldValue("fourDoorCar", value, false);
                    // ✅ Then mark as touched AND validate together
                    setTimeout(() => {
                      setFieldTouched("fourDoorCar", true, true);
                    }, 0);
                  }}
                  error={touched.fourDoorCar ? errors.fourDoorCar : undefined}
                  variant="outline"
                  size="large"
                  open={openDropdown === "fourDoorCar"}
                  setOpen={(isOpen) =>
                    setOpenDropdown(isOpen ? "fourDoorCar" : null)
                  }
                />
              </View>

              {/* Air Conditioning - ✅ REAL FIX: Set value first, then touch+validate */}
              <View
                style={[
                  styles.dropdownWrapper,
                  { zIndex: openDropdown === "airConditioning" ? 2000 : 1 },
                ]}
              >
                <CustomDropdown
                  label="Air Conditioning"
                  placeholder="Yes"
                  value={values.airConditioning}
                  items={yesNoOptions}
                  onChange={(value) => {
                    console.log("❄️ Air Conditioning changed:", value);
                    // ✅ REAL FIX: First set the value WITHOUT validating
                    setFieldValue("airConditioning", value, false);
                    // ✅ Then mark as touched AND validate together
                    setTimeout(() => {
                      setFieldTouched("airConditioning", true, true);
                    }, 0);
                  }}
                  error={
                    touched.airConditioning ? errors.airConditioning : undefined
                  }
                  variant="outline"
                  size="large"
                  open={openDropdown === "airConditioning"}
                  setOpen={(isOpen) =>
                    setOpenDropdown(isOpen ? "airConditioning" : null)
                  }
                />
              </View>

              {/* No Cosmetic Damage - ✅ REAL FIX: Set value first, then touch+validate */}
              <View
                style={[
                  styles.dropdownWrapper,
                  { zIndex: openDropdown === "noCosmeticDamage" ? 2000 : 1 },
                ]}
              >
                <CustomDropdown
                  label="No Cosmetic Damage"
                  placeholder="Yes"
                  value={values.noCosmeticDamage}
                  items={yesNoOptions}
                  onChange={(value) => {
                    console.log("🔧 No Cosmetic Damage changed:", value);
                    // ✅ REAL FIX: First set the value WITHOUT validating
                    setFieldValue("noCosmeticDamage", value, false);
                    // ✅ Then mark as touched AND validate together
                    setTimeout(() => {
                      setFieldTouched("noCosmeticDamage", true, true);
                    }, 0);
                  }}
                  error={
                    touched.noCosmeticDamage
                      ? errors.noCosmeticDamage
                      : undefined
                  }
                  variant="outline"
                  size="large"
                  open={openDropdown === "noCosmeticDamage"}
                  setOpen={(isOpen) =>
                    setOpenDropdown(isOpen ? "noCosmeticDamage" : null)
                  }
                />
              </View>

              {/* Terms & Privacy Checkbox */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    setFieldValue("agreedToTerms", !values.agreedToTerms)
                  }
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      values.agreedToTerms && styles.checkboxBoxChecked,
                    ]}
                  >
                    {values.agreedToTerms && (
                      <Text style={styles.checkboxCheck}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to{" "}
                    <Text style={styles.linkText}>Terms & Privacy Policy</Text>{" "}
                    and{" "}
                    <Text style={styles.linkText}>
                      the requirements in the attached image.
                    </Text>
                  </Text>
                </TouchableOpacity>
                {touched.agreedToTerms && errors.agreedToTerms && (
                  <Text style={styles.errorText}>{errors.agreedToTerms}</Text>
                )}
              </View>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                {/* Back Button */}
                {onBack && (
                  <View style={styles.backButtonWrapper}>
                    <Button
                      title="Back"
                      onPress={onBack}
                      variant="outline"
                      size="large"
                      disabled={isSubmitting} // ✅ Disable back button while submitting
                      style={styles.backButton}
                    />
                  </View>
                )}

                {/* Submit Button - ✅ NOW WITH LOADING INDICATOR */}
                <View style={styles.submitButtonWrapper}>
                  <Button
                    title="Send"
                    onPress={() => {
                      console.log("🔘 Send button clicked!");
                      console.log("Form is valid?", isValid);
                      console.log("Current errors:", errors);
                      formikSubmit();
                    }}
                    variant="primary"
                    size="large"
                    disabled={isSubmitting || !values.agreedToTerms}
                    loading={isSubmitting} // ✅ Shows activity indicator when API is being called
                    fullWidth
                    style={styles.submitButton}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        );
      }}
    </Formik>
  );
};

export default VehicleRequirementsForm;

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
  inputContainer: {
    marginBottom: 20,
  },
  inputField: {
    marginTop: 0,
  },
  dropdownWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#374151",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  checkboxContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: "#3853A4",
    borderColor: "#3853A4",
  },
  checkboxCheck: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  linkText: {
    color: "#3853A4",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    color: "#DC3545",
    marginTop: 4,
    marginLeft: 32,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  backButtonWrapper: {
    flex: 1,
  },
  submitButtonWrapper: {
    flex: 2,
  },
  backButton: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: "#3853A4",
    height: 56,
  },
});