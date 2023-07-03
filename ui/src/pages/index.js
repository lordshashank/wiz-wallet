import { useEffect, useState } from "react";
import "./reactCOIServiceWorker";
import ZkappWorkerClient from "./zkappWorkerClient";
import { PublicKey, Field, Signature } from "snarkyjs";
let transactionFee = 0.1;

export default function App() {
  const [state, setState] = useState({
    zkappWorkerClient: null,
    hasWallet: null,
    hasBeenSetup: false,
    accountExists: true,
    currentNum: null,
    publicKey: null,
    zkappPublicKey: null,
    creatingTransaction: false,
  });
  // -------------------------------------------------------

  // -------------------------------------------------------
  // Do Setup
  useEffect(() => {
    (async () => {
      if (!state.hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();
        console.log("Loading SnarkyJS...");
        // await zkappWorkerClient.loadSnarkyJS();
        console.log("done");
        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = window.mina;
        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }
        const publicKeyBase58 = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);
        console.log("using key", publicKey.toBase58());
        console.log("checking if account exists...");
        const res = await zkappWorkerClient.fetchAccount({
          publicKey,
        });
        console.log(res);
        // const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();
        console.log("compiling zkApp");
        await zkappWorkerClient.compileContract();
        console.log("zkApp compiled");
        const zkappPublicKey = PublicKey.fromBase58(
          "B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA"
        );
        await zkappWorkerClient.initZkappInstance(zkappPublicKey);
        console.log("getting zkApp state...");
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        // const currentNum = await zkappWorkerClient.getNum();

        // console.log("current state:", currentNum.toString());
        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists: true,
        });
      }
    })();
  }, []);
  // -------------------------------------------------------

  // -------------------------------------------------------
  // Create UI elements

  let hasWallet;
  if (state.hasWallet != null && !state.hasWallet) {
    const auroLink = "https://www.aurowallet.com/";
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        {" "}
        [Link]{" "}
      </a>
    );
    hasWallet = (
      <div>
        {" "}
        Could not find a wallet. Install Auro wallet here: {auroLinkElem}
      </div>
    );
  }

  let setupText = state.hasBeenSetup
    ? "SnarkyJS Ready"
    : "Setting up SnarkyJS...";
  let setup = (
    <div>
      {" "}
      {setupText} {hasWallet}
    </div>
  );

  let accountDoesNotExist;
  if (state.hasBeenSetup && !state.accountExists) {
    const faucetLink =
      "https://faucet.minaprotocol.com/?address=" + state.publicKey?.toBase58();
    accountDoesNotExist = (
      <div>
        Account does not exist. Please visit the faucet to fund this account
        <a href={faucetLink} target="_blank" rel="noreferrer">
          {" "}
          [Link]{" "}
        </a>
      </div>
    );
  }

  // -------------------------------------------------------
  // Mint
  const mint = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log("sending a transaction...");
    await state.zkappWorkerClient.fetchAccount({
      publicKey: state.publicKey,
    });
    await state.zkappWorkerClient.mint();
    console.log("creating proof...");
    await state.zkappWorkerClient.proveMintTransaction();
    console.log("getting Transaction JSON...");
    const transactionJSON = await state.zkappWorkerClient.getTransactionJSON();
    console.log("requesting send transaction...");
    const { hash } = await window.mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });
    console.log(
      "See transaction at https://berkeley.minaexplorer.com/transaction/" + hash
    );
    setState({ ...state, creatingTransaction: false });
  };
  // -------------------------------------------------------

  // -------------------------------------------------------
  // Withdraw
  const withdraw = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log("sending a transaction...");
    await state.zkappWorkerClient.fetchAccount({
      publicKey: state.publicKey,
    });
    await state.zkappWorkerClient.withdraw();
    console.log("creating proof...");
    await state.zkappWorkerClient.proveWithdrawTransaction();
    console.log("getting Transaction JSON...");
    const transactionJSON = await state.zkappWorkerClient.getTransactionJSON();
    console.log("requesting send transaction...");
    const { hash } = await window.mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });
    console.log(
      "See transaction at https://berkeley.minaexplorer.com/transaction/" + hash
    );
    setState({ ...state, creatingTransaction: false });
  };

  // -------------------------------------------------------
  // -------------------------------------------------------
  // send tokens
  const sendTokens = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log("sending a transaction...");
    await state.zkappWorkerClient.fetchAccount({
      publicKey: state.publicKey,
    });
    await state.zkappWorkerClient.sendTokens();
    console.log("creating proof...");
    await state.zkappWorkerClient.proveSendTokensTransaction();
    console.log("getting Transaction JSON...");
    const transactionJSON = await state.zkappWorkerClient.getTransactionJSON();
    console.log("requesting send transaction...");
    const { hash } = await window.mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });
    console.log(
      "See transaction at https://berkeley.minaexplorer.com/transaction/" + hash
    );
    setState({ ...state, creatingTransaction: false });
  };

  // -------------------------------------------------------
  // -------------------------------------------------------
  // update
  const sendUpdateTransaction = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log("sending a transaction...");
    await state.zkappWorkerClient.fetchAccount({
      publicKey: state.publicKey,
    });
    await state.zkappWorkerClient.createUpdateTransaction();
    console.log("creating proof...");
    await state.zkappWorkerClient.proveUpdateTransaction();
    console.log("getting Transaction JSON...");
    const transactionJSON = await state.zkappWorkerClient.getTransactionJSON();
    console.log("requesting send transaction...");
    const { hash } = await window.mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });
    console.log(
      "See transaction at https://berkeley.minaexplorer.com/transaction/" + hash
    );
    setState({ ...state, creatingTransaction: false });
  };

  // -------------------------------------------------------

  let mainContent;
  if (state.hasBeenSetup && state.accountExists) {
    mainContent = (
      <div>
        <button onClick={mint}>Mint</button>
        <button>Withdraw</button>
        <button>Send Tokens</button>
        <button>Update</button>
      </div>
    );
  }

  return (
    <div>
      {setup}
      {accountDoesNotExist}
      {mainContent}
    </div>
  );
}
