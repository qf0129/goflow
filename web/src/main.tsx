import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import RootLayout from "./components/root-layout/index.tsx";
import { App, ConfigProvider, ThemeConfig } from "antd";
import { AxiosInterceptor } from "./apis/request.tsx";
import NiceModal from "@ebay/nice-modal-react";
import Flow from "./pages/flow/index.tsx";
import FlowDetail from "./pages/flow/detail/index.tsx";
import FlowExecution from "./pages/flow-execution/index.tsx";
import FlowExecutionDetail from "./pages/flow-execution/detail/index.tsx";
import FlowVersion from "./pages/flow/version/index.tsx";

const customTheme: ThemeConfig = {
  cssVar: true,
  hashed: false,
  token: {
    colorPrimary: "#0052d9",
    colorPrimaryHover: "#366ef4",
    colorPrimaryActive: "#0052d9",
    borderRadius: 1,
  },
  components: { Menu: { motion: false, algorithm: true } },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={customTheme}>
      <App style={{ height: "100vh" }}>
        <AxiosInterceptor>
          <NiceModal.Provider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<Navigate to="/flow" replace />} />
                  <Route path="flow" element={<Flow />} />
                  <Route path="flow/:id" element={<FlowDetail />} />
                  <Route path="flow/:id/version/:vid" element={<FlowVersion />} />
                  <Route path="flow-execution" element={<FlowExecution />} />
                  <Route path="flow-execution/:id" element={<FlowExecutionDetail />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </NiceModal.Provider>
        </AxiosInterceptor>
      </App>
    </ConfigProvider>
  </StrictMode>
);
