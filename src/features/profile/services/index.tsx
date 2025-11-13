import { API_ENDPOINTS, client } from "@/src/lib/axios";
import { RiderProfile, updateRiderProfileParams } from "../types";

export const fetchRiderProfile = async (): Promise<RiderProfile> => {
  const response = await client.get(API_ENDPOINTS.PROFILE.user);
  return response.data;
};

// Helper function to format image object (CRITICAL FIX from working example)
const makeImageObj = (image: any) => {
  console.log("Formatting image object:", image);
  let obj: any = {};
  if (image) {
    // CRITICAL FIX: Use 'path' first (cropped image), fallback to sourceURL
    obj.uri = image?.path ? image.path : image?.sourceURL;
    obj.name = image?.filename
      ? image.filename
      : image?.path
      ? image.path.split("/")[image.path.split("/").length - 1]
      : image?.sourceURL?.split("/")[image.sourceURL.split("/").length - 1];
    obj.type = image?.mime;
  }
  console.log("Formatted image object:", obj);
  return obj;
};

export const updateRiderProfile = async (
  params: updateRiderProfileParams
): Promise<RiderProfile> => {
  try {
    // Check if we have an image to upload
    if (params.profile && typeof params.profile === "object") {
      const formData = new FormData();

      // Add text fields
      if (params.name) formData.append("name", params.name);
      if (params.phone) formData.append("phone", params.phone);

      // Format image object using the working pattern
      const imageObj = makeImageObj(params.profile);

      formData.append("profile", imageObj as any);

      // Send FormData request
      const response = await client.patch(API_ENDPOINTS.PROFILE.user, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } else {
      const response = await client.patch(API_ENDPOINTS.PROFILE.user, params);
      return response.data;
    }
  } catch (error: any) {
    throw error;
  }
};

export const updateRiderPassword = async (params: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  try {
    const response = await client.patch(API_ENDPOINTS.PROFILE.updatePassword, {
      previous_password: params.currentPassword,
      new_password: params.newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
