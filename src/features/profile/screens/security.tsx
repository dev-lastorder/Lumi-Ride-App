import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import { globalStyles } from "@/src/constants";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Heading, PersonalInfoCard } from "../components";

const security = () => {
  let isLoading;
  let error;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#DAD5FB" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Text>Something went wrong</Text>
        <Button title="Retry" variant="primary" onPress={() => {}} />
      </View>
    );
  }

  return (
    <GradientBackground>
      <CustomHeader isTitleVisible={false} />

      <View style={styles.content}>
        <View style={[globalStyles.containerPadding]}>
          <Heading title="Security" description="Security and settings." />
          <View style={globalStyles.containerPadding}>
            <PersonalInfoCard
            title="Password"
            description="last updated 2 months ago"
            onPress={() => {
              // router.navigate("/(tabs)/(profile)/change-password");
            }}
          />
          </View>
        </View>
      </View>
    </GradientBackground>
  );
};

export default security;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
