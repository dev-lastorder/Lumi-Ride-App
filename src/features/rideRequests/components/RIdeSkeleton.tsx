// components/RideSkeleton.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import Shimmer from "../utils/Shimmer";

export const RideSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Shimmer width={60} height={60} borderRadius={30} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Shimmer width="70%" height={18} />
          <Shimmer width="50%" height={18} style={{ marginTop: 6 }} />
        </View>
      </View>

      <Shimmer width="90%" height={20} style={{ marginTop: 20 }} />
      <Shimmer width="80%" height={20} style={{ marginTop: 10 }} />
      <Shimmer width="60%" height={20} style={{ marginTop: 10 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
