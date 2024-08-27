import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import FlowList from "./pages/flow/FlowList";
import WorkorderList from "./pages/workorder/WorkorderList";
import FlowDetail from "./pages/flow/FlowDetail";
import FlowVersionEdit from "./pages/flow/FlowVersionEdit";
import TestPage from "./pages/test/TestPage";

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
        path: "flow/:flowId/version/:versionId/edit",
        element: <FlowVersionEdit />,
      },
      {
        path: "workorder",
        element: <WorkorderList />,
      },
      {
        path: "test",
        element: <TestPage />,
      },
    ],
  },
]);
