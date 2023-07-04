import "../styles/globals.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";

import "./reactCOIServiceWorker";

let transactionFee = 0.1;

export default function App({ Component, pageProps }: AppProps) {
  // -------------------------------------------------------
  // Refresh the current state

  // const onRefreshCurrentNum = async () => {
  //   console.log('getting zkApp state...');
  //   await state.zkappWorkerClient!.fetchAccount({
  //     publicKey: state.zkappPublicKey!,
  //   });
  //   const currentNum = await state.zkappWorkerClient!.getNum();
  //   console.log('current state:', currentNum.toString());

  //   setState({ ...state, currentNum });
  // };

  // -------------------------------------------------------
  // Create UI elements

  return (
    <div>
      {/* {setup}
      {accountDoesNotExist}
      {mainContent} */}
      <Component {...pageProps} />
    </div>
  );
}
