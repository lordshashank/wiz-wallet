import styles from "../styles/Header.module.css";
const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>Wiz Wallet</h1>
      <button>Connect</button>
    </header>
  );
};

export default Header;
