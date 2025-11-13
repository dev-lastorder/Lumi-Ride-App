import * as Yup from "yup";

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
    modelYearLimit: Yup.string()
      .min(2, "Please enter a valid model year limit")
      .required("Model year limit is required"),
       vehicleName: Yup.string().required("Please enter vehicle Name"),
       vehicleColor: Yup.string().required("Please enter vehicle Color"),
      //  vehicleNo: Yup.string().required("Please enter vehicle Number"),
    fourDoorCar: Yup.string().required("Please select yes or no"),
    airConditioning: Yup.string().required("Please select yes or no"),
    noCosmeticDamage: Yup.string().required("Please select yes or no"),
    agreedToTerms: Yup.boolean()
      .oneOf([true], "You must agree to terms and privacy policy")
      .required("You must agree to terms and privacy policy"),
     
  });
  