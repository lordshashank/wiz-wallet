import {
  Mina,
  isReady,
  PublicKey,
  fetchAccount,
  UInt64,
  Field,
  MerkleMapWitness,
  Signature,
} from "snarkyjs";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { BasicTokenContract } from "../../contracts/src/BasicTokenContract";

import type {
  updateType,
  withdrawType,
  sendTokensType,
  mintType,
} from "../types/types";

const state = {
  BasicTokenContract: null as null | typeof BasicTokenContract,
  zkapp: null as null | BasicTokenContract,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { BasicTokenContract } = await import(
      "../../contracts/build/src/BasicTokenContract.js"
    );
    state.BasicTokenContract = BasicTokenContract;
  },
  compileContract: async (args: {}) => {
    await state.BasicTokenContract!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.BasicTokenContract!(publicKey);
  },
  // getNum: async (args: {}) => {
  //   const currentNum = await state.zkapp!.num.get();
  //   return JSON.stringify(currentNum.toJSON());
  // },
  createUpdateTransaction: async (args: updateType) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.update(
        args!.keyWitness,
        args!.keyToChange,
        args!.valueBefore,
        args!.valueAfter
      );
    });
    state.transaction = transaction;
  },
  createMintTransaction: async (args: mintType) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.mint(
        args!.receiverAddress,
        args!.amount,
        args!.adminSignature
      );
    });
    state.transaction = transaction;
  },
  createWithdrawTransaction: async (args: withdrawType) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.withdraw(
        args!.keyWitness,
        args!.receiverAddress,
        args!.amount
      );
    });
    state.transaction = transaction;
  },
  createSendTokensTransaction: async (args: sendTokensType) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.sendTokens(
        args!.keyWitness,
        args!.receiverAddress,
        args!.amount,
        args!.valueBefore
      );
    });
    state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};
if (process.browser) {
  addEventListener(
    "message",
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}
