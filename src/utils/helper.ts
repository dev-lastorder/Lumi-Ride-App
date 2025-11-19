import * as FileSystem from "expo-file-system/legacy";
import { Linking } from "react-native";


export function handleTruncate(
  maxLength: number,
  input: string | number
): string {
  const strInput: string = String(input);
  if (strInput.length > maxLength) {
    return strInput.slice(0, maxLength) + "...";
  }
  return strInput;
}

export function maskNumber(
  num: number | string,
  visibleLength: number
): string {
  const str = String(num);

  if (visibleLength <= 0) return "*".repeat(str.length);
  if (visibleLength >= str.length) return str;

  const maskedPart = "*".repeat(4);
  const visiblePart = str.slice(-visibleLength);

  return maskedPart + " " + visiblePart;
}

export const isInTimerWindow = (
  scheduledFor: string | Date | null | undefined,
  startBeforeMinutes: number = 30
): boolean => {
  try {
    // Handle null/undefined
    if (!scheduledFor) {
      return false;
    }

    const now = Date.now();
    const pickupTime = new Date(scheduledFor).getTime();

    // Validate the date
    if (isNaN(pickupTime)) {
      console.error("❌ Invalid scheduledFor date:", scheduledFor);
      return false;
    }

    const startTime = pickupTime - startBeforeMinutes * 60 * 1000;

    // Check if we're in the timer window
    // Timer is active from startTime until pickupTime
    const isInWindow = now >= startTime && now <= pickupTime;

    return isInWindow;
  } catch (error) {
    console.error("❌ Error checking timer window:", error);
    return false;
  }
};

export const canCancelRide = (
  scheduledAt: string | Date | null | undefined,
  withinMinutes: number = 5
): boolean => {
  try {
    // Handle null/undefined
    if (!scheduledAt) {
      return false; // Don't show button if no schedule time
    }

    const now = Date.now();
    const scheduledTime = new Date(scheduledAt).getTime();

    // Validate the date
    if (isNaN(scheduledTime)) {
      console.error("❌ Invalid scheduledAt date:", scheduledAt);
      return false; // Don't show button if invalid date
    }

    // Calculate the time difference in minutes
    const timeDifference = now - scheduledTime; // Now - Scheduled time
    const timeDifferenceInMinutes = timeDifference / (1000 * 60);

    // Show cancel button only if current time is within 5 minutes AFTER scheduled time
    const shouldShowButton = timeDifferenceInMinutes <= withinMinutes && timeDifferenceInMinutes >= 0;

    console.log(
      `⏰ Time since scheduled: ${timeDifferenceInMinutes.toFixed(
        2
      )} minutes, Show button: ${shouldShowButton}`
    );

    return shouldShowButton;
  } catch (error) {
    console.error("❌ Error checking cancel eligibility:", error);
    return false; // Don't show button in case of error
  }
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const isFileSizeValid = (file: { size: number }) => {
  return file.size <= MAX_FILE_SIZE;
};

export const PRIVACY_URL = 'https://lumi.qa/privacy'

export const openPrivacy = () => {
  try {

    Linking.canOpenURL(PRIVACY_URL).then((val) => {
      if (val) {
        Linking.openURL(PRIVACY_URL)
      }
    })
  } catch (e) {

  }
}


 export const persistFile = async (file: any) => {
  const DOCUMENT_DIR = FileSystem.documentDirectory;

  const extension = file.name?.split(".").pop() || "pdf";
  const newPath = `${DOCUMENT_DIR}${Date.now()}.${extension}`;

  await FileSystem.copyAsync({
    from: file.uri,
    to: newPath,
  });

  return {
    ...file,
    uri: newPath,
  };
};