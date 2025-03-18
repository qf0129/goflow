import "./SideBar.less";
import { NavLink } from "react-router-dom";

export default () => {
  const items = [
    {
      Title: "flow",
      Children: [
        {
          Title: "工作流",
          Path: "flow",
        },
      ],
    },
    // {
    //   Title: "其他",
    //   Children: [
    //     {
    //       Title: "测试",
    //       Path: "test",
    //     },
    //   ],
    // },
  ];

  return (
    <>
      <div className="menuList">
        {items.map((item, i) => (
          <div key={i}>
            <div className="menuGroup">{item.Title}</div>
            {item.Children.map((child, j) => (
              <NavLink key={j} className={"menuItem"} to={child.Path}>
                {child.Title}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
