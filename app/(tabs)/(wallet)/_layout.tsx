import { Stack } from 'expo-router';

export default function walletLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name= "wallet-main"/>
      <Stack.Screen name="addFund"/>
       <Stack.Screen name="paymentScreen" />
    </Stack>
  );
}