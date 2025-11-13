// import React, { useState } from "react";

// import PaymentCallback from "../../../src/features/payments/components/PaymentCallback";
// import PaymentWebView from "../../../src/features/payments/components/PaymentWebView";
// import ShopScreen from "../../../src/features/payments/components/ShopScreen";

// const App = () => {
//   const [view, setView] = useState<"shop" | "webview" | "callback">("shop");
//   const [paymentUrl, setPaymentUrl] = useState("");
//   const [callbackUrl, setCallbackUrl] = useState("");

//   switch (view) {
//     case "shop":
//       return <ShopScreen onStartPayment={(url) => { setPaymentUrl(url); setView("webview"); }} />;
//     case "webview":
//       return <PaymentWebView paymentUrl={paymentUrl} onPaymentCallback={(url) => { setCallbackUrl(url); setView("callback"); }} />;
//     case "callback":
//       return <PaymentCallback callbackUrl={callbackUrl} onDone={() => setView("shop")} />;
//     default:
//       return null;
//   }
// };

// export default App;

import PaymentScreen from "@/src/features/payments/screens/PaymentScreen";

const PaymentPage = () =>{
    return <PaymentScreen/> 
}

export default PaymentPage;