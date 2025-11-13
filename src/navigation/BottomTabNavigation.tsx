import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from 'expo-navigation-bar';
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const TAB_BAR_BACKGROUND = "#1F2937";
const ACTIVE_TINT_COLOR = "#1691BF";
const INACTIVE_TINT_COLOR = "#9CA3AF";

const TAB_CONFIG = [
  {
    name: "(rideRequests)",
    title: "Ride requests",
    icon: "list-circle",
  },
  {
    name: "(scheduledRides)",
    title: "Scheduled Rides",
    icon: "calendar-sharp",
  },
  {
    name: "(wallet)",
    title: "wallet",
    icon: "wallet-sharp",
  },
  {
    name: "(profile)",
    title: "Profile",
    icon: "person",
  },
];

function TabBarIcon({
  name,
  color,
  focused,
}: {
  name: string;
  color: string;
  focused: boolean;
}) {
  // Map of icons with their focused and unfocused variants
  const iconMap: Record<string, { focused: any; unfocused: any }> = {
    "list-circle": { focused: "list-circle", unfocused: "list-circle-outline" },
    "calendar-sharp": { focused: "calendar", unfocused: "calendar-outline" },
    "wallet-sharp": { focused: "wallet", unfocused: "wallet-outline" },
    person: { focused: "person", unfocused: "person-outline" },
  };

  const iconName = iconMap[name]
    ? focused
      ? iconMap[name].focused
      : iconMap[name].unfocused
    : name;

  return (
    <Ionicons
      size={Platform.OS === "ios" ? 24 : 28}
      name={iconName as any}
      color={color}
    />
  );
}

export default function BottomTabsNavigator() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Set the navigation bar background colour
    NavigationBar.setBackgroundColorAsync(TAB_BAR_BACKGROUND);

    // Set the button (icon) style: light = white icons; dark = dark icons
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  return (
    <Tabs
      initialRouteName="(rideRequests)"
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_TINT_COLOR,
        tabBarInactiveTintColor: INACTIVE_TINT_COLOR,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BACKGROUND,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === "ios" ? 85 : 80,
          paddingBottom:
            Platform.OS === "ios" ? insets.bottom : insets.bottom + 2,
          // marginBottom:insets.bottom,
          paddingTop: 8,
          position: "absolute",
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      }}
    >
      {TAB_CONFIG.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={icon} color={color} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
