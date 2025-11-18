import * as Yup from "yup";


const currentYear = new Date().getFullYear();


export const PersonalInfoSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Full name is required"),
  phoneNumber: Yup.string()
    .min(5, "Phone number is too short")
    .required("Phone number is required"),
  city: Yup.string().required("Please select a city"),
  vehicleType: Yup.string().required("Please select a vehicle type"),
});

// Add more schemas for other steps
export const DocumentSubmissionSchema = Yup.object().shape({
  // Add document submission validation here
});

export const VehicleRequirementsSchema = Yup.object().shape({
  modelYearLimit: Yup.number()
    .typeError("Please enter a valid year")
    .required("Model year limit is required")
    .min(
      currentYear - 10,
      `Model year cannot be older than ${currentYear - 10}`
    )
    .max(currentYear, `Model year cannot be in the future`),
  vehicleName: Yup.string()
    .required("Please enter vehicle name")
    .min(2, "Vehicle name must be at least 2 characters")
    .max(50, "Vehicle name cannot exceed 50 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Vehicle name can only contain letters and spaces"
    ),
  vehicleColor: Yup.string()
    .required("Please enter vehicle color")
    .min(2, "Vehicle color must be at least 2 characters")
    .max(20, "Vehicle color cannot exceed 20 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Vehicle color can only contain letters and spaces"
    ),
  vehicleNumber: Yup.string()
    .required("Please enter vehicle number")
    .min(2, "Vehicle number is too short")
    .max(10, "Vehicle number is too long")
    .matches(
      /^[A-Za-z0-9\s]+$/,
      "Vehicle number can only contain letters, numbers, and spaces"
    ),


  //  vehicleNo: Yup.string().required("Please enter vehicle Number"),
  fourDoorCar: Yup.string().required("Please select yes or no"),
  airConditioning: Yup.string().required("Please select yes or no"),
  noCosmeticDamage: Yup.string().required("Please select yes or no"),
  agreedToTerms: Yup.boolean()
    .oneOf([true], "You must agree to terms and privacy policy")
    .required("You must agree to terms and privacy policy"),

});
