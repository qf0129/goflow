import "./index.css";
import "tdesign-react/es/style/index.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ConfigProvider } from "tdesign-react";
import { CaretRightSmallIcon } from "tdesign-icons-react";

createRoot(document.getElementById("root")!).render(
  <>
    <ConfigProvider globalConfig={{ table: { expandIcon: <CaretRightSmallIcon color="#0052d9" /> } }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </>
);
