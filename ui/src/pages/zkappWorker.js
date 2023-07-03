import { Mina, PublicKey, fetchAccount } from "snarkyjs";

// ---------------------------------------------------------------------------------------

const state = {
  BasicTokenContract: null,
  zkapp: null,
  transaction: null,
};

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args) => {},
  setActiveInstanceToBerkeley: async (args) => {
    const Berkeley = Mina.Network(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args) => {
    const { BasicTokenContract } = await import(
      "../../../contracts/build/src/BasicTokenContract"
    );
    state.BasicTokenContract = BasicTokenContract;
  },
  compileContract: async (args) => {
    await state.BasicTokenContract.compile();
  },
  fetchAccount: async (args) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args) => {
    console.log("instance");
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.BasicTokenContract(publicKey);
  },
  mint: async (args) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp.mint(args);
    });
    state.transaction = transaction;
  },
  withdraw: async (args) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp.withdraw(args);
    });
    state.transaction = transaction;
  },
  sendTokens: async (args) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp.sendTokens(args);
    });
    state.transaction = transaction;
  },
  // getNum: async (args) => {
  //   console.log("worker");
  //   const currentNum = await state.zkapp.num.get();
  //   console.log("worker ended");
  //   return JSON.stringify(currentNum.toJSON());
  // },
  createUpdateTransaction: async (args) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp.update(args);
    });
    state.transaction = transaction;
  },
  proveMintTransaction: async (args) => {
    await state.transaction.prove();
  },
  proveWithdrawTransaction: async (args) => {
    await state.transaction.prove();
  },
  proveSendTokensTransaction: async (args) => {
    await state.transaction.prove();
  },
  proveUpdateTransaction: async (args) => {
    await state.transaction.prove();
  },
  getTransactionJSON: async (args) => {
    return state.transaction.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

// if (process.browser) {
//   addEventListener("message", async (event) => {
//     const returnData = await functions[event.data.fn](event.data.args);

//     const message = {
//       id: event.data.id,
//       data: returnData,
//     };
//     postMessage(message);
//   });
// }
