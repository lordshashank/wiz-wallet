import { fetchAccount, PublicKey, PrivateKey, Field } from "snarkyjs";

import type {
  ZkappWorkerRequest,
  ZkappWorkerReponse,
  WorkerFunctions,
} from "./zkappWorker";
import {
  updateType,
  withdrawType,
  sendTokensType,
  mintType,
} from "../types/types";

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  loadSnarkyJS() {
    return this._call("loadSnarkyJS", {});
  }

  setActiveInstanceToBerkeley() {
    return this._call("setActiveInstanceToBerkeley", {});
  }

  loadContract() {
    return this._call("loadContract", {});
  }

  compileContract() {
    return this._call("compileContract", {});
  }

  fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey;
  }): ReturnType<typeof fetchAccount> {
    const result = this._call("fetchAccount", {
      publicKey58: publicKey.toBase58(),
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call("initZkappInstance", {
      publicKey58: publicKey.toBase58(),
    });
  }

  // async getNum(): Promise<Field> {
  //   const result = await this._call('getNum', {});
  //   return Field.fromJSON(JSON.parse(result as string));
  // }

  createUpdateTransaction(args: updateType) {
    return this._call("createUpdateTransaction", args);
  }
  createWithdrawTransaction(args: withdrawType) {
    return this._call("createWithdrawTransaction", args);
  }
  createSendTokensTransaction(args: sendTokensType) {
    return this._call("createSendTokensTransaction", args);
  }
  createMintTransaction(args: mintType) {
    return this._call("createMintTransaction", args);
  }
  // createUpdateOffChainTransaction() {
  //   return this._call("createUpdateOffChainTransaction", {});
  // }

  proveUpdateTransaction() {
    return this._call("proveUpdateTransaction", {});
  }

  async getTransactionJSON() {
    const result = await this._call("getTransactionJSON", {});
    return result;
  }
  async getTreeRoot() {
    const treeRoot = await this._call("getTreeRoot", {});
    return treeRoot;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./zkappWorker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
