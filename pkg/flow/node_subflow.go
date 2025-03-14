package flow

import (
	"encoding/json"
	"fmt"

	"github.com/qf0129/gox/pkg/dbx"
)

type SubflowNode struct{}

func (n *SubflowNode) Handle(o *NodeContext) ([]byte, error) {
	flow, err := dbx.QueryOneByPk[Flow](o.Node.SubFlowId)
	if err != nil {
		return nil, fmt.Errorf("查询工作流失败: %v", err)
	}

	if flow.PublishedVersionId == "" {
		return nil, fmt.Errorf("子工作流未发布")
	}

	version, err := dbx.QueryOneByPk[FlowVersion](flow.PublishedVersionId)
	if err != nil {
		return nil, fmt.Errorf("查询工作流版本失败: %v", err)
	}

	branch := &Branch{}
	if err := json.Unmarshal(version.Content, branch); err != nil {
		return nil, fmt.Errorf("工作流解析json失败, %v", err)
	}

	if branch.StartId == "" || len(branch.Nodes) == 0 {
		return nil, fmt.Errorf("无效的子工作流")
	}

	existsExecutions, err := queryExistsSubExecutions(o.Execution.Id, o.Node.Id, branch.StartId)
	if err != nil {
		return nil, fmt.Errorf("查询子执行记录失败: %v", err)
	}

	var subExecution *FlowExecution
	if len(existsExecutions) > 0 {
		// 存在已完成的子记录则跳过
		subExecution = &existsExecutions[0]
		if existsExecutions[0].Status == FlowStatusCompleted {
			return existsExecutions[0].Output, nil
		}
	} else {
		subExecution, err = createSubFlowExecution(o.Execution, o.Step, o.Step.Input, branch.StartId)
		if err != nil {
			return nil, fmt.Errorf("创建子执行记录执行失败: %v", err)
		}
	}

	err = NewBranchHandler(subExecution).Start(&BranchHandlerOption{
		Branch: branch,
		NodeId: branch.StartId,
		Input:  subExecution.Input,
	})
	if err != nil {
		return nil, fmt.Errorf("子工作流执行失败: %v", err)
	}
	return subExecution.Output, nil
}

func (n *SubflowNode) Check(node *Node) error {
	if node.SubFlowId == "" {
		return fmt.Errorf("子流程Id不能为空")
	}
	return nil
}

func queryExistsSubExecutions(parentId, parentNodeId, startNodeId string) ([]FlowExecution, error) {
	return dbx.QueryAll[FlowExecution](&dbx.QueryOption{
		Filter: map[string]interface{}{
			"parent_id":      parentId,
			"parent_node_id": parentNodeId,
			"start_node_id":  startNodeId,
		},
		Limit: 1,
	})
}
