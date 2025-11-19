import { BASE_URL } from "@/environment";
import { RootState } from "@/src/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { getAuthHeaders } from "../utils/api";
interface Product {
  id: number;
  name: string;
  price: number;
  available: number;
  quantity: number;
}

interface Props {
  onStartPayment: (paymentUrl: { url: string; postData: any }) => void;
  amount: number;
}

const PaymentLoader: React.FC<Props> = ({ amount, onStartPayment }) => {
  const jwtToken = useSelector((state: any) => state.auth.token);
  const { currency } = useSelector((state: RootState) => state.appConfig);

  useEffect(() => {
    handlePayment();

    return () => {};
  }, []);

  const handlePayment = async () => {
    console.log("Initiating payment...", jwtToken, amount);
    if (!jwtToken) return alert("JWT Token required");

    const merchantTxnId = `TXN_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;

    const paymentData = {
      amount: amount.toFixed(2),
      currency: currency?.code || "QAR",
      merchantTransactionId: merchantTxnId,
      returnUrl: `${BASE_URL}/payment/callback`,
      language: "eng",
      merchantVar1: "",
      merchantVar2: "",
      merchantVar3: "",
      merchantVar4: "",
    };

    await AsyncStorage.setItem("lastMerchantTxnId", merchantTxnId);

    try {
      const response = await fetch(`${BASE_URL}/payment/initiate`, {
        method: "POST",
        headers: getAuthHeaders(jwtToken),
        body: JSON.stringify(paymentData),
      });

      if (response.status === 401) {
        alert("Invalid JWT token. Please check your token.");
        await AsyncStorage.multiRemove([
          "jwtToken",
          "lastMerchantTxnId",
          "lastTransactionUUID",
        ]);
        router.replace({
          pathname: "/(tabs)/(wallet)/wallet-main",
        });
        return;
      }

      const result = await response.json();
      console.log("Payment initiation result:", result);

      if (result.success && result.paymentUrl) {
        await AsyncStorage.setItem(
          "lastTransactionUUID",
          result.transactionUUID
        );

        // Instead of just onStartPayment(url),
        // also pass the POST data we want to send to QNB
        const finalUrl=`${BASE_URL}${result.formRedirectUrl}` //result.paymentUrl,
        console.log("Final Payment URL:", finalUrl);
        onStartPayment({
          url:finalUrl,
          postData: paymentData,
        });
      } else {
        alert(result.errorMessage || "Payment initiation failed");
        router.replace({
          pathname: "/(tabs)/(wallet)/wallet-main",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initiation failed. Please try again.");
      router.replace({
        pathname: "/(tabs)/(wallet)/wallet-main",
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default PaymentLoader;
