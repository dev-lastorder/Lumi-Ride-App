import CustomText from "@/src/components/ui/Text";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface RideDetailsCardProps {
  type: string;
  price: string;
  image: string;
}

const RideDetailsCard = ({ details }: { details: RideDetailsCardProps }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: details.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <CustomText weight="semibold">{details.type}</CustomText>
      </View>
      <CustomText weight="semibold">{details.price}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default RideDetailsCard;
