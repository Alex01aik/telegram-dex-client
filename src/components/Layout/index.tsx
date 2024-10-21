import { PropsWithChildren } from "react";
import SideNav from "./components/SideNav";
import Header from "./components/Header";
import { Layout as AntdLayout } from "antd";

export type LayoutProps = {} & PropsWithChildren;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntdLayout>
      <Header />
      <div
        id="view"
        style={{
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <SideNav />
        <AntdLayout.Content
          style={{
            padding: 24,
          }}
        >
          {children}
        </AntdLayout.Content>
      </div>
    </AntdLayout>
  );
};

export default Layout;
