import "./styles.css";
import { Layout } from "antd";

export type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  return (
    <Layout.Header>
      <h1 id="text-logo">Telegram DEX Client</h1>
    </Layout.Header>
  );
};

export default Header;
