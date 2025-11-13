import { Stack } from 'expo-router';

export default function ScheduledRidesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}