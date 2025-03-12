import { Outlet } from "react-router";
import Header from "./header";
import Sidebar from "./sidebar";

export default () => {
  return (
    <>
      <Header />
      <main style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </>
  );
};
