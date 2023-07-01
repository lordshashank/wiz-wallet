import { MerkleMap, SmartContract, Field, state, State } from 'snarkyjs';

export class addressMapping extends SmartContract {
  @state(Field) mapRoot = State<Field>();
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
  @method setValue(key: Field, value: Field) {
    const map = new MerkleMap(32, 32);
    map.set(key.toBuffer(), value.toBuffer());
    this.mapRoot.set(map.root.toBuffer());
  }

  @method getValue(key: Field): Field {
    const map = new MerkleMap(32, 32, this.mapRoot.get());
    const valueBuffer = map.get(key.toBuffer());
    return Field.fromBuffer(valueBuffer);
  }
}
