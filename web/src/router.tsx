import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import FlowList from "./pages/flow/FlowList";
import FlowDetail from "./pages/flow/FlowDetail";
import FlowVersionEdit from "./pages/flow/FlowVersionEdit";
import TestPage from "./pages/test/TestPage";
import FlowExecutionDetail from "./pages/flow/FlowExecutionDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "flow",
        element: <FlowList />,
      },
      {
        path: "flow/:id",
        element: <FlowDetail />,
      },
      {
        path: "flow_version/:id/edit",
        element: <FlowVersionEdit />,
      },
      {
        path: "flow_execution/:id",
        element: <FlowExecutionDetail />,
      },
      {
        path: "test",
        element: <TestPage />,
      },
    ],
  },
]);
