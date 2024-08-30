import "./SideBar.less";
import { NavLink } from "react-router-dom";

export default () => {
  return (
    <div className="menuList">
      <NavLink className={"menuItem"} to="flow">
        任务流
      </NavLink>
      <NavLink className={"menuItem"} to="workorder">
        工单
      </NavLink>
      <NavLink className={"menuItem"} to="test">
        测试
      </NavLink>
    </div>
  );
};
