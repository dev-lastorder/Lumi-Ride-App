import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login"/>
      <Stack.Screen name="signup"/>
      <Stack.Screen name="verificationmethod"/>
      <Stack.Screen name="verifyOtpSignup"/>
      <Stack.Screen name= "signupSecondStage"/>
      <Stack.Screen name = "signupThirdStage"/>
      <Stack.Screen name="terms&service"/>
      <Stack.Screen name="verifyOtpLogin"/>
    </Stack>
  );
}
