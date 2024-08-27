import { FC, ReactNode } from "react";
import { Button, Space } from "tdesign-react";

interface PageViewProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  hideBack?: boolean;
}
const goBack = () => {
  window.history.back();
};

const PageView: FC<PageViewProps> = ({ title, children, action, hideBack }) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#fff",
        padding: "0 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", height: "60px" }}>
        <Space align="center" style={{ flex: 1 }}>
          {hideBack ? null : (
            <Button theme="default" onClick={goBack}>
              ←
            </Button>
          )}
          <h2>{title}</h2>
        </Space>
        <Space align="center">{action}</Space>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default PageView;
