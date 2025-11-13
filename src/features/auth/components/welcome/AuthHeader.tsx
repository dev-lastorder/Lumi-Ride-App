import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface AuthHeaderProps {
  subtitle?: string;

  title?: string;

  showSubtitle?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  subtitle = "Are you ready to talk?",
  title,
  showSubtitle = true,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/src/assets/images/lumiLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {title && <Text style={styles.title}>{title}</Text>}

      {showSubtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 240,
    height: 160,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
});

export default AuthHeader;
