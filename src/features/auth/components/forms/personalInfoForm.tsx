// personalInfoForm.tsx - ACTUALLY FIXED VERSION
import Button from "@/src/components/ui/Button ";
import CustomInput from "@/src/components/ui/Input";
import CustomDropdown from "@/src/components/ui/dropdown";
import { useAppSelector } from "@/src/store/hooks";
import { selectPersonalInfo } from "@/src/store/selectors/signup.selectors";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PhoneInput, { ICountry } from "react-native-international-phone-number";
import { PersonalInfoFormValues } from "../../types";
import { PersonalInfoSchema } from "../../validations/authValidation";

interface PersonalInfoFormProps {
  onSubmit: (values: PersonalInfoFormValues) => void;
  initialValues?: PersonalInfoFormValues;
} 

const cities = [
  { label: "Doha", value: "Doha" },
  { label: "Al Rayyan", value: "Al Rayyan" },
  { label: "Al Wakrah", value: "Al Wakrah" },
  { label: "Al Khor", value: "Al Khor" },
  { label: "Umm Salal Ali", value: "Umm Salal Ali" },
  { label: "Umm Salal Mohammed", value: "Umm Salal Mohammed" },
  { label: "Al Daayen", value: "Al Daayen" },
  { label: "Al Shahaniya", value: "Al Shahaniya" },
  { label: "Al Shamal", value: "Al Shamal" },
  { label: "Lusail", value: "Lusail" },
  { label: "Dukhan", value: "Dukhan" },
  { label: "Mesaieed", value: "Mesaieed" },
  { label: "Al Kharaitiyat", value: "Al Kharaitiyat" },
  { label: "Al Thumama", value: "Al Thumama" },
    { label: "Al Wukair", value: "Al Wukair" },
  { label: "Al Sadd", value: "Al Sadd" },
  { label: "Al Kheesa", value: "Al Kheesa" },
  { label: "Simaisma", value: "Simaisma" },
  { label: "Rawdat Al Khail", value: "Rawdat Al Khail" },
  { label: "Al Masrouhiya", value: "Al Masrouhiya" },
  { label: "Al Kharayej", value: "Al Kharayej" },
  { label: "Abu Dhalouf", value: "Abu Dhalouf" },
  { label: "Abu Samra", value: "Abu Samra" },
  { label: "Ain Khaled", value: "Ain Khaled" },
  { label: "Ain Sinan", value: "Ain Sinan" },
  { label: "Al Aziziya", value: "Al Aziziya" },
  { label: "Baaya", value: "Baaya" },
  { label: "Bani Hajer", value: "Bani Hajer" },
  { label: "Fereej Bin Mahmoud", value: "Fereej Bin Mahmoud" },
  { label: "Fereej Al Asiri", value: "Fereej Al Asiri" },
  { label: "Al Ghuwariyah", value: "Al Ghuwariyah" },
  { label: "Leabaib", value: "Leabaib" },
  { label: "Lebday", value: "Lebday" },
  { label: "Lejbailat", value: "Lejbailat" },
  { label: "Lekhwair", value: "Lekhwair" },
  { label: "Madinat ash Shamal", value: "Madinat ash Shamal" },
  { label: "Madinat Al Kaaban", value: "Madinat Al Kaaban" },
  { label: "Mesaimeer", value: "Mesaimeer" },
  { label: "Al Messila", value: "Al Messila" },
  { label: "Muaither", value: "Muaither" },
  { label: "Mushayrib", value: "Mushayrib" },
  { label: "Najma", value: "Najma" },
  { label: "Old Airport", value: "Old Airport" },
  { label: "Onaiza", value: "Onaiza" },
  { label: "The Pearl", value: "The Pearl" },
  { label: "Ras Abu Aboud", value: "Ras Abu Aboud" },
  { label: "Ras Lafan", value: "Ras Lafan" },
  { label: "Shagra", value: "Shagra" },
  { label: "Al Thakhira", value: "Al Thakhira" },
  { label: "Umm Bab", value: "Umm Bab" },
  { label: "Umm Qarn", value: "Umm Qarn" },
  { label: "Al Waab", value: "Al Waab" },
  { label: "Al Wajba", value: "Al Wajba" },
  { label: "Al Zubarah", value: "Al Zubarah" }
];



const vehicleTypes = [
  { 
    label: "4W Mini (Bike/Scooter)", 
    value: "e0a81b6a-81b1-4d4a-ad81-5b54fff3f26a" 
  },
  { 
    label: "Lumi Go (4-wheeler AC)", 
    value: "baccc594-a5c7-490d-8c9b-e96ca1227395" 
  },
  { 
    label: "Lumi Plus (4-wheeler AC)", 
    value: "38f16813-2929-4daf-9a21-c1a2dd4bad8d" 
  },
  { 
    label: "Lumi Max (4-wheeler AC)", 
    value: "c0959bb1-bdfc-4e35-a826-a115b6649b4a" 
  },
  { 
    label: "Lumi Platinum (4-wheeler AC)", 
    value: "e155d4ad-82b9-452c-be8b-16474213f457" 
  },
  { 
    label: "Courier (Parcels)", 
    value: "dc68049e-cb49-44a4-9b9a-b4e294ffa7cf" 
  },
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const savedPersonalInfo = useAppSelector(selectPersonalInfo);
  
  const formInitialValues: PersonalInfoFormValues = initialValues || savedPersonalInfo || {
    fullName: "",
    phoneNumber: "",
    city: "",
    vehicleType: "",
  };

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'city' | 'vehicleType' | null>(null);

  const handleSubmit = (
    values: PersonalInfoFormValues,
    formikHelpers: FormikHelpers<PersonalInfoFormValues>
  ) => {
    const formattedPhoneNumber = selectedCountry
      ? `${selectedCountry.callingCode.startsWith("+") 
          ? selectedCountry.callingCode 
          : `+${selectedCountry.callingCode}`}${values.phoneNumber.replace(/\s+/g, "")}`
      : values.phoneNumber;

    const submissionValues = {
      ...values,
      phoneNumber: formattedPhoneNumber,
    };
    
    onSubmit(submissionValues);
    formikHelpers.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={PersonalInfoSchema}
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
        isSubmitting,
      }) => (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            {/* Full Name Input */}
            <CustomInput
              label="Full Name"
              placeholder="Full Name"
              value={values.fullName}
              onChangeText={handleChange("fullName")}
              onBlur={() => setFieldTouched("fullName", true)}
              error={touched.fullName ? errors.fullName : undefined}
              variant="outline"
              size="large"
              containerStyle={styles.inputContainer}
            />

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <PhoneInput
                value={values.phoneNumber}
                onChangePhoneNumber={(phoneNumber) => {
                  setFieldValue("phoneNumber", phoneNumber, true);
                }}
                selectedCountry={selectedCountry}
                onChangeSelectedCountry={(country) => {
                  setSelectedCountry(country);
                  console.log("📍 Country Code:", country?.callingCode);
                }}
                placeholder="Phone number"
                defaultCountry="PK"
                phoneInputStyles={{
                  container: styles.phoneContainer,
                  flagContainer: styles.flagContainer,
                  flag: {},
                  caret: styles.caret,
                  divider: styles.divider,
                  callingCode: styles.callingCode,
                  input: styles.phoneInput,
                }}
                modalStyles={{
                  backdrop: {},
                  countryName: styles.countryName,
                  searchInput: styles.searchInput,
                }}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}
            </View>

            {/* City Dropdown - ✅ REAL FIX: Set value first, then touch+validate */}
            <View style={[styles.dropdownWrapper, { zIndex: openDropdown === 'city' ? 2000 : 1 }]}>
              <CustomDropdown
                label="City"
                placeholder="Select City"
                value={values.city}
                items={cities}
                onChange={(value) => {
                  console.log("🏙️ City Selected:", value);
                  // ✅ REAL FIX: First set the value WITHOUT validating
                  setFieldValue("city", value, false);
                  // ✅ Then mark as touched AND validate together
                  // This ensures the new value is set before validation runs
                  setTimeout(() => {
                    setFieldTouched("city", true, true);
                  }, 0);
                }}
                error={touched.city ? errors.city : undefined}
                variant="outline"
                size="large"
                open={openDropdown === 'city'}
                setOpen={(isOpen) => setOpenDropdown(isOpen ? 'city' : null)}
              />
            </View>

            {/* Vehicle Type Dropdown - ✅ REAL FIX: Set value first, then touch+validate */}
            <View style={[styles.dropdownWrapper, { zIndex: openDropdown === 'vehicleType' ? 2000 : 1 }]}>
              <CustomDropdown
                label="Vehicle Type"
                placeholder="Select Vehicle Type"
                value={values.vehicleType}
                items={vehicleTypes}
                onChange={(value) => {
                  console.log("🚗 Vehicle Type Selected (UUID):", value);
                  // ✅ REAL FIX: First set the value WITHOUT validating
                  setFieldValue("vehicleType", value, false);
                  // ✅ Then mark as touched AND validate together
                  // This ensures the new value is set before validation runs
                  setTimeout(() => {
                    setFieldTouched("vehicleType", true, true);
                  }, 0);
                }}
                error={touched.vehicleType ? errors.vehicleType : undefined}
                variant="outline"
                size="large"
                open={openDropdown === 'vehicleType'}
                setOpen={(isOpen) => setOpenDropdown(isOpen ? 'vehicleType' : null)}
              />
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Save & Next"
                onPress={() => formikSubmit()}
                variant="primary"
                size="large"
                disabled={isSubmitting}
                loading={isSubmitting}
                fullWidth
                style={styles.submitButton}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default PersonalInfoForm;

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
  dropdownWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  phoneContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    height: 52,
  },
  flagContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  caret: {
    color: "#6B7280",
    fontSize: 16,
  },
  divider: {
    backgroundColor: "#E5E7EB",
  },
  callingCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  phoneInput: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  countryName: {
    color: "#111827",
  },
  searchInput: {
    borderColor: "#D1D5DB",
  },
  errorText: {
    fontSize: 12,
    color: "#DC3545",
    marginTop: 4,
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