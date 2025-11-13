// src/components/ui/FileUploadInput.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

interface FileUploadInputProps {
  label: string;
  placeholder?: string;
  files: UploadedFile[];
  onUpload: () => void;
  onRemove: (index: number) => void;
  error?: string;
  maxFiles?: number;
  uploading?: boolean;
  uploadProgress?: number;
  acceptedFormats?: string;
  helperText?: string;
  containerStyle?: any;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  placeholder = "Choose file",
  files,
  onUpload,
  onRemove,
  error,
  maxFiles = 1,
  uploading = false,
  uploadProgress = 0,
  acceptedFormats,
  helperText,
  containerStyle,
}) => {
  const canUploadMore = files.length < maxFiles;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <Text style={styles.label}>
        {label}{" "}
        {helperText && <Text style={styles.helperText}>({helperText})</Text>}
      </Text>

      {/* Upload Input */}
      <TouchableOpacity
        style={[
          styles.uploadBox,
          error && styles.uploadBoxError,
          !canUploadMore && styles.uploadBoxDisabled,
        ]}
        onPress={canUploadMore ? onUpload : undefined}
        disabled={!canUploadMore || uploading}
      >
        <View style={styles.uploadContent}>
          <Text
            style={[
              styles.placeholder,
              !canUploadMore && styles.placeholderDisabled,
            ]}
          >
            {acceptedFormats || placeholder}
          </Text>
          <View style={styles.uploadButton}>
            {uploading ? (
              <ActivityIndicator size="small" color="#3853A4" />
            ) : (
              <Text style={styles.uploadButtonText}>Upload file</Text>
            )}
          </View>
        </View>

        {/* Upload Progress Bar */}
        {uploading && uploadProgress > 0 && (
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${uploadProgress}%` }]}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Uploaded Files List */}
      {files.map((file, index) => (
        <View key={index} style={styles.fileChip}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>
          <TouchableOpacity
            onPress={() => onRemove(index)}
            style={styles.removeButton}
          >
            <Ionicons name="close" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FileUploadInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1F2937",
  },
  helperText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
  },
  uploadBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    minHeight: 56,
    overflow: "hidden",
  },
  uploadBoxError: {
    borderColor: "#DC3545",
  },
  uploadBoxDisabled: {
    backgroundColor: "#F9FAFB",
    opacity: 0.6,
  },
  uploadContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    color: "#9CA3AF",
    marginRight: 12,
  },
  placeholderDisabled: {
    color: "#D1D5DB",
  },
  uploadButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#E5E7EB",
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3853A4",
  },
  fileChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#DC3545",
    marginTop: 4,
  },
});