import "./PropPanel.less";
import { Graph, Node } from "@antv/x6";
import { FC } from "react";

interface PropPanelProps {
  node?: Node;
  graph?: Graph;
}

const PropPanel: FC<PropPanelProps> = ({ node }) => {
  return (
    <div className="prop-panel">
      <div>属性面板</div>
    </div>
  );
};

export default PropPanel;
