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
interface updateType {
  keyWitness: MerkleMapWitness;
  keyToChange: Field;
  valueBefore: Field;
  valueAfter: Field;
}

interface withdrawType {
  keyWitness: MerkleMapWitness;
  receiverAddress: PublicKey;
  amount: UInt64;
}

interface sendTokensType {
  keyWitness: MerkleMapWitness;
  receiverAddress: PublicKey;
  amount: UInt64;
  valueBefore: Field;
}

interface mintType {
  receiverAddress: PublicKey;
  amount: UInt64;
  adminSignature: Signature;
}

export type { updateType, withdrawType, sendTokensType, mintType };
