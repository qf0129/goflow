import "./header.less";
import logoSvg from "../../assets/logo.svg";

export default () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logoSvg} alt="QVE" />
        <span>GoFlow</span>
      </div>
    </header>
  );
};
