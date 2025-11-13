import React, { useState } from "react";

import { router, useLocalSearchParams } from "expo-router";
import PaymentCallback from "../components/PaymentCallback";
import PaymentLoader from "../components/PaymentLoader";
import PaymentWebView, { IPaymentData, ITransactionData } from "../components/PaymentWebView";

const PaymentScreen = () => {
  const [view, setView] = useState<"loading" | "webview" | "callback">("loading");
  const [paymentData, setPaymentData] = useState<IPaymentData | null>(null);

  // const [callbackUrl, setCallbackUrl] = useState("");
  
  // const [txnUuid, setTxnUuid] = useState('')
  const [transactionData, setTransactionData] = useState<ITransactionData|null>(null)
  const { amount } = useLocalSearchParams();
  switch (view) {
    case "loading":
      return (
        <PaymentLoader
          onStartPayment={(url) => {
            setPaymentData(url);
            setView("webview");
          }}
          amount={Number(amount) || 0}
        />
      );
    case "webview":
      return (
        paymentData && (
          <PaymentWebView
            paymentUrl={paymentData.url}
            onPaymentCallback={(txnData:ITransactionData) => {
              setTransactionData(txnData)
              setView("callback");
            }}
          />
        )
      );
    case "callback":
      return (
       transactionData &&
        <PaymentCallback
          transactionData={transactionData}
          onDone={() => {
            router.replace({
              pathname: "/(tabs)/(wallet)/wallet-main",
              params: { refresh: Date.now().toString() },
            });
          }}
        />
      );
    default:
      return null;
  }
};

export default PaymentScreen;
