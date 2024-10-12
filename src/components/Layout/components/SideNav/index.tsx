import { Menu } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../providers/AuthProvider";

export type NavItemType = {
  label: string | JSX.Element;
  key: string;
};

const unAuthNavs: NavItemType[] = [
  { key: "login", label: <Link to="/login">LOGIN</Link> },
  { key: "register", label: <Link to="/register">REGISTER</Link> },
];

const userNavs: NavItemType[] = [
  { key: "trades", label: <Link to="/trades">TRADES</Link> },
  { key: "assets", label: <Link to="/assets">ASSETS</Link> },
  { key: "rules", label: <Link to="/rules">RULES</Link> },
];

const adminNavs: NavItemType[] = [
  {
    key: "all-trades",
    label: <Link to="/all-trades">ALL TRADES</Link>,
  },
  {
    key: "users",
    label: <Link to="/users">USERS</Link>,
  },
  {
    key: "informators",
    label: <Link to="/informators">INFORMATORS</Link>,
  },
  {
    key: "chats",
    label: <Link to="/chats">CHATS</Link>,
  },
  { key: "snapshots", label: <Link to="/snapshots">SNAPSHOTS</Link> },
];

export type SideNavProps = {};

const SideNav: React.FC<SideNavProps> = () => {
  const { user, isAdmin } = useAuth();
  return (
    <Menu
      items={
        user ? (isAdmin ? [...adminNavs, ...userNavs] : userNavs) : unAuthNavs
      }
      style={{
        width: "240px",
        minWidth: "240px",
      }}
    />
  );
};

export default SideNav;
