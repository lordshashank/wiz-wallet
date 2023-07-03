import { fetchAccount, PublicKey, PrivateKey, Field } from "snarkyjs";

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

  fetchAccount({ publicKey }) {
    const result = this._call("fetchAccount", {
      publicKey58: publicKey.toBase58(),
    });
    return result;
  }

  initZkappInstance(publicKey) {
    console.log("instance");
    return this._call("initZkappInstance", {
      publicKey58: publicKey.toBase58(),
    });
  }

  // async getNum() {
  //   console.log("started");
  //   const result = await this._call("getNum", {});
  //   console.log("ended");
  //   return Field.fromJSON(JSON.parse(result));
  // }

  mint(args) {
    return this._call("mint", args);
  }

  proveMintTransaction() {
    return this._call("proveMintTransaction", {});
  }
  withdraw(args) {
    return this._call("withdraw", { args });
  }
  proveWithdrawTransaction() {
    return this._call("proveWithdrawTransaction", {});
  }
  sendTokens(args) {
    return this._call("sendTokens", { args });
  }
  proveSendTokensTransaction() {
    return this._call("proveSendTokensTransaction", {});
  }
  createUpdateTransaction(args) {
    return this._call("createUpdateTransaction", { args });
  }
  proveUpdateTransactiion() {
    return this._call("proveUpdateTransaction", {});
  }
  async getTransactionJSON() {
    const result = await this._call("getTransactionJSON", {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker;

  promises;

  nextId;

  constructor() {
    this.worker = new Worker(new URL("./zkappWorker.js", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn, args) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
      this.promises[this.nextId - 1].resolve();
    });
  }
}
