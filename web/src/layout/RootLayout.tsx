import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Layout from "tdesign-react/es/layout/Layout";
import HeaderBar from "./HeaderBar";

export default () => {
    const { Header, Content, Aside } = Layout
    return (
        <Layout style={{ height: "100vh" }}>
            <Header height="40px" style={{ minHeight: "40px", backgroundColor: "transparent" }}>
                <HeaderBar />
            </Header>
            <Layout style={{ height: "calc(100vh-40px)" }}>
                <Aside width="200px">
                    <SideBar />
                </Aside>
                <Content style={{ height: "calc(100vh-40px)" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}