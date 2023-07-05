import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TokensDetails from "../components/TokenDetails";
import { useState, useEffect } from "react";
import ZkappWorkerClient from "./zkappWorkerClient";
import keys from "../../contracts/keys/wizwallet.json";

import {
  PublicKey,
  Field,
  PrivateKey,
  Signature,
  UInt64,
  MerkleMap,
} from "snarkyjs";

let transactionFee = 0.1;

export default function Home() {
  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    (async () => {
      if (!state.hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();

        console.log("Loading SnarkyJS...");
        await zkappWorkerClient.loadSnarkyJS();
        console.log("done");

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log("using key", publicKey.toBase58());

        console.log("checking if account exists...");
        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey,
        });
        console.log(res);
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log("compiling zkApp");
        await zkappWorkerClient.compileContract();
        console.log("zkApp compiled");

        const zkappPublicKey = PublicKey.fromBase58(keys.publicKey);

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log("getting zkApp state...");
        // await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        // const currentNum = await zkappWorkerClient.getNum();
        // console.log('current state:', currentNum.toString());

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
        });
      }
    })();
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          console.log("checking if account exists...");
          const res = await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!,
          });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  // -------------------------------------------------------
  // update

  // const update = async () => {
  //   setState({ ...state, creatingTransaction: true });
  //   console.log("sending a transaction...");

  //   await state.zkappWorkerClient!.fetchAccount({
  //     publicKey: state.publicKey!,
  //   });

  //   await state.zkappWorkerClient!.createUpdateTransaction();

  //   console.log("creating proof...");
  //   await state.zkappWorkerClient!.proveUpdateTransaction();

  //   console.log("getting Transaction JSON...");
  //   const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

  //   console.log("requesting send transaction...");
  //   const { hash } = await (window as any).mina.sendTransaction({
  //     transaction: transactionJSON,
  //     feePayer: {
  //       fee: transactionFee,
  //       memo: "",
  //     },
  //   });

  //   console.log(
  //     "See transaction at https://berkeley.minaexplorer.com/transaction/" + hash
  //   );

  //   setState({ ...state, creatingTransaction: false });
  // };
  // -------------------------------------------------------
  // Withdraw

  const withdraw = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log("sending a transaction...");

    const sendAmount = UInt64.from(3);
    const map = new MerkleMap();

    const key = Field(100);
    const witness = map.getWitness(key);

    const args = {
      keyWitness: witness,
      receiverAddress: state.publicKey!,
      amount: sendAmount,
    };

    try {
      await state.zkappWorkerClient!.fetchAccount({
        publicKey: state.publicKey!,
      });

      await state.zkappWorkerClient!.createWithdrawTransaction(args);

      console.log("creating proof...");
      await state.zkappWorkerClient!.proveUpdateTransaction();

      console.log("getting Transaction JSON...");
      const transactionJSON =
        await state.zkappWorkerClient!.getTransactionJSON();

      console.log("requesting send transaction...");
      const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
          fee: transactionFee,
          memo: "",
        },
      });

      console.log(
        "See transaction at https://berkeley.minaexplorer.com/transaction/" +
          hash
      );

      setState({ ...state, creatingTransaction: false });
    } catch (error) {
      console.log(error);
      setState({ ...state, creatingTransaction: false });
    }
  };
  // -------------------------------------------------------
  // Send Tokens

  const sendTokens = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log("sending a transaction...");

    const sendAmount = UInt64.from(3);
    const map = new MerkleMap();

    const key = Field(100);
    const valueBefore = map.get(key);
    const witness = map.getWitness(key);
    const args = {
      keyWitness: witness,
      receiverAddress: state.publicKey!,
      amount: sendAmount,
      valueBefore: valueBefore,
    };

    try {
      await state.zkappWorkerClient!.fetchAccount({
        publicKey: state.publicKey!,
      });

      await state.zkappWorkerClient!.createSendTokensTransaction(args);

      console.log("creating proof...");
      await state.zkappWorkerClient!.proveUpdateTransaction();

      console.log("getting Transaction JSON...");
      const transactionJSON =
        await state.zkappWorkerClient!.getTransactionJSON();

      console.log("requesting send transaction...");
      const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
          fee: transactionFee,
          memo: "",
        },
      });

      console.log(
        "See transaction at https://berkeley.minaexplorer.com/transaction/" +
          hash
      );

      setState({ ...state, creatingTransaction: false });
    } catch (error) {
      console.log(error);
      setState({ ...state, creatingTransaction: false });
    }
  };
  // -------------------------------------------------------
  // mint

  const mint = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log("sending a transaction...");
    const mintAmount = UInt64.from(10);
    const zkAppPrivateKey = PrivateKey.fromBase58(keys.privateKey);
    const zkAppAddress = PublicKey.fromBase58(keys.publicKey);
    const mintFields = mintAmount.toFields();
    const keyFields = zkAppAddress.toFields();

    const mintSignature = Signature.create(
      zkAppPrivateKey,
      mintFields.concat(keyFields)
    );
    const args = {
      receiverAddress: state.zkappPublicKey!,
      amount: mintAmount,
      adminSignature: mintSignature,
    };

    try {
      await state.zkappWorkerClient!.fetchAccount({
        publicKey: state.publicKey!,
      });

      await state.zkappWorkerClient!.createMintTransaction(args);

      console.log("creating proof...");
      await state.zkappWorkerClient!.proveUpdateTransaction();

      console.log("getting Transaction JSON...");
      const transactionJSON =
        await state.zkappWorkerClient!.getTransactionJSON();

      console.log("requesting send transaction...");
      const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
          fee: transactionFee,
          memo: "",
        },
      });

      console.log(
        "See transaction at https://berkeley.minaexplorer.com/transaction/" +
          hash
      );

      setState({ ...state, creatingTransaction: false });
    } catch (error) {
      console.log(error);
      setState({ ...state, creatingTransaction: false });
    }
  };

  // -------------------------------------------------------
  // update Off Chain

  const updateOffChain = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log("sending a transaction...");

    // const height = 8;
    // const transactionFee = 100_000_000;
    // const NodeXMLHttpRequest =
    //   XMLHttpRequestTs.XMLHttpRequest as any as typeof XMLHttpRequest;
    // const storageServerAddress = "http://localhost:3001";

    // const treeHeight = 8;

    // const index = BigInt(Math.floor(Math.random() * 4));

    // // get the existing tree
    // const treeRoot = await state.zkappWorkerClient?.getTreeRoot();
    // const idx2fields = await OffChainStorage.get(
    //   storageServerAddress,
    //   state.zkappPublicKey!,
    //   treeHeight,
    //   treeRoot,
    //   NodeXMLHttpRequest
    // );

    // const tree = OffChainStorage.mapToTree(treeHeight, idx2fields);
    // const leafWitness = new MerkleWitness8(tree.getWitness(BigInt(index)));

    // // get the prior leaf
    // const priorLeafIsEmpty = !idx2fields.has(index);
    // let priorLeafNumber: Field;
    // let newLeafNumber: Field;
    // if (!priorLeafIsEmpty) {
    //   priorLeafNumber = idx2fields.get(index)![0];
    //   newLeafNumber = priorLeafNumber.add(3);
    // } else {
    //   priorLeafNumber = Field.zero;
    //   newLeafNumber = Field.one;
    // }

    // // update the leaf, and save it in the storage server
    // idx2fields.set(index, [newLeafNumber]);

    // const [storedNewStorageNumber, storedNewStorageSignature] =
    //   await OffChainStorage.requestStore(
    //     storageServerAddress,
    //     state.zkappPublicKey,
    //     treeHeight,
    //     idx2fields,
    //     NodeXMLHttpRequest
    //   );

    // const args = {
    //   leafIsEmpty: priorLeafIsEmpty,
    //   oldNum: priorLeafNumber,
    //   num: newLeafNumber,
    //   path: storageServerAddress,
    //   storedNewRootNumber: storedNewStorageNumber,
    //   storedNewRootSignature: storedNewStorageSignature,
    // };
    try {
      await state.zkappWorkerClient!.fetchAccount({
        publicKey: state.publicKey!,
      });

      // await state.zkappWorkerClient!.createUpdateOffChainTransaction();

      console.log("creating proof...");
      await state.zkappWorkerClient!.proveUpdateTransaction();

      console.log("getting Transaction JSON...");
      const transactionJSON =
        await state.zkappWorkerClient!.getTransactionJSON();

      console.log("requesting send transaction...");
      const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
          fee: transactionFee,
          memo: "",
        },
      });

      console.log(
        "See transaction at https://berkeley.minaexplorer.com/transaction/" +
          hash
      );

      setState({ ...state, creatingTransaction: false });
    } catch (error) {
      console.log(error);
      setState({ ...state, creatingTransaction: false });
    }
  };
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

  let setupText = state.hasBeenSetup ? null : "Setting up SnarkyJS...";
  let setup = (
    <div>
      {" "}
      {setupText} {hasWallet}
    </div>
  );

  let accountDoesNotExist;
  if (state.hasBeenSetup && !state.accountExists) {
    const faucetLink =
      "https://faucet.minaprotocol.com/?address=" + state.publicKey!.toBase58();
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

  let mainContent;
  if (state.hasBeenSetup && state.accountExists) {
    mainContent = (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <Sidebar />
          <TokensDetails
            mint={mint}
            withdraw={withdraw}
            sendTokens={sendTokens}
            updateOffChain={updateOffChain}
            creatingTransaction={state.creatingTransaction}
            contractAddress={
              "B62qin2Yj5Zt5yBc4EUGAdCq2MJL7NEPEsD7M6oRA1kwxn8VWhVPS8y"
            }
          />
        </main>
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
