import { NavLink } from "react-router";
import "./sidebar.less";

interface MenuItem {
  label?: string;
  to?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "Flow",
    children: [
      { label: "工作流", to: "/flow" },
      { label: "执行记录", to: "/flow-record" },
    ],
  },
];

export default () => {
  return (
    <div className="sidebar">
      {menuItems.map((item, idx) => {
        return (
          <div key={idx}>
            {item.label && (
              <div className="menuGroup">
                <div>{item.label}</div>
              </div>
            )}
            {item.children?.map((child, idx) => {
              return (
                <NavLink to={child.to as string} className="menuItem" key={idx}>
                  {child.label}
                </NavLink>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
