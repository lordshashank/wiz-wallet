import {
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  UInt64,
  PublicKey,
  Signature,
  Field,
  MerkleMapWitness,
  MerkleMap,
  Bool,
  MerkleTree,
} from 'snarkyjs';

const tokenSymbol = 'WIZ';
import {
  OffChainStorage,
  Update,
  MerkleWitness8,
} from 'experimental-zkapp-offchain-storage';

export class WizWallet extends SmartContract {
  @state(UInt64) totalAmountInCirculation = State<UInt64>();
  @state(Field) mapRoot = State<Field>();
  @state(PublicKey) storageServerPublicKey = State<PublicKey>();
  @state(Field) storageNumber = State<Field>();
  @state(Field) storageTreeRoot = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);

    const permissionToEdit = Permissions.proof();

    this.account.permissions.set({
      ...Permissions.default(),
      editState: permissionToEdit,
      setTokenSymbol: permissionToEdit,
      send: permissionToEdit,
      receive: permissionToEdit,
    });
  }

  @method initState(storageServerPublicKey: PublicKey) {
    super.init();
    this.account.tokenSymbol.set(tokenSymbol);
    this.totalAmountInCirculation.set(UInt64.zero);
    // this.mapRoot.set(Field(0));
    this.storageServerPublicKey.set(storageServerPublicKey);
    this.storageNumber.set(Field(0));

    const emptyTreeRoot = new MerkleTree(8).getRoot();
    this.storageTreeRoot.set(emptyTreeRoot);
  }

  @method mint(
    receiverAddress: PublicKey,
    amount: UInt64,
    adminSignature: Signature
  ) {
    let totalAmountInCirculation = this.totalAmountInCirculation.get();
    this.totalAmountInCirculation.assertEquals(totalAmountInCirculation);

    let newTotalAmountInCirculation = totalAmountInCirculation.add(amount);

    adminSignature
      .verify(
        this.address,
        amount.toFields().concat(receiverAddress.toFields())
      )
      .assertTrue();

    this.token.mint({
      address: this.address,
      amount,
    });
    // setting the address mapping to the token amount
    const map = new MerkleMap();
    // const stringAmount: string = amount.toString();
    const stringAmount: string = '10';
    map.set(Field(1), Field(stringAmount));
    this.mapRoot.set(map.getRoot());

    this.totalAmountInCirculation.set(newTotalAmountInCirculation);
  }

  @method sendTokens(
    keyWitness: MerkleMapWitness,
    receiverAddress: PublicKey,
    amount: UInt64,
    valueBefore: Field
  ) {
    // compute the root after incrementing
    const [rootAfter, _] = keyWitness.computeRootAndKey(
      valueBefore.sub(Field(10))
    );

    // set the new root
    this.mapRoot.set(rootAfter);
    //send the tokens
    this.token.send({
      from: this.address,
      to: receiverAddress,
      amount,
    });
  }

  @method update(
    keyWitness: MerkleMapWitness,
    keyToChange: Field,
    valueBefore: Field,
    valueAfter: Field
  ) {
    const initialRoot = this.mapRoot.get();
    this.mapRoot.assertEquals(initialRoot);

    // check the initial state matches what we expect
    const [rootBefore, key] = keyWitness.computeRootAndKey(valueBefore);
    rootBefore.assertEquals(initialRoot);

    key.assertEquals(keyToChange);

    // compute the root after incrementing
    const [rootAfter, _] = keyWitness.computeRootAndKey(valueAfter);

    // set the new root
    this.mapRoot.set(rootAfter);
  }
  @method updateOffchain(
    leafIsEmpty: Bool,
    oldNum: Field,
    num: Field,
    path: MerkleWitness8,
    storedNewRootNumber: Field,
    storedNewRootSignature: Signature
  ) {
    const storedRoot = this.storageTreeRoot.get();
    this.storageTreeRoot.assertEquals(storedRoot);

    let storedNumber = this.storageNumber.get();
    this.storageNumber.assertEquals(storedNumber);

    let storageServerPublicKey = this.storageServerPublicKey.get();
    this.storageServerPublicKey.assertEquals(storageServerPublicKey);

    let leaf = [oldNum];
    let newLeaf = [num];

    // newLeaf can be a function of the existing leaf
    // newLeaf[0].assertGt(leaf[0]);

    const updates = [
      {
        leaf,
        leafIsEmpty,
        newLeaf,
        newLeafIsEmpty: Bool(false),
        leafWitness: path,
      },
    ];

    const storedNewRoot = OffChainStorage.assertRootUpdateValid(
      storageServerPublicKey,
      storedNumber,
      storedRoot,
      updates,
      storedNewRootNumber,
      storedNewRootSignature
    );

    this.storageTreeRoot.set(storedNewRoot);
    this.storageNumber.set(storedNewRootNumber);
  }
  @method withdraw(
    keyWitness: MerkleMapWitness,
    receiverAddress: PublicKey,
    amount: UInt64
  ) {
    // compute the root after incrementing
    const [rootAfter, _] = keyWitness.computeRootAndKey(Field(0));

    // set the new root
    this.mapRoot.set(rootAfter);
    //send the tokens
    this.token.send({
      from: this.address,
      to: receiverAddress,
      amount,
    });
  }
}
