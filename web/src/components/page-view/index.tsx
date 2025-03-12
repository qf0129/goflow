import { Breadcrumb, Col, Row, Space } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { ReactNode } from "react";
import { Link } from "react-router";

interface PageViewProps {
  children: ReactNode;
  title?: string;
  titleAfter?: ReactNode;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  breadcrumb?: ItemType[];
  maxWidth?: string;
}

export default ({ children, title, leftAction, rightAction, breadcrumb, maxWidth }: PageViewProps) => {
  function itemRender(route: ItemType, _: any, routes: ItemType[], paths: string[]) {
    const isLast = route?.path === routes[routes.length - 1]?.path;
    return isLast ? <span>{route.title}</span> : <Link to={`/${paths.join("/")}`}>{route.title}</Link>;
  }

  return (
    <div style={{ padding: "16px" }}>
      {breadcrumb && <Breadcrumb items={breadcrumb} style={{ padding: "10px 0" }} itemRender={itemRender} />}
      <Row>
        <Space>
          {title && <h2>{title}</h2>}
          {leftAction}
        </Space>
        <Col flex={1}></Col>
        <Space>{rightAction}</Space>
      </Row>
      <div style={{ paddingTop: "10px", maxWidth: maxWidth, margin: "0 auto" }}>{children}</div>
    </div>
  );
};
