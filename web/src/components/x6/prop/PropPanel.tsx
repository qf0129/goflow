import "./PropPanel.less";
import { Graph, Node } from "@antv/x6";
import { FC } from "react";

interface PropPanelProps {
  node?: Node;
  graph?: Graph;
}

const PropPanel: FC<PropPanelProps> = ({ node }) => {
  return (
    <div className="prop-panel" style={{ right: node ? "20px" : "-400px" }}>
      <div>属性面板</div>
      {node && (
        <div>
          <div>{node.id}</div>
          <div>{node.getProp("label")}</div>
        </div>
      )}
    </div>
  );
};

export default PropPanel;
