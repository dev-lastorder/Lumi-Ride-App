// utils/Shimmer.tsx
import React, { useEffect, useRef } from "react";
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from "react-native";

interface ShimmerProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

const Shimmer: React.FC<ShimmerProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: width as DimensionValue,
          height: height as DimensionValue,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E1E9EE",
    overflow: "hidden",
  },
  shimmerOverlay: {
    width: "50%",
    height: "100%",
    backgroundColor: "#F2F4F8",
    opacity: 0.5,
  },
});

export default Shimmer;
