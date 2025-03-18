import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Layout from "tdesign-react/es/layout/Layout";
import HeaderBar from "./HeaderBar";
import NiceModal from "@ebay/nice-modal-react";

export default () => {
  const { Header, Content, Aside } = Layout;
  return (
    <NiceModal.Provider>
      <Layout style={{ height: "100vh" }}>
        <Header height="50px" style={{ minHeight: "50px", position: "sticky", top: 0, zIndex: 10 }}>
          <HeaderBar />
        </Header>
        <Layout style={{ height: "calc(100vh-50px)" }}>
          <Aside width="200px">
            <SideBar />
          </Aside>
          <Content style={{ height: "calc(100vh-50px)" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </NiceModal.Provider>
  );
};
