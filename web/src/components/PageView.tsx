import { FC, ReactNode } from "react";
import { Breadcrumb, Button, Space, TdBreadcrumbItemProps } from "tdesign-react";

interface PageViewProps {
  children: ReactNode;
  title?: string;
  titleAfter?: ReactNode;
  action?: ReactNode;
  showBack?: boolean;
  breadcrumbs?: Array<TdBreadcrumbItemProps>;
}
const goBack = () => {
  window.history.back();
};

const PageView: FC<PageViewProps> = ({ title, children, titleAfter, action, showBack, breadcrumbs }) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#f7f7f7",
        padding: "0 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", height: "60px" }}>
        <Space align="center" style={{ flex: 1 }}>
          {showBack ? (
            <Button theme="default" onClick={goBack}>
              ←
            </Button>
          ) : null}
          <h2>{title}</h2>
          <Breadcrumb options={breadcrumbs} />
          <Space align="center">{titleAfter}</Space>
        </Space>
        <Space align="center">{action}</Space>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default PageView;
