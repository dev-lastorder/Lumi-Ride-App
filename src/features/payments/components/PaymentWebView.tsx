// import React from "react";
// import { WebView } from "react-native-webview";

export interface IPaymentData {
  url: string;
  postData: Record<string, any>;
}

export interface ITransactionData {
  txnUuid: string;
  merchantId: string;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
// interface Props {
//   paymentData: IPaymentData;
//   onPaymentCallback: (callbackUrl: string) => void;
// }

// const PaymentWebView: React.FC<Props> = ({
//   paymentData,
//   onPaymentCallback,
// }) => {
//   // Convert the form data object to URL-encoded format (like HTML forms do)
//   const postBody = Object.entries(paymentData.postData)
//     .map(
//       ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
//     )
//     .join("&");

//     console.log("PaymentWebView postBody:", postBody);

//   return (
//     <WebView
//       source={{
//         uri: paymentData.url,
//         method: "POST",
//         body: postBody,
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }}
//       onNavigationStateChange={(navState) => {
//         if (navState.url.includes("payment/callback")) {
//           onPaymentCallback(navState.url);
//         }
//       }}
//     />
//   );
// };

// export default PaymentWebView;

import React, { useCallback } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";

interface IPaymentWebView {
  paymentUrl: string;
  txnUuid?: string | null;
  onPaymentCallback: (transactionData: ITransactionData) => void;
}

const PaymentWebView = ({
  paymentUrl,
  txnUuid,
  onPaymentCallback,
}: IPaymentWebView) => {
  if (!paymentUrl) return null;

  const insets = useSafeAreaInsets();
  const urlObj = new URL(paymentUrl);
  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;
  const txnUuidFromUrl = txnUuid || urlObj.searchParams.get("TXN_UUID");
  const jwtToken = useSelector((state: any) => state.auth.token);
  // HTML form that auto-submits
  const formHtml = `
    <html>
      <body onload="document.forms[0].submit();">
        <form method="POST" action="${baseUrl}">
          ${
            txnUuidFromUrl
              ? `<input type="hidden" name="TXN_UUID" value="${txnUuidFromUrl}" />`
              : ""
          }
          <input type="hidden" name="MERCHANT_ID" value="001700001010800" />
        </form>
        <p>Redirecting to payment gateway...</p>
      </body>
    </html>
  `;

  const handlePaymentCallback = useCallback(
    async (callbackData: any) => {
      try {
        // setCallbackStatus({
        //   status: "verifying",
        //   message: "Verifying your payment...",
        //   transactionDetails: null,
        // });

        // Extract URL params from QNB redirect
        // const urlParams = new URLSearchParams(callbackUrl.split("?")[1]);
        const txnUuid = callbackData.transaction.uuid;
        const status = callbackData.transaction.status;
        const bankRefId = callbackData.transaction.bankReference;
        const authCode = callbackData.transaction.authCode;
        const errorCode = callbackData.transaction.errorCode;
        const errorMsg = callbackData.transaction.errorMsg;
        const merchandId = callbackData.transaction.merchantId;
        console.log("🔍 Callback parameters from QNB redirect:", {
          txnUuid,
          status,
          bankRefId,
          authCode,
          errorCode,
          errorMsg,
        });

        // Read locally stored transaction info (use AsyncStorage instead of localStorage)
        const merchantTxnId = await AsyncStorage.getItem("lastMerchantTxnId");
        const storedTxnUuid = await AsyncStorage.getItem("lastTransactionUUID");

        // ✅ If payment was successful
        if (txnUuid && status === "ACCEPTED") {
          console.log("🔄 Verifying successful payment with backend...");

          // const response = await fetch("http://localhost:3000/payment/verify", {
          //   method: "POST",
          //   headers: getAuthHeaders(jwtToken),
          //   body: JSON.stringify({
          //     transactionUUID: txnUuid,
          //     merchantTransactionId: merchantTxnId,
          //   }),
          // });

          // const verification = await response.json();

          // if (verification.success) {
          //   // setCallbackStatus({
          //   //   status: "success",
          //   //   message: "Payment completed successfully!",
          //   //   transactionDetails: verification,
          //   // });

          //   await AsyncStorage.multiRemove([
          //     "lastMerchantTxnId",
          //     "lastTransactionUUID",
          //   ]);

          //   // setTimeout(() => navigation.replace("PaymentSuccessScreen"), 3000);
          // } else {
          //   setCallbackStatus({
          //     status: "failed",
          //     message: `Payment verification failed: ${verification.errorMessage}`,
          //     transactionDetails: verification,
          //   });
          // }
          onPaymentCallback({
            txnUuid: txnUuid,
            merchantId: merchandId,
          });
          return;
        }

        // ❌ If payment failed
        if (errorCode) {
          Alert.alert(
            "Payment Failed",
            `Error ${errorCode}: ${errorMsg || ""}`
          );
          // setCallbackStatus({
          //   status: "failed",
          //   message: `Payment failed: ${errorMsg || "Unknown error"}`,
          //   transactionDetails: null,
          // });
          return;
        }

        throw new Error("Unable to verify payment status");
      } catch (error) {
        console.error("❌ Callback error:", error);

        Alert.alert(
          "Payment Failed",
          "Error verifying payment. Please contact support."
        );
        // setCallbackStatus({
        //   status: "error",
        //   message: "Error verifying payment. Please contact support.",
        //   transactionDetails: null,
        // });
      }
    },
    [jwtToken]
  );

  const handleNavigationChange = (event) => {
    console.log("🌐 WebView navigated to:", event);

    // Replace with your backend callback/return URL domain
    // if (event.url.includes("yourapp.com/payment/callback")) {
    //   handlePaymentCallback(event.url);
    // }
  };

  const injectedJS = `
    if (window.location.href.includes("/payment/callback")) {
      window.ReactNativeWebView.postMessage(document.body.innerText);
    }
    true; 
  `;

  const handleMessage = async (event) => {
    try {
      const data = event.nativeEvent.data;
      console.log("📦 Raw message from WebView:", data);

      // Parse JSON safely
      const parsed = JSON.parse(data);
      console.log("✅ Parsed callback data:", parsed);

      if (!!parsed) {
        handlePaymentCallback(parsed);
      }
    } catch (err) {
      console.warn("Failed to parse WebView message:", err);
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        paddingBottom: insets.bottom + 50,
      }}
    >
      <WebView
        originWhitelist={["*"]}
        source={{ html: formHtml, baseUrl }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator style={{ flex: 1 }} />}
        onNavigationStateChange={handleNavigationChange}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
        // source={{ uri: qnbPaymentUrl }}
        // javaScriptEnabled={true}
        // domStorageEnabled={true}
        // originWhitelist={['*']}
        mixedContentMode="always"
        userAgent="LumiApp/1.0 LumiSec-UA/a83f91c2e9b74d12"
      />
    </View>
  );
};

export default PaymentWebView;
