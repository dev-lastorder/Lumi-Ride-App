import { BASE_URL } from "@/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { getAuthHeaders } from "../utils/api";
import { ITransactionData } from "./PaymentWebView";
interface Props {
  onDone: () => void;
  transactionData: ITransactionData;
}

const PaymentCallback: React.FC<Props> = ({ onDone, transactionData }) => {
  const insets = useSafeAreaInsets();
  const jwtToken = useSelector((state: any) => state.auth.token);
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        console.log(
          "Verifying payment on payment callback...",
          jwtToken,
          " transactionID: ",
          transactionData
        );
        // const txnUuid = new URL(callbackUrl).searchParams.get("TXN_UUID");
        const merchantTxnId = await AsyncStorage.getItem("lastMerchantTxnId");

        const response = await fetch(`${BASE_URL}/payment/verify`, {
          method: "POST",
          headers: getAuthHeaders(jwtToken!),
          body: JSON.stringify({
            transactionUUID: transactionData.txnUuid,
            merchantTransactionId: transactionData.merchantId,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          onDone && onDone();
        } else {
          setStatus("failed");
          setMessage(result.errorMessage || "Verification failed");
          alert("Payment verification failed. Please try again.");
          router.replace({
            pathname: "/(tabs)/(wallet)/wallet-main",
          });
        }
      } catch (error) {
        setStatus("error");
        setMessage("Error verifying payment.");
        alert("Payment verification failed. Please try again.");
        router.replace({
          pathname: "/(tabs)/(wallet)/wallet-main",
        });
      }
    };

    verifyPayment();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {status === "verifying" && <ActivityIndicator size="large" />}
      <Text style={{ marginVertical: 20 }}>{message}</Text>
      {/* {status !== "verifying" && (
        <Button title="Back to Shop" onPress={onDone} />
      )} */}
    </View>
  );
};

export default PaymentCallback;
