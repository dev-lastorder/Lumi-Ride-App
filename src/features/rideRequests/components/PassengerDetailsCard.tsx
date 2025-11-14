import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { Image, StyleSheet, View } from "react-native";

interface DriverDetailsCardProps {
  name: string;
  image: string;
  phoneNumber: number;
}

const PassengerDetailsCard = ({
  details,
}: {
  details: DriverDetailsCardProps;
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <CustomText style={{ color: theme.colors.colorTextMuted }}>
        Passenger details
      </CustomText>

      <View style={styles.driverContainer}>
        <Image
          source={{ uri: details.image }}
          style={styles.driverImage}
          resizeMode="contain"
        />
        <View style={styles.driverInfo}>
          <CustomText style={{ fontSize: 14 }}>{details.name}</CustomText>

          {/* rating info */}
          {/* <View style={styles.ratingContainer}>
            <CustomIcon
              icon={{
                type: "AntDesign",
                name: "star",
                size: 20,
                color: "#FBC02D",
              }}
            />
            <CustomText>{details.rating}</CustomText>
            <CustomText
              style={{ color: theme.colors.colorTextMuted, fontSize: 14 }}
            >
              ({details.numberOfRides} rides)
            </CustomText>
          </View> */}

          <View style={styles.carContainer}>
            <CustomText style={{ color: theme.colors.colorTextMuted }}>
              {details.phoneNumber}
            </CustomText>
          </View>
        </View>
        {/* <CustomIcon
          icon={{
            type: "Entypo",
            name: "chevron-thin-right",
            size: 20,
            color: "#27272A",
          }}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    gap: 12,
  },
  driverContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
  },
  driverImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  driverInfo: {
    justifyContent: "flex-start",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  carContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
});

export default PassengerDetailsCard;
