import { useAuth } from "../../../../providers/AuthProvider";
import "./styles.css";
import { Flex, Layout } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const { user, logout } = useAuth();
  return (
    <Layout.Header id="header">
      <h1 id="text-logo">Telegram DEX Client</h1>
      {user && (
        <Flex gap={12}>
          <Link to="/profile">
            <UserOutlined className="header-icon" />
          </Link>
          <LogoutOutlined className="header-icon" onClick={logout} />
        </Flex>
      )}
    </Layout.Header>
  );
};

export default Header;
