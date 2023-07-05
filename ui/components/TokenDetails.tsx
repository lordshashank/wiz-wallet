import { BlockList } from "net";
import styles from "../styles/Header.module.css";

interface TokenDetailsProps {
  mint: () => void;
  withdraw: () => void;
  sendTokens: () => void;
  updateOffChain: () => {};
  creatingTransaction: boolean;
  contractAddress: string;
}
const TokenDetails: React.FC<TokenDetailsProps> = ({
  mint,
  withdraw,
  sendTokens,
  updateOffChain,
  creatingTransaction,
  contractAddress,
}) => {
  return (
    <div className={styles["token-details"]}>
      <div className={styles.details}>
        <div>
          No. of Tokens: <span style={{ color: "rgb(98, 0, 238)" }}>10</span>
        </div>
        <div>
          Contract Address:{" "}
          <span style={{ color: "rgb(98, 0, 238)" }}>{contractAddress}</span>
        </div>
      </div>
      <div className={styles.btns}>
        <button onClick={mint} disabled={creatingTransaction}>
          Mint
        </button>
        <button onClick={sendTokens} disabled={creatingTransaction}>
          Send Tokens
        </button>
        <button onClick={withdraw} disabled={creatingTransaction}>
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default TokenDetails;
