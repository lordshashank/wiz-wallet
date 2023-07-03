import { WizWallet } from './WizWallet.js';
import {
  isReady,
  shutdown,
  Mina,
  PrivateKey,
  AccountUpdate,
  UInt64,
  Signature,
  MerkleMap,
  Field,
  Bool,
} from 'snarkyjs';
import {
  OffChainStorage,
  MerkleWitness8,
} from 'experimental-zkapp-offchain-storage';
import { makeAndSendTransaction, loopUntilAccountExists } from './utils.js';

import XMLHttpRequestTs from 'xmlhttprequest-ts';
import { FeePayerSpec } from 'snarkyjs/dist/node/lib/mina.js';
const NodeXMLHttpRequest =
  XMLHttpRequestTs.XMLHttpRequest as any as typeof XMLHttpRequest;

const useLocal = true;
await isReady;

console.log('SnarkyJS loaded');

const proofsEnabled = false;
const Local = Mina.LocalBlockchain({ proofsEnabled });
Mina.setActiveInstance(Local);
const deployerAccount = Local.testAccounts[0].privateKey;
const deployerAddress = deployerAccount.toPublicKey();
// ----------------------------------------------------

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
// console.log(zk);

const storageServerAddress = 'http://localhost:3001';
const serverPublicKey = await OffChainStorage.getPublicKey(
  storageServerAddress,
  NodeXMLHttpRequest
);
console.log('compiling...');

// let { verificationKey } =
await WizWallet.compile();

console.log('compiled');

// ----------------------------------------------------
const contract = new WizWallet(zkAppAddress);

// console.log('deploying...');
// const contract = new WizWallet(zkAppAddress);
// const deploy_txn = await Mina.transaction(deployerAccount.toPublicKey(), () => {
//   AccountUpdate.fundNewAccount(deployerAccount.toPublicKey());
//   contract.deploy({ verificationKey, zkappKey: zkAppPrivateKey });
// });
// await deploy_txn.prove();
// await deploy_txn.sign([deployerAccount]).send();

// console.log('deployed');

// ----------------------------------------------------

console.log('initializing...');

// const init_txn = await Mina.transaction(deployerAccount.toPublicKey(), () => {
//   contract.initState();
// });
if (useLocal) {
  const transaction = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    contract.deploy({ zkappKey: zkAppPrivateKey });
    contract.initState(serverPublicKey);
  });
  transaction.sign([zkAppPrivateKey, deployerAccount]);
  await transaction.prove();
  await transaction.send();
} else {
  let zkAppAccount = await loopUntilAccountExists({
    account: zkAppPrivateKey.toPublicKey(),
    eachTimeNotExist: () =>
      console.log('waiting for zkApp account to be deployed...'),
    isZkAppAccount: true,
  });
}
// await init_txn.prove();
// await init_txn.sign([deployerAccount]).send();

console.log('initialized');

// ----------------------------------------------------

console.log('minting...');

const mintAmount = UInt64.from(10);

const mintSignature = Signature.create(
  zkAppPrivateKey,
  mintAmount.toFields().concat(zkAppAddress.toFields())
);

const mint_txn = await Mina.transaction(deployerAccount.toPublicKey(), () => {
  AccountUpdate.fundNewAccount(deployerAccount.toPublicKey());
  contract.mint(zkAppAddress, mintAmount, mintSignature);
});

await mint_txn.prove();
await mint_txn.sign([deployerAccount]).send();

console.log('minted');

console.log(
  contract.totalAmountInCirculation.get() +
    ' ' +
    Mina.getAccount(zkAppAddress)?.tokenSymbol
);

// ----------------------------------------------------

console.log('sending...');

const sendAmount = UInt64.from(3);
const map = new MerkleMap();

const rootBefore = map.getRoot();

const key = Field(100);
const valueBefore = map.get(key);
const witness = map.getWitness(key);
const send_txn = await Mina.transaction(deployerAccount.toPublicKey(), () => {
  AccountUpdate.fundNewAccount(deployerAccount.toPublicKey());
  contract.sendTokens(
    witness,
    deployerAccount.toPublicKey(),
    sendAmount,
    valueBefore
  );
});
await send_txn.prove();
await send_txn.sign([deployerAccount]).send();

console.log('sent');

console.log(
  contract.totalAmountInCirculation.get() +
    ' ' +
    Mina.getAccount(zkAppAddress).tokenSymbol
);

// ----------------------------------------------------

console.log(
  'deployer tokens:',
  Mina.getBalance(
    deployerAccount.toPublicKey(),
    contract.token.id
  ).value.toBigInt()
);

console.log(
  'zkapp tokens:',
  Mina.getBalance(zkAppAddress, contract.token.id).value.toBigInt()
);

// ----------------------------------------------------
const height = 8;
const transactionFee = 100_000_000;

const treeHeight = 8;

async function updateTree() {
  const index = BigInt(Math.floor(Math.random() * 4));

  // get the existing tree
  const treeRoot = await contract.storageTreeRoot.get();
  const idx2fields = await OffChainStorage.get(
    storageServerAddress,
    zkAppAddress,
    treeHeight,
    treeRoot,
    NodeXMLHttpRequest
  );

  const tree = OffChainStorage.mapToTree(treeHeight, idx2fields);
  const leafWitness = new MerkleWitness8(tree.getWitness(BigInt(index)));

  // get the prior leaf
  const priorLeafIsEmpty = !idx2fields.has(index);
  let priorLeafNumber: Field;
  let newLeafNumber: Field;
  if (!priorLeafIsEmpty) {
    priorLeafNumber = idx2fields.get(index)![0];
    newLeafNumber = priorLeafNumber.add(3);
  } else {
    priorLeafNumber = Field.zero;
    newLeafNumber = Field.one;
  }

  // update the leaf, and save it in the storage server
  idx2fields.set(index, [newLeafNumber]);

  const [storedNewStorageNumber, storedNewStorageSignature] =
    await OffChainStorage.requestStore(
      storageServerAddress,
      zkAppAddress,
      treeHeight,
      idx2fields,
      NodeXMLHttpRequest
    );

  console.log(
    'changing index',
    index,
    'from',
    priorLeafNumber.toString(),
    'to',
    newLeafNumber.toString()
  );

  // update the smart contract

  const doUpdate = () => {
    contract.updateOffchain(
      Bool(priorLeafIsEmpty),
      priorLeafNumber,
      newLeafNumber,
      leafWitness,
      storedNewStorageNumber,
      storedNewStorageSignature
    );
  };

  if (useLocal) {
    const spec: FeePayerSpec = {
      sender: deployerAddress,
      fee: transactionFee,
    };
    const updateTransaction = await Mina.transaction(spec, () => {
      doUpdate();
    });

    updateTransaction.sign([zkAppPrivateKey, deployerAccount]);
    await updateTransaction.prove();
    await updateTransaction.send();
  } else {
    await makeAndSendTransaction({
      feePayerPrivateKey: deployerAccount,
      zkAppPublicKey: zkAppAddress,
      mutateZkApp: () => doUpdate(),
      transactionFee: transactionFee,
      getState: () => contract.storageTreeRoot.get(),
      statesEqual: (root1, root2) => root1.equals(root2).toBoolean(),
    });
  }

  console.log('root updated to', contract.storageTreeRoot.get().toString());
}
console.log('Shutting down');

await shutdown();
