import { Menu } from "antd";

export type NavItemType = {
  label: string | JSX.Element;
  key: string;
};

const navs: NavItemType[] = [
  { key: "trades", label: <a href="/trades">TRADES</a> },
  {
    key: "informators",
    label: <a href="/informators">INFORMATORS</a>,
  },
  { key: "assets", label: <a href="/assets">ASSETS</a> },
  { key: "snapshots", label: <a href="/snapshots">SNAPSHOTS</a> },
];

export type SideNavProps = {};

const SideNav: React.FC<SideNavProps> = () => {
  return (
    <Menu
      items={navs}
      style={{
        width: "240px",
        minWidth: "240px",
      }}
    />
  );
};

export default SideNav;
