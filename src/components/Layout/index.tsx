import { PropsWithChildren } from "react";
import SideNav from "./components/SideNav";
import Header from "./components/Header";
import { Layout as AntdLayout, Flex } from "antd";

export type LayoutProps = {} & PropsWithChildren;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntdLayout>
      <Header />
      <Flex
        style={{
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <SideNav />
        <AntdLayout.Content
          style={{
            padding: 24,
            // TODO find 240px and move to single source
            width: "calc(100vw - 240px)",
          }}
        >
          {children}
        </AntdLayout.Content>
      </Flex>
    </AntdLayout>
  );
};

export default Layout;
